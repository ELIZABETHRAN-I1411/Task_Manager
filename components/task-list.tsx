"use client"

import type { Task } from "@/types/task"
import TaskCard from "./task-card"

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
}

export default function TaskList({ tasks, loading, onUpdateTask, onDeleteTask }: TaskListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading tasks...</div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-slate-800 rounded-lg border border-slate-700">
        <div className="text-slate-400 mb-2">No tasks yet</div>
        <div className="text-sm text-slate-500">Create your first task to get started</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onUpdate={onUpdateTask} onDelete={onDeleteTask} />
      ))}
    </div>
  )
}
