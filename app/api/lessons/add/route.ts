import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.redirect('/login')

  const { lessonId } = await req.json()

  // ✅ Ensure user exists in `users` table
  const { error: userInsertError } = await supabase
    .from('users')
    .upsert([{ id: user.id, email: user.email }], {
      onConflict: 'id',
    })

  if (userInsertError) {
    return NextResponse.json({ error: userInsertError.message }, { status: 500 })
  }

  // ✅ Now insert lesson completion
  const { error } = await supabase
    .from('lesson_completions')
    .upsert([{ user_id: user.id, lesson_id: lessonId, completed_at: null }], {
      onConflict: 'user_id,lesson_id',
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
