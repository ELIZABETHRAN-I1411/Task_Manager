"use client"

import { useState } from "react"
import type { Task } from "@/types/task"
import { Button } from "@/components/ui/button"

interface TaskCardProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
}

const STATUS_COLORS: Record<string, string> = {
  todo: "bg-slate-600 text-slate-200",
  in_progress: "bg-blue-600 text-blue-100",
  done: "bg-green-600 text-green-100",
}

const PRIORITY_COLORS: Record<number, string> = {
  1: "text-blue-400",
  2: "text-green-400",
  3: "text-yellow-400",
  4: "text-orange-400",
  5: "text-red-400",
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [editedDescription, setEditedDescription] = useState(task.description || "")

  const handleStatusChange = (newStatus: string) => {
    onUpdate(task.id, { status: newStatus as Task["status"] })
  }

  const handleSaveEdit = async () => {
    if (editedTitle.trim()) {
      await onUpdate(task.id, {
        title: editedTitle.trim(),
        description: editedDescription.trim() || undefined,
      })
      setIsEditing(false)
    }
  }

  const priorityLabel = {
    1: "Low",
    2: "Low-Med",
    3: "Medium",
    4: "High",
    5: "Critical",
  }[task.priority]

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
            maxLength={200}
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
            maxLength={1000}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditedTitle(task.title)
                setEditedDescription(task.description || "")
                setIsEditing(false)
              }}
              className="bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-white break-words">{task.title}</h3>
            {task.description && <p className="text-sm text-slate-400 mt-1 break-words">{task.description}</p>}
          </div>

          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[task.status]}`}>
              {task.status === "in_progress"
                ? "In Progress"
                : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
            <span className={`text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>Priority: {priorityLabel}</span>
            {task.due_date && (
              <span className="text-xs text-slate-400">Due: {new Date(task.due_date).toLocaleDateString()}</span>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600 text-xs"
            >
              Edit
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(task.id)}
              className="bg-red-900/20 text-red-400 border-red-500/50 hover:bg-red-900/40 text-xs"
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
