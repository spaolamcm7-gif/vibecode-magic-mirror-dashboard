export type TaskSection = "today" | "later";

export type Task = {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  section: TaskSection;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
