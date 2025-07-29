// app/dashboard/LessonsClient.tsx
'use client'

import { useEffect } from 'react'
import LessonCard from '@/components/LessonCard'
import { Lesson } from '@/types/lesson'

interface Props {
  lessons: Lesson[]
}

export default function LessonsClient({ lessons }: Props) {
  useEffect(() => {
    console.log('Client component mounted. Lessons count:', lessons.length)
  }, [lessons])

  return (
    <div>
      {lessons.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  )
}
