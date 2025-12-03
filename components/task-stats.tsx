"use client"

import type { Task } from "@/types/task"

interface TaskStatsProps {
  tasks: Task[]
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div className="text-2xl font-bold text-white">{stats.total}</div>
        <div className="text-sm text-slate-400">Total Tasks</div>
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div className="text-2xl font-bold text-blue-400">{stats.todo}</div>
        <div className="text-sm text-slate-400">To Do</div>
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div className="text-2xl font-bold text-yellow-400">{stats.inProgress}</div>
        <div className="text-sm text-slate-400">In Progress</div>
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div className="text-2xl font-bold text-green-400">{stats.done}</div>
        <div className="text-sm text-slate-400">Done</div>
      </div>
    </div>
  )
}
