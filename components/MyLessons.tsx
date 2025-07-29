'use client'

import { UserLesson } from '@/types/lesson'
import { useTransition, useState, useEffect, useRef } from 'react'

export default function MyLessons({ 
  lessons: initialLessons, 
  onLessonUpdate 
}: { 
  lessons: UserLesson[],
  onLessonUpdate?: (lessonIds: string[]) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [lessons, setLessons] = useState(initialLessons)
  const [completingLessonId, setCompletingLessonId] = useState<string | null>(null)
  const previousLessonIds = useRef<string>('')

  useEffect(() => {
    setLessons(initialLessons)
  }, [initialLessons])
  
  useEffect(() => {
    const lessonIds = lessons.map(l => l.lesson_id)
    const lessonIdsString = lessonIds.join(',')
    
    if (lessonIdsString !== previousLessonIds.current) {
      previousLessonIds.current = lessonIdsString
      onLessonUpdate?.(lessonIds)
    }
  }, [lessons, onLessonUpdate])

  const handleComplete = (lessonId: string) => {
    setCompletingLessonId(lessonId)
    startTransition(async () => {
      try {
        const response = await fetch('/api/lessons/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lessonId }),
        })

        if (response.ok) {
          setLessons(prev => {
            const updated = prev.map(lesson => 
              lesson.lesson_id === lessonId 
                ? { ...lesson, completed: true }
                : lesson
            )
            return updated
          })
        }
      } catch (error) {
        console.error('Error completing lesson:', error)
      } finally {
        setCompletingLessonId(null)
      }
    })
  }

  const calculateProgress = () => {
    if (lessons.length === 0) return 0
    const completedCount = lessons.filter(lesson => lesson.completed).length
    return Math.round((completedCount / lessons.length) * 100)
  }

  const progress = calculateProgress()
  const completedCount = lessons.filter(l => l.completed).length

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🎯</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 font-inter">My Lessons</h2>
            <p className="text-gray-600 font-medium">Track your learning progress</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-600">{completedCount}</div>
          <div className="text-sm text-gray-500 font-medium">of {lessons.length} completed</div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Overall Progress</h3>
          <span className="text-3xl font-bold text-emerald-600">{progress}%</span>
        </div>
        <div className="bg-emerald-200/50 rounded-full h-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-emerald-700 mt-2 font-medium">
          {progress === 100 ? '🎉 All lessons completed!' : `${lessons.length - completedCount} lessons remaining`}
        </p>
      </div>

      {/* Lessons Grid */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">📚</span>
          Your Active Lessons
        </h3>
        
        {lessons.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">📖</div>
            <h4 className="text-xl font-semibold text-gray-700 mb-2">No lessons started yet</h4>
            <p className="text-gray-500 font-medium">Start a lesson from &quot;All Courses&quot; to see it here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <div 
                key={lesson.lesson_id} 
                className={`group relative bg-gradient-to-br ${
                  lesson.completed 
                    ? 'from-emerald-50 to-teal-50 border-emerald-200' 
                    : 'from-blue-50 to-indigo-50 border-blue-200'
                } border-2 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                  lesson.completed 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {lesson.completed ? '✅ Complete' : '🔄 In Progress'}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2 pr-20 leading-tight">
                      {lesson.lessons.title}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center font-medium">
                        <span className="mr-2">📅</span>
                        Started
                      </span>
                      {lesson.completed && (
                        <span className="flex items-center text-emerald-600 font-medium">
                          <span className="mr-2">🏆</span>
                          Completed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4">
                    {lesson.completed ? (
                      <div className="flex items-center justify-center space-x-3 p-4 bg-emerald-100/50 rounded-xl">
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-white text-lg font-bold">✓</span>
                        </div>
                        <span className="text-emerald-700 font-bold">Lesson Completed!</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleComplete(lesson.lesson_id)}
                        disabled={isPending}
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 shadow-lg"
                      >
                        {completingLessonId === lesson.lesson_id ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Completing...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xl">✓</span>
                            <span>Mark as Complete</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}