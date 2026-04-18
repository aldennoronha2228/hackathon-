import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";
import { useThemeStore } from "../store/useThemeStore";

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  securityLevel: "loose",
  themeVariables: {
    fontFamily: "Inter, sans-serif"
  }
});

export default function MermaidViewer({ chart }) {
  const ref = useRef(null);
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  useEffect(() => {
    if (ref.current && chart) {
      mermaid.initialize({
        theme: isDark ? "dark" : "default"
      });
      // Try to render
      try {
        mermaid.render(`mermaid-${Math.random().toString(36).substring(2, 9)}`, chart)
          .then((result) => {
            if (ref.current) {
              ref.current.innerHTML = result.svg;
            }
          })
          .catch((e) => console.error("Mermaid render error:", e));
      } catch (e) {
        console.error("Mermaid error:", e);
      }
    }
  }, [chart, isDark]);

  return <div ref={ref} className="overflow-x-auto w-full flex justify-center py-4" />;
}
