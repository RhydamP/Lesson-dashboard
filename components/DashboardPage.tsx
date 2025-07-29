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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex font-inter">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        user={user} 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar}
      />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pt-16 lg:pt-8">
          {/* Header Section */}
          <div className="mb-8 lg:mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full -translate-y-12 translate-x-12 lg:-translate-y-16 lg:translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-tr from-indigo-400/20 to-pink-500/20 rounded-full translate-y-8 -translate-x-8 lg:translate-y-12 lg:-translate-x-12"></div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between relative z-10 space-y-4 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                    Welcome back, {user.email?.split('@')[0]}! 👋
                  </h1>
                  <p className="text-base lg:text-lg text-gray-600 font-medium">
                    Ready to continue your learning journey?
                  </p>
                </div>
                <div className="flex items-center space-x-4 flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg sm:text-xl lg:text-2xl">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="space-y-6 lg:space-y-8">
            {/* My Lessons Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
              <MyLessons 
                lessons={userLessons} 
                onLessonUpdate={handleLessonUpdate}
              />
            </div>

            {/* All Courses Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
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