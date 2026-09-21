import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const PDF_TYPE = "application/pdf";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_PDF_BYTES = 10 * 1024 * 1024;

export type UploadKind = "image" | "pdf" | "any";

function extensionFor(name: string, contentType: string) {
  const fromName = path.extname(name).toLowerCase();
  if (fromName) {
    return fromName;
  }

  if (contentType === "image/jpeg") return ".jpg";
  if (contentType === "image/png") return ".png";
  if (contentType === "image/webp") return ".webp";
  if (contentType === "image/gif") return ".gif";
  if (contentType === PDF_TYPE) return ".pdf";
  return "";
}

function sanitizeBase(name: string) {
  return name
    .replace(path.extname(name), "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function validateUpload(file: File, kind: UploadKind) {
  const type = file.type;

  if (kind === "image" && !IMAGE_TYPES.has(type)) {
    throw new Error("Upload a JPEG, PNG, WebP, or GIF image.");
  }

  if (kind === "pdf" && type !== PDF_TYPE) {
    throw new Error("Upload a PDF file.");
  }

  if (kind === "any" && !IMAGE_TYPES.has(type) && type !== PDF_TYPE) {
    throw new Error("Upload an image or a PDF.");
  }

  const limit = type === PDF_TYPE ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
  if (file.size > limit) {
    throw new Error(
      `That file is too large. Max size is ${Math.round(limit / (1024 * 1024))}MB.`,
    );
  }
}

function objectKey(file: File) {
  const ext = extensionFor(file.name, file.type);
  const base = sanitizeBase(file.name) || "upload";
  return `portfolio/${base}-${randomUUID()}${ext}`;
}

function hasS3Config() {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_REGION &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY,
  );
}

function hasCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

async function uploadToS3(file: File, buffer: Buffer) {
  const bucket = process.env.S3_BUCKET!;
  const region = process.env.S3_REGION!;
  const key = objectKey(file);
  const client = new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.S3_ENDPOINT || undefined,
  });

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }),
  );

  if (process.env.S3_PUBLIC_URL) {
    return `${process.env.S3_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

async function uploadToCloudinary(file: File, buffer: Buffer) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "portfolio";
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const body = new FormData();
  body.append("file", new Blob([new Uint8Array(buffer)], { type: file.type }), file.name);
  body.append("api_key", apiKey);
  body.append("timestamp", String(timestamp));
  body.append("signature", signature);
  body.append("folder", folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/auto/upload`, {
    method: "POST",
    body,
  });
  const json = (await response.json()) as { secure_url?: string; error?: { message?: string } };

  if (!response.ok || !json.secure_url) {
    throw new Error(json.error?.message ?? "Cloudinary upload failed.");
  }

  return json.secure_url;
}

async function uploadLocally(file: File, buffer: Buffer) {
  const ext = extensionFor(file.name, file.type);
  const filename = `${sanitizeBase(file.name) || "upload"}-${randomUUID()}${ext}`;
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), buffer);
  return `/uploads/${filename}`;
}

export async function storeUpload(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (hasS3Config()) {
    return uploadToS3(file, buffer);
  }

  if (hasCloudinaryConfig()) {
    return uploadToCloudinary(file, buffer);
  }

  return uploadLocally(file, buffer);
}

export function storageBackend() {
  if (hasS3Config()) return "s3";
  if (hasCloudinaryConfig()) return "cloudinary";
  return "local";
}
