"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type PipelineNode = {
  id: string;
  top: number;
  lit: boolean;
};

export function PipelineSpine() {
  const pathname = usePathname();
  const [nodes, setNodes] = useState<PipelineNode[]>([]);
  const [progress, setProgress] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const root = document.querySelector<HTMLElement>("[data-pipeline-root]");
    if (!root) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let frame = 0;

    function measure() {
      if (!root) return;

      const sections = [
        ...root.querySelectorAll<HTMLElement>("[data-pipeline-node]"),
      ];

      if (sections.length < 2) {
        setEnabled(false);
        return;
      }

      const rootRect = root.getBoundingClientRect();
      const rootHeight = root.offsetHeight;
      const head = window.innerHeight * 0.38;
      const raw = ((head - rootRect.top) / rootHeight) * 100;
      const nextProgress = reduceMotion
        ? 100
        : Math.min(100, Math.max(0, raw));
      const fillPx = (nextProgress / 100) * rootHeight;

      const nextNodes = sections.map((section, index) => {
        const top =
          ((section.getBoundingClientRect().top - rootRect.top) / rootHeight) *
          100;

        return {
          id: section.id || `node-${index}`,
          top,
          lit: section.offsetTop <= fillPx - 8,
        };
      });

      setEnabled(true);
      setProgress(nextProgress);
      setNodes(nextNodes);
    }

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const observer = new ResizeObserver(onScroll);
    observer.observe(root);
    void document.fonts.ready.then(measure);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer.disconnect();
    };
  }, [pathname]);

  if (pathname !== "/" || !enabled) {
    return null;
  }

  return (
    <aside
      className="pipeline"
      aria-hidden="true"
      style={
        {
          "--pipeline-progress": `${progress}%`,
        } as React.CSSProperties
      }
    >
      <div className="pipeline-track">
        <div className="pipeline-fill" />
      </div>
      <span className="pipeline-head" />
      {nodes.map((node) => (
        <div
          key={node.id}
          className={`pipeline-node${node.lit ? " is-lit" : ""}`}
          style={{ top: `${node.top}%` }}
        >
          <span className="pipeline-dot" />
        </div>
      ))}
    </aside>
  );
}
