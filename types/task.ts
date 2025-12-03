export interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in_progress" | "done"
  priority: 1 | 2 | 3 | 4 | 5
  created_at: string
  updated_at: string
  due_date?: string
}
