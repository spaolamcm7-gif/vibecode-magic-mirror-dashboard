"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function DashboardHeader() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">Magic Mirror</p>
        <h1 className="mt-1 text-2xl font-light tracking-tight text-white sm:text-3xl">
          Dashboard
        </h1>
      </div>
      <button
        type="button"
        onClick={() => void signOut()}
        className="self-start rounded-md border border-white/15 px-4 py-2 text-xs text-white/75 transition hover:bg-white/[0.04] sm:self-auto"
      >
        Sign out
      </button>
    </header>
  );
}
