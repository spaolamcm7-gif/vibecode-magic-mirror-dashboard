"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MirrorCard } from "@/components/mirror/MirrorCard";

const ROTATE_MS = 120_000;

type QuoteState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; text: string; author: string };

async function fetchQuote(): Promise<{ text: string; author: string }> {
  const res = await fetch("https://api.quotable.io/random");
  if (!res.ok) throw new Error("Quote request failed");
  const data = (await res.json()) as { content: string; author: string };
  return { text: data.content, author: data.author };
}

export function QuoteWidget() {
  const [state, setState] = useState<QuoteState>({ status: "loading" });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(() => {
    setState({ status: "loading" });
    fetchQuote()
      .then((q) => {
        if (mounted.current) setState({ status: "ok", ...q });
      })
      .catch(() => {
        if (mounted.current)
          setState({ status: "error", message: "Could not load a quote." });
      });
  }, []);

  useEffect(() => {
    const boot = window.setTimeout(() => load(), 0);
    const id = window.setInterval(load, ROTATE_MS);
    return () => {
      window.clearTimeout(boot);
      window.clearInterval(id);
    };
  }, [load]);

  return (
    <MirrorCard title="Inspiration" className="min-h-[200px]">
      <div className="flex h-full flex-col justify-between gap-6">
        <div>
          {state.status === "loading" && (
            <p className="text-sm text-white/40">Finding words…</p>
          )}
          {state.status === "error" && (
            <p className="text-sm text-white/60">{state.message}</p>
          )}
          {state.status === "ok" && (
            <>
              <blockquote className="text-lg font-light leading-relaxed text-white/90">
                “{state.text}”
              </blockquote>
              <p className="mt-4 text-xs uppercase tracking-[0.15em] text-white/40">
                {state.author}
              </p>
            </>
          )}
        </div>
        <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] text-white/30">
            Auto-refresh every {ROTATE_MS / 60_000} min
          </p>
          <button
            type="button"
            onClick={() => load()}
            className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-white/80 transition hover:border-white/30 hover:bg-white/[0.04]"
          >
            New quote
          </button>
        </div>
      </div>
    </MirrorCard>
  );
}
