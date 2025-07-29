'use client'
import AllLessons from '@/components/AllLessons'
import MyLessons from '@/components/MyLessons'
import { redirect } from 'next/navigation'
import AuthButton from '@/components/AuthButton'
import Sidebar from '@/components/Sidebar'
import { useCallback, useState } from 'react'
import { Lesson, UserLesson } from '@/types/lesson'
import { AuthUser } from '@supabase/supabase-js'
import React from 'react';


export default function DashboardPage({ 
  initialAllLessons, 
  initialUserLessons, 
  user 
}: {
  initialAllLessons: Lesson[],
  initialUserLessons: UserLesson[],
  user: AuthUser
}) {
  const [userLessons, setUserLessons] = useState(initialUserLessons)
  const [userLessonIds, setUserLessonIds] = useState(
    initialUserLessons.map(lesson => lesson.lesson_id)
  )

  const handleLessonStarted = (lessonId: string, lessonData: UserLesson) => {
    setUserLessons(prev => {
      const exists = prev.some(lesson => lesson.lesson_id === lessonId)
      if (exists) return prev
      return [...prev, lessonData]
    })
    setUserLessonIds(prev => {
      if (prev.includes(lessonId)) return prev
      return [...prev, lessonId]
    })
  }

  const handleLessonUpdate = useCallback((lessonIds: string[]) => {
    setUserLessonIds(lessonIds)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex font-inter">
      {/* Sidebar */}
      <Sidebar user={user} />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400/20 to-pink-500/20 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                    Welcome back, {user.email?.split('@')[0]}! 👋
                  </h1>
                  <p className="text-lg text-gray-600 font-medium">
                    Ready to continue your learning journey?
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="space-y-8">
            {/* My Lessons Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <MyLessons 
                lessons={userLessons} 
                onLessonUpdate={handleLessonUpdate}
              />
            </div>

            {/* All Courses Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
              <AllLessons 
                userId={user.id} 
                lessons={initialAllLessons}
                userLessonIds={userLessonIds}
                onLessonStarted={handleLessonStarted}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}