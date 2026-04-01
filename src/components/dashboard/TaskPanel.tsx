"use client";

import { useMemo, useState, useTransition } from "react";
import {
  createTask,
  deleteTask,
  toggleTask,
  updateTask,
} from "@/app/actions/tasks";
import { MirrorCard } from "@/components/mirror/MirrorCard";
import type { Task, TaskSection } from "@/types/task";

const SECTIONS: { id: TaskSection; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "later", label: "Later" },
];

type Props = {
  initialTasks: Task[];
};

export function TaskPanel({ initialTasks }: Props) {
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  const grouped = useMemo(() => {
    const g: Record<TaskSection, Task[]> = { today: [], later: [] };
    for (const t of initialTasks) {
      g[t.section].push(t);
    }
    for (const s of SECTIONS) {
      g[s.id].sort((a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at));
    }
    return g;
  }, [initialTasks]);

  function run(action: () => Promise<{ error?: string } | { ok?: boolean }>) {
    startTransition(() => {
      void action();
    });
  }

  return (
    <MirrorCard title="Tasks" className="min-h-[320px] lg:min-h-0">
      <div className="flex flex-col gap-8">
        {SECTIONS.map(({ id, label }) => (
          <div key={id}>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-white/45">
              {label}
            </h3>
            <ul className="space-y-2">
              {grouped[id].map((task) => (
                <li
                  key={task.id}
                  className="group flex items-start gap-3 rounded-lg border border-transparent px-1 py-1 transition hover:border-white/[0.06] hover:bg-white/[0.02]"
                >
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => run(() => toggleTask(task.id, !task.completed))}
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-white/25 text-[10px] text-white/80 hover:border-white/50 disabled:opacity-50"
                    aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                  >
                    {task.completed ? "✓" : ""}
                  </button>
                  <div className="min-w-0 flex-1">
                    {editingId === task.id ? (
                      <input
                        autoFocus
                        className="w-full rounded border border-white/20 bg-black px-2 py-1 text-sm text-white outline-none focus:border-white/40"
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        onBlur={() => {
                          const next = draftTitle.trim();
                          setEditingId(null);
                          if (next && next !== task.title) {
                            run(() => updateTask(task.id, { title: next }));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                          if (e.key === "Escape") {
                            setEditingId(null);
                            setDraftTitle(task.title);
                          }
                        }}
                      />
                    ) : (
                      <button
                        type="button"
                        className={`w-full text-left text-sm ${
                          task.completed ? "text-white/35 line-through" : "text-white/90"
                        }`}
                        onClick={() => {
                          setEditingId(task.id);
                          setDraftTitle(task.title);
                        }}
                      >
                        {task.title}
                      </button>
                    )}
                    <div className="mt-1 flex flex-wrap items-center gap-2 opacity-0 transition group-hover:opacity-100">
                      <label className="text-[10px] text-white/35">
                        Section
                        <select
                          className="ml-1 rounded border border-white/15 bg-black px-1 py-0.5 text-[10px] text-white/70"
                          value={task.section}
                          disabled={pending}
                          onChange={(e) =>
                            run(() =>
                              updateTask(task.id, {
                                section: e.target.value as TaskSection,
                              }),
                            )
                          }
                        >
                          {SECTIONS.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        disabled={pending}
                        className="text-[10px] text-white/40 hover:text-red-300/90"
                        onClick={() => run(() => deleteTask(task.id))}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <AddTaskRow section={id} disabled={pending} />
          </div>
        ))}
      </div>
    </MirrorCard>
  );
}

function AddTaskRow({
  section,
  disabled,
}: {
  section: TaskSection;
  disabled: boolean;
}) {
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    const t = value.trim();
    if (!t) return;
    startTransition(() => {
      void createTask(t, section).then(() => setValue(""));
    });
  }

  return (
    <div className="mt-3 flex gap-2">
      <input
        placeholder={`Add to ${section}…`}
        className="min-w-0 flex-1 rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-white/25 focus:outline-none"
        value={value}
        disabled={disabled || pending}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
      />
      <button
        type="button"
        disabled={disabled || pending || !value.trim()}
        onClick={submit}
        className="shrink-0 rounded-md border border-white/15 px-3 py-2 text-xs text-white/80 hover:bg-white/[0.04] disabled:opacity-40"
      >
        Add
      </button>
    </div>
  );
}
