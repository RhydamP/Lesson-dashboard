export type Lesson = {
  id: string
  title: string
  date: string
  completed: boolean
}

export type UserLesson = {
  lesson_id: string
  completed: boolean
  lessons: Lesson
}

export type SupabaseLessonRow = {
  lesson_id: string
  completed_at: string | null
  lessons: {
    id: string
    title: string
    date: string
  } | null
}

interface AuthUser {
  id: string
  email: string
  // add other properties you use
}