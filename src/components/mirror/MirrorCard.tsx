import type { ReactNode } from "react";

type MirrorCardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function MirrorCard({ title, children, className = "" }: MirrorCardProps) {
  return (
    <section
      className={`flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] ${className}`}
    >
      {title ? (
        <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50">
          {title}
        </h2>
      ) : null}
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}
