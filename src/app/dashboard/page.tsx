import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuoteWidget } from "@/components/dashboard/QuoteWidget";
import { TaskPanel } from "@/components/dashboard/TaskPanel";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { createClient } from "@/lib/supabase/server";
import type { Task } from "@/types/task";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("section", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const list: Task[] = (tasks as Task[] | null) ?? [];
  const showSchemaHint =
    error?.message?.includes("relation") || error?.message?.includes("does not exist");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <DashboardHeader />
      {showSchemaHint ? (
        <p className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
          Tasks table not found. Run the SQL in{" "}
          <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-xs">
            supabase/migrations/001_tasks.sql
          </code>{" "}
          in the Supabase SQL Editor, then refresh.
        </p>
      ) : null}
      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        <div className="md:col-span-1 lg:col-span-4">
          <WeatherWidget />
        </div>
        <div className="md:col-span-1 lg:col-span-8">
          <QuoteWidget />
        </div>
        <div className="md:col-span-2 lg:col-span-12">
          <TaskPanel initialTasks={list} />
        </div>
      </div>
    </div>
  );
}
