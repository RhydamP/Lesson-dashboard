'use client'
import { Lesson, UserLesson } from '@/types/lesson'
import { useState, useTransition } from 'react'

export default function AllLessons({
  lessons,
  userId,
  userLessonIds,
  onLessonStarted
}: {
  lessons: Lesson[],
  userId: string,
  userLessonIds: string[],
  onLessonStarted: (lessonId: string, lessonData: UserLesson) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [pendingLessonId, setPendingLessonId] = useState<string | null>(null)

  const handleStartLesson = async (lessonId: string) => {
    setPendingLessonId(lessonId)
    startTransition(async () => {
      try {
        const response = await fetch('/api/lessons/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lessonId }),
        })

        if (response.ok) {
          const data = await response.json()
          const lessonData = lessons.find(lesson => lesson.id === lessonId)

          if (lessonData) {
            onLessonStarted(lessonId, {
              lesson_id: lessonId,
              completed: false,
              lessons: lessonData
            })
          }
        }
      } catch (error) {
        console.error('Error starting lesson:', error)
      } finally {
        setPendingLessonId(null)
      }
    })
  }

  if (!lessons || !Array.isArray(lessons)) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <div className="text-center py-12 lg:py-16">
          <div className="text-4xl lg:text-6xl mb-4">📚</div>
          <h4 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2">Loading courses...</h4>
        </div>
      </div>
    )
  }

  const availableLessons = lessons.filter(lesson => !userLessonIds.includes(lesson.id))
  const startedLessons = lessons.filter(lesson => userLessonIds.includes(lesson.id))

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3 lg:space-x-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl lg:rounded-2xl flex items-center justify-center">
            <span className="text-xl lg:text-2xl">📚</span>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 font-inter">All Courses</h2>
            <p className="text-sm lg:text-base text-gray-600 font-medium">Explore and start new learning adventures</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-xl lg:text-2xl font-bold text-purple-600">{lessons.length}</div>
          <div className="text-xs lg:text-sm text-gray-500 font-medium">courses available</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-blue-200">
          <div className="text-xl lg:text-2xl font-bold text-blue-600">{availableLessons.length}</div>
          <div className="text-xs lg:text-sm text-blue-700 font-medium">Available to Start</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-emerald-200">
          <div className="text-xl lg:text-2xl font-bold text-emerald-600">{startedLessons.length}</div>
          <div className="text-xs lg:text-sm text-emerald-700 font-medium">Already Started</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-purple-200">
          <div className="text-xl lg:text-2xl font-bold text-purple-600">{Math.round((startedLessons.length / lessons.length) * 100)}%</div>
          <div className="text-xs lg:text-sm text-purple-700 font-medium">Progress</div>
        </div>
      </div>

      {/* Available Courses Section */}
      {availableLessons.length > 0 && (
        <div>
          <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6 flex items-center">
            <span className="mr-2">🚀</span>
            Available Courses ({availableLessons.length})
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {availableLessons.map((lesson) => {
              const isPendingThis = pendingLessonId === lesson.id;

              return (
                <div
                  key={lesson.id}
                  className="group relative bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 rounded-xl lg:rounded-2xl p-4 lg:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-purple-200"
                >
                  {/* New Badge */}
                  <div className="absolute top-3 right-3 lg:top-4 lg:right-4 px-2 lg:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                    🆕 New
                  </div>

                  <div className="space-y-3 lg:space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-900 text-base lg:text-lg mb-3 pr-16 leading-tight">
                        {lesson.title}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="flex items-center font-medium">
                            <span className="mr-2 text-base">📖</span>
                            Course Material
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="flex items-center font-medium">
                            <span className="mr-2 text-base">⏱️</span>
                            Self-paced Learning
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="flex items-center font-medium">
                            <span className="mr-2 text-base">🎯</span>
                            Interactive Content
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 lg:pt-4">
                      <button
                        onClick={() => handleStartLesson(lesson.id)}
                        disabled={isPending}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 lg:px-6 py-3 lg:py-4 rounded-lg lg:rounded-xl font-bold hover:from-purple-600 hover:to-pink-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 lg:space-x-3 shadow-lg text-sm lg:text-base"
                      >
                        {isPendingThis ? (
                          <>
                            <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Starting...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-lg lg:text-xl">🚀</span>
                            <span>Start Learning</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Started Courses Section */}
      {startedLessons.length > 0 && (
        <div>
          <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6 flex items-center">
            <span className="mr-2">✅</span>
            Already Started ({startedLessons.length})
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {startedLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl lg:rounded-2xl p-4 lg:p-6 hover:shadow-lg transition-all duration-300"
              >
                {/* Started Badge */}
                <div className="absolute top-3 right-3 lg:top-4 lg:right-4 px-2 lg:px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                  ✅ Started
                </div>

                <div className="space-y-3 lg:space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900 text-base lg:text-lg mb-3 pr-20 leading-tight">
                      {lesson.title}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-emerald-700">
                        <span className="flex items-center font-medium">
                          <span className="mr-2 text-base">🎯</span>
                          In Progress
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-emerald-700">
                        <span className="flex items-center font-medium">
                          <span className="mr-2 text-base">📋</span>
                          Available in &quot;My Lessons&quot;
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 lg:pt-4">
                    <div className="flex items-center justify-center space-x-2 lg:space-x-3 p-3 lg:p-4 bg-emerald-100/50 rounded-lg lg:rounded-xl">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white text-sm lg:text-lg font-bold">✓</span>
                      </div>
                      <span className="text-emerald-700 font-bold text-sm lg:text-base">Lesson Started</span>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="pt-3 lg:pt-4 border-t border-emerald-200">
                    <div className="text-xs lg:text-sm text-emerald-600 font-medium text-center">
                      ✨ Continue in &quot;My Lessons&quot; section
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {lessons.length === 0 && (
        <div className="text-center py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl lg:rounded-2xl border-2 border-dashed border-gray-200">
          <div className="text-4xl lg:text-6xl mb-4">📚</div>
          <h4 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2">No courses available</h4>
          <p className="text-sm lg:text-base text-gray-500 font-medium">Check back later for new learning opportunities</p>
        </div>
      )}
    </div>
  )
}