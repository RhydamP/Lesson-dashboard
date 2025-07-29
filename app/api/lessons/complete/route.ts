// app/api/lessons/complete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.redirect('/login')

  const { lessonId } = await req.json()

  const { error } = await supabase
    .from('lesson_completions')
    .update({ completed_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ success: true })
}
