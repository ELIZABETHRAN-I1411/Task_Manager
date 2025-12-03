"use client"

import { useState, useEffect } from "react"
import TaskForm from "@/components/task-form"
import TaskList from "@/components/task-list"
import TaskStats from "@/components/task-stats"
import type { Task } from "@/types/task"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "todo" | "in_progress" | "done">("all")

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true)
      const url =
        filter === "all" ? `${API_BASE_URL}/items?limit=100` : `${API_BASE_URL}/items?status=${filter}&limit=100`

      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch tasks")
      const data = await response.json()
      setTasks(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [filter])

  const handleAddTask = async (taskData: {
    title: string
    description: string
    priority: number
    due_date: string
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...taskData,
          status: "todo",
        }),
      })
      if (!response.ok) throw new Error("Failed to create task")
      await fetchTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task")
    }
  }

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error("Failed to update task")
      await fetchTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task")
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete task")
      await fetchTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task")
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Task Manager</h1>
          <p className="text-slate-300">Stay organized and manage your tasks efficiently</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">{error}</div>
        )}

        {/* Stats */}
        <TaskStats tasks={tasks} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-1">
            <TaskForm onAddTask={handleAddTask} />
          </div>

          {/* Task List */}
          <div className="lg:col-span-2">
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {["all", "todo", "in_progress", "done"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as typeof filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === status ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {status === "in_progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Task List */}
            <TaskList tasks={tasks} loading={loading} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />
          </div>
        </div>
      </div>
    </main>
  )
}
