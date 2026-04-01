"use client";

import { useEffect, useState } from "react";
import { MirrorCard } from "@/components/mirror/MirrorCard";

const TACNA_LAT = -17.9869;
const TACNA_LON = -70.2469;

type WeatherState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "ok";
      temp: number;
      feels: number;
      label: string;
      emoji: string;
    };

/** WMO weather code → short label + a clear emoji (not abstract Unicode shapes). */
function wmoLabel(code: number): { label: string; emoji: string } {
  if (code === 0) return { label: "Clear sky", emoji: "☀️" };
  if (code <= 3) return { label: "Partly cloudy", emoji: "⛅" };
  if (code <= 48) return { label: "Fog", emoji: "🌫️" };
  if (code <= 57) return { label: "Drizzle", emoji: "🌦️" };
  if (code <= 67) return { label: "Rain", emoji: "🌧️" };
  if (code <= 77) return { label: "Snow", emoji: "❄️" };
  if (code <= 82) return { label: "Rain showers", emoji: "🌧️" };
  if (code <= 86) return { label: "Snow showers", emoji: "🌨️" };
  if (code <= 99) return { label: "Thunderstorm", emoji: "⛈️" };
  return { label: "Conditions", emoji: "🌡️" };
}

export function WeatherWidget() {
  const [state, setState] = useState<WeatherState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(TACNA_LAT));
    url.searchParams.set("longitude", String(TACNA_LON));
    url.searchParams.set("current", "temperature_2m,apparent_temperature,weather_code");
    url.searchParams.set("timezone", "America/Lima");

    fetch(url.toString())
      .then((r) => {
        if (!r.ok) throw new Error("Weather request failed");
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        const cur = data.current;
        const code = cur.weather_code as number;
        const { label, emoji } = wmoLabel(code);
        setState({
          status: "ok",
          temp: Math.round(cur.temperature_2m),
          feels: Math.round(cur.apparent_temperature),
          label,
          emoji,
        });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", message: "Could not load weather." });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <MirrorCard title="Tacna">
      <div className="flex flex-col gap-1">
        {state.status === "loading" && (
          <p className="text-sm text-white/40">Loading conditions…</p>
        )}
        {state.status === "error" && (
          <p className="text-sm text-white/60">{state.message}</p>
        )}
        {state.status === "ok" && (
          <>
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-5xl font-light tabular-nums tracking-tight text-white"
                aria-label={`Temperature ${state.temp} degrees Celsius`}
              >
                {state.temp}
                <span className="text-2xl text-white/50">°C</span>
              </span>
              <span className="text-4xl leading-none" title={state.label} role="img" aria-hidden>
                {state.emoji}
              </span>
            </div>
            <p className="mt-1 text-sm text-white/70">{state.label}</p>
            <p className="text-xs text-white/40">Feels like {state.feels}°C</p>
          </>
        )}
      </div>
    </MirrorCard>
  );
}
