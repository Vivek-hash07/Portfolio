import { renderMarkdown } from "@/lib/markdown";

export function Markdown({ content }: { content: string }) {
  return (
    <div
      className="markdown"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}
