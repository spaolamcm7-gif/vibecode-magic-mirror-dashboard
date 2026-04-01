import { NextResponse } from "next/server";

const FALLBACK = {
  text: "Small steps each day add up to real progress.",
  author: "Mirror",
};

/**
 * Server-side quote fetch avoids browser CORS blocks and dead third-party APIs.
 */
export async function GET() {
  const tryZen = async () => {
    const res = await fetch("https://zenquotes.io/api/random", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("zen");
    const data = (await res.json()) as Array<{ q: string; a: string }>;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.q) throw new Error("zen");
    return { text: row.q.replace(/\s+$/, ""), author: row.a || "Unknown" };
  };

  const tryQuotable = async () => {
    const res = await fetch("https://api.quotable.io/random", { cache: "no-store" });
    if (!res.ok) throw new Error("quotable");
    const row = (await res.json()) as { content: string; author: string };
    if (!row?.content) throw new Error("quotable");
    return { text: row.content, author: row.author || "Unknown" };
  };

  for (const fn of [tryZen, tryQuotable]) {
    try {
      const quote = await fn();
      return NextResponse.json(quote);
    } catch {
      /* try next */
    }
  }

  return NextResponse.json(FALLBACK);
}
