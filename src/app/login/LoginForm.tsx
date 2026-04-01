"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  errorHint?: string;
};

export function LoginForm({ errorHint }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(errorHint ?? null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: signError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (signError) {
      setError(signError.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-8">
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">Magic Mirror</p>
        <h1 className="mt-2 text-2xl font-light text-white">Sign in</h1>
        <p className="mt-2 text-sm text-white/45">
          Access is by invitation only. Ask your admin if you need an account.
        </p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.12em] text-white/40">
          Email
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-white placeholder:text-white/25 focus:border-white/25 focus:outline-none"
            placeholder="you@example.com"
          />
        </label>
        <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.12em] text-white/40">
          Password
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-white placeholder:text-white/25 focus:border-white/25 focus:outline-none"
          />
        </label>
        {error ? (
          <p className="text-sm text-red-300/90" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg border border-white/20 bg-white/[0.06] py-2.5 text-sm text-white transition hover:bg-white/[0.1] disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
