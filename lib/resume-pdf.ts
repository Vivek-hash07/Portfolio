import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
  type RGB,
} from "pdf-lib";
import type { PortfolioData } from "@/lib/data";
import { formatDateRange } from "@/lib/format";
import { getSiteUrl } from "@/lib/site";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;
const ACCENT = rgb(0.04, 0.37, 0.33);
const FG = rgb(0.09, 0.1, 0.13);
const MUTED = rgb(0.36, 0.4, 0.45);

function sanitize(value: string) {
  return value
    .replace(/[–—]/g, "-")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x09\x0a\x0d\x20-\x7e]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wrapText(font: PDFFont, text: string, size: number, maxWidth: number) {
  const words = sanitize(text).split(" ").filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    if (font.widthOfTextAtSize(word, size) <= maxWidth) {
      current = word;
      continue;
    }

    let chunk = "";
    for (const char of word) {
      const trial = chunk + char;
      if (font.widthOfTextAtSize(trial, size) <= maxWidth) {
        chunk = trial;
      } else {
        if (chunk) lines.push(chunk);
        chunk = char;
      }
    }
    current = chunk;
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

class ResumeDoc {
  private pages: PDFPage[] = [];
  private page: PDFPage;
  private y: number;

  constructor(
    private pdf: PDFDocument,
    private regular: PDFFont,
    private bold: PDFFont,
  ) {
    this.page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.pages.push(this.page);
    this.y = PAGE_HEIGHT - MARGIN;
  }

  private ensure(height: number) {
    if (this.y - height >= MARGIN) {
      return;
    }

    this.page = this.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.pages.push(this.page);
    this.y = PAGE_HEIGHT - MARGIN;
  }

  text(
    value: string,
    {
      font = this.regular,
      size = 10,
      color = FG,
      gap = 14,
    }: {
      font?: PDFFont;
      size?: number;
      color?: RGB;
      gap?: number;
    } = {},
  ) {
    const lines = wrapText(font, value, size, PAGE_WIDTH - MARGIN * 2);
    for (const line of lines) {
      this.ensure(gap);
      this.page.drawText(line, {
        x: MARGIN,
        y: this.y,
        size,
        font,
        color,
      });
      this.y -= gap;
    }
  }

  heading(value: string) {
    this.y -= 10;
    this.ensure(28);
    this.page.drawText(sanitize(value).toUpperCase(), {
      x: MARGIN,
      y: this.y,
      size: 9,
      font: this.bold,
      color: ACCENT,
    });
    this.y -= 8;
    this.page.drawRectangle({
      x: MARGIN,
      y: this.y,
      width: PAGE_WIDTH - MARGIN * 2,
      height: 0.8,
      color: rgb(0.85, 0.82, 0.76),
    });
    this.y -= 16;
  }

  bullet(value: string) {
    const size = 9.5;
    const gap = 13;
    const indent = 12;
    const lines = wrapText(
      this.regular,
      value,
      size,
      PAGE_WIDTH - MARGIN * 2 - indent,
    );

    for (const [index, line] of lines.entries()) {
      this.ensure(gap);
      if (index === 0) {
        this.page.drawCircle({
          x: MARGIN + 3,
          y: this.y + 3,
          size: 1.5,
          color: ACCENT,
        });
      }
      this.page.drawText(line, {
        x: MARGIN + indent,
        y: this.y,
        size,
        font: this.regular,
        color: FG,
      });
      this.y -= gap;
    }
  }
}

export async function buildResumePdf(data: PortfolioData) {
  if (!data.profile) {
    throw new Error("Profile is missing");
  }

  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const doc = new ResumeDoc(pdf, regular, bold);
  const { profile } = data;
  const siteUrl = getSiteUrl();

  doc.text(profile.name, { font: bold, size: 22, gap: 26, color: FG });
  doc.text(profile.title, { size: 11, color: MUTED, gap: 15 });

  const contact = [
    profile.location,
    profile.email,
    profile.phone,
    profile.linkedinUrl,
    profile.githubUrl,
    siteUrl,
  ]
    .filter(Boolean)
    .join("  |  ");

  doc.text(contact, { size: 8.5, color: MUTED, gap: 12 });
  doc.heading("Summary");
  doc.text(profile.summary, { size: 10, gap: 13 });

  if (data.experiences.length > 0) {
    doc.heading("Experience");
    for (const role of data.experiences) {
      doc.text(role.role, { font: bold, size: 11, gap: 14 });
      const company = [role.company, role.companyNote].filter(Boolean).join(" · ");
      doc.text(
        `${company}  |  ${formatDateRange(role.startDate, role.endDate)}`,
        { size: 9, color: MUTED, gap: 13 },
      );
      for (const bullet of role.bullets) {
        doc.bullet(bullet);
      }
      doc.text(" ", { size: 6, gap: 8 });
    }
  }

  if (data.projects.length > 0) {
    doc.heading("Projects");
    for (const project of data.projects) {
      const title = project.subtitle
        ? `${project.title} — ${project.subtitle}`
        : project.title;
      doc.text(title, { font: bold, size: 11, gap: 14 });
      if (project.techStack.length > 0) {
        doc.text(project.techStack.join(" · "), {
          size: 8.5,
          color: MUTED,
          gap: 12,
        });
      }
      for (const item of project.description) {
        doc.bullet(item);
      }
      doc.text(" ", { size: 6, gap: 8 });
    }
  }

  if (data.skillGroups.length > 0) {
    doc.heading("Skills");
    for (const group of data.skillGroups) {
      const skills = group.skills.map((skill) => skill.name).join(", ");
      if (!skills) continue;
      doc.text(`${group.label}: ${skills}`, { size: 9.5, gap: 13 });
    }
  }

  if (data.education.length > 0) {
    doc.heading("Education");
    for (const item of data.education) {
      doc.text(item.degree, { font: bold, size: 11, gap: 14 });
      doc.text(
        `${item.institution}  |  ${formatDateRange(item.startDate, item.endDate)}`,
        { size: 9, color: MUTED, gap: 13 },
      );
      if (item.detail) {
        doc.text(item.detail, { size: 9.5, gap: 13 });
      }
    }
  }

  if (data.certifications.length > 0) {
    doc.heading("Certifications");
    for (const cert of data.certifications) {
      const label = cert.issuer ? `${cert.name} — ${cert.issuer}` : cert.name;
      doc.bullet(label);
    }
  }

  pdf.setTitle(`${profile.name} — Résumé`);
  pdf.setAuthor(profile.name);
  pdf.setSubject(profile.title);
  pdf.setCreator(siteUrl);

  return pdf.save();
}

export function resumeFilename(name: string) {
  const slug = sanitize(name)
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "Resume"}.pdf`;
}
