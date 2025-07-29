import { fetchAllLessons, fetchUserLessons } from '@/lib/lessons'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardPage from '@/components/DashboardPage'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [allLessons, userLessons] = await Promise.all([
    fetchAllLessons(),
    fetchUserLessons(user.id),
  ])

  return (
    <DashboardPage 
      initialAllLessons={allLessons}
      initialUserLessons={userLessons}
      user={user}
    />
  )
}