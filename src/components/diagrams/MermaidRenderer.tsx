"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { Copy, Check, Download, ZoomIn, ZoomOut, RotateCcw, Maximize2, Code } from "lucide-react";
import { Button } from "@/lib/ui-index";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { useTheme } from "@/components/ui/ThemeProvider";

interface MermaidRendererProps {
  code: string;
  title: string;
  badge?: string;
  description?: string;
  className?: string;
}

export function MermaidRenderer({
  code,
  title,
  badge,
  description,
  className,
}: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [svgContent, setSvgContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  const rawId = useId();
  const id = "mermaid_" + rawId.replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    let isMounted = true;

    async function renderDiagram() {
      try {
        setIsLoading(true);
        setError(null);

        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;

        const isDark = theme === "dark";

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "neutral",
          securityLevel: "loose",
          themeVariables: isDark
            ? {
                darkMode: true,
                background: "#09090b",
                primaryColor: "#0284c7",
                primaryTextColor: "#f8fafc",
                primaryBorderColor: "#38bdf8",
                lineColor: "#38bdf8",
                secondaryColor: "#18181b",
                tertiaryColor: "#27272a",
                clusterBkg: "#18181b",
                clusterBorder: "#3f3f46",
                fontSize: "13px",
                fontFamily: "Inter, sans-serif",
              }
            : {
                darkMode: false,
                background: "#ffffff",
                primaryColor: "#0284c7",
                primaryTextColor: "#0f172a",
                primaryBorderColor: "#0284c7",
                lineColor: "#0284c7",
                secondaryColor: "#f8fafc",
                tertiaryColor: "#f1f5f9",
                clusterBkg: "#f8fafc",
                clusterBorder: "#e2e8f0",
                fontSize: "13px",
                fontFamily: "Inter, sans-serif",
              },
        });

        // Use unique render id on theme changes
        const renderId = `${id}_${theme}_${Date.now()}`;
        const { svg } = await mermaid.render(renderId, code.trim());
        if (isMounted) {
          setSvgContent(svg);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error("Mermaid render error:", err);
        if (isMounted) {
          setError(err?.message || "Failed to render diagram");
          setIsLoading(false);
        }
      }
    }

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [code, id, theme]);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2.4));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 backdrop-blur-md overflow-hidden flex flex-col transition-all shadow-xs",
        className
      )}
    >
      {/* Diagram Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-950/40">
        <div className="flex items-center gap-2.5">
          {badge && (
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/50 uppercase tracking-wider">
              {badge}
            </span>
          )}
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{title}</h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Zoom controls */}
          <div className="flex items-center bg-white dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 mr-1 shadow-xs">
            <button
              onClick={handleZoomOut}
              className="p-1 rounded text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono px-1.5 min-w-[36px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 rounded text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border-l border-zinc-200 dark:border-zinc-800 ml-0.5"
              title="Reset zoom"
              aria-label="Reset zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowCode(!showCode)}
            className="h-7 text-xs px-2"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showCode ? "Diagram" : "Code"}</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyCode}
            className="h-7 text-xs px-2"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadSvg}
            className="h-7 text-xs px-2"
            title="Download SVG"
          >
            <Download className="w-3.5 h-3.5" />
            <span>SVG</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(true)}
            className="h-7 w-7 p-0"
            title="Fullscreen view"
            aria-label="Fullscreen view"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {description && (
        <div className="px-4 py-2 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-950/20 border-b border-zinc-100 dark:border-zinc-800/40">
          {description}
        </div>
      )}

      {/* Main Diagram Canvas or Code View */}
      <div className="relative min-h-[320px] max-h-[560px] flex-1 overflow-auto p-6 flex items-center justify-center bg-white dark:bg-zinc-950/70">
        {isLoading && (
          <div className="flex flex-col items-center gap-3 text-zinc-500 dark:text-zinc-400">
            <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Rendering architectural topology...</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 text-rose-800 dark:text-rose-300 text-xs max-w-md">
            <p className="font-semibold mb-1">Diagram Rendering Notice</p>
            <p className="font-mono text-[11px]">{error}</p>
          </div>
        )}

        {!isLoading && !error && showCode && (
          <div className="w-full h-full text-left">
            <pre className="p-4 rounded-lg bg-zinc-900 text-sky-300 border border-zinc-800 text-xs font-mono overflow-x-auto select-all">
              {code}
            </pre>
          </div>
        )}

        {!isLoading && !error && !showCode && (
          <div
            ref={containerRef}
            style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
            className="transition-transform duration-150 flex items-center justify-center w-full"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
      </div>

      {/* Fullscreen Modal View */}
      <Modal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        maxWidth="5xl"
        title={
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/50 uppercase">
              {badge || "Diagram"}
            </span>
            <span>{title}</span>
          </div>
        }
      >
        <div className="p-6 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-auto max-h-[75vh] flex items-center justify-center">
          <div
            className="w-full flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      </Modal>
    </div>
  );
}
