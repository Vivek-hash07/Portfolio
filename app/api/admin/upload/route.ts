import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { storageBackend, storeUpload, validateUpload, type UploadKind } from "@/lib/storage";

export const runtime = "nodejs";

const KINDS = new Set<UploadKind>(["image", "pdf", "any"]);

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const kindValue = String(formData.get("kind") ?? "any");
  const kind = KINDS.has(kindValue as UploadKind) ? (kindValue as UploadKind) : "any";

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose a file to upload." }, { status: 400 });
  }

  try {
    validateUpload(file, kind);
    const url = await storeUpload(file);
    return NextResponse.json({ url, backend: storageBackend() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
