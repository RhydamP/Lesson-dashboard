// components/LessonCard.tsx
'use client'

import { Lesson } from '@/types/lesson'
import { useState } from 'react'

export default function LessonCard({ lesson }: { lesson: Lesson }) {
  const [completed, setCompleted] = useState(lesson.completed)

  async function markAsComplete() {
    const res = await fetch('/api/lessons/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId: lesson.id }),
    })

    if (res.ok) {
      setCompleted(true)
    }
  }

  return (
    <div className="border p-4 rounded mb-2">
      <h3>{lesson.title}</h3>
      <p>{lesson.date}</p>
      {completed ? (
        <p className="text-green-600">✅ Completed</p>
      ) : (
        <button onClick={markAsComplete} className="text-blue-600 underline">
          Mark as Complete
        </button>
      )}
    </div>
  )
}
