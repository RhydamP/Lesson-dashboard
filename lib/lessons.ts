import { UserLesson } from '@/types/lesson'
import { createClient } from './supabase/server'

type RawUserLesson = {
  lesson_id: string
  completed_at: string | null
  lessons: {
    id: string
    title: string
    date: string
  }
}
export async function fetchAllLessons() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('date', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export async function fetchUserLessons(userId: string): Promise<UserLesson[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('lesson_completions')
    .select(`
      lesson_id,
      completed_at,
      lessons (
        id,
        title,
        date
      )
    `)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)

  if (!data) return []

  return data.map((item: {
    lesson_id: string
    completed_at: string | null
    lessons: {
      id: string
      title: string
      date: string
    } | {
      id: string
      title: string
      date: string
      
    }[]
  }): UserLesson => {
    const lesson = Array.isArray(item.lessons) ? item.lessons[0] : item.lessons

    return {
      lesson_id: item.lesson_id,
      completed: !!item.completed_at,
      lessons: {
        id: lesson.id,
        title: lesson.title,
        date: lesson.date,
        completed: !!item.completed_at,
      },
    }
  })
}
