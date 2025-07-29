'use client'

import React from 'react';
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true) // Toggle between login and signup

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (isLogin) {
      // Login flow
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        setError(loginError.message)
      } else {
        router.push('/')
      }
    } else {
      // Signup flow
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signupError) {
        setError(signupError.message)
      } else {
        const { data } = await supabase.auth.getSession()
        if (!data.session) {
          setError('Check your email to confirm your sign up.')
        } else {
          router.push('/')
        }
      }
    }

    setLoading(false)
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError(null)
    setEmail('')
    setPassword('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-8 bg-white/10 rounded-full blur-sm transform rotate-45 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-6 bg-white/15 rounded-full blur-sm transform -rotate-12 animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-16 w-40 h-10 bg-white/10 rounded-full blur-sm transform rotate-12 animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-20 w-28 h-7 bg-white/15 rounded-full blur-sm transform -rotate-45 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-4 bg-white/10 rounded-full blur-sm transform rotate-60 animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-5 bg-white/15 rounded-full blur-sm transform -rotate-30 animate-pulse delay-1200"></div>
      </div>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row rounded-2xl shadow-2xl overflow-hidden bg-white/95 backdrop-blur-sm relative z-10">
        
        {/* Left side - Welcome section with gradient background */}
        <div className="lg:flex-1 bg-gradient-to-br from-indigo-500 via-pink-300 to-orange-300 relative overflow-hidden flex items-center justify-center p-8 lg:p-12 min-h-[300px] lg:min-h-[600px]">
          {/* Decorative geometric shapes */}
          <div className="absolute inset-0">
            <div className="absolute top-8 left-8 w-16 h-4 md:w-24 md:h-6 lg:w-32 lg:h-8 bg-orange-300 rounded-full opacity-80 transform rotate-45"></div>
            <div className="absolute top-20 left-16 w-12 h-3 md:w-18 md:h-4 lg:w-24 lg:h-6 bg-pink-300 rounded-full opacity-70 transform rotate-12"></div>
            <div className="absolute top-32 left-4 w-20 h-5 md:w-28 md:h-7 lg:w-40 lg:h-10 bg-purple-300 rounded-full opacity-60 transform -rotate-12"></div>
            <div className="absolute bottom-20 left-12 w-18 h-4 md:w-24 md:h-6 lg:w-36 lg:h-8 bg-orange-300 rounded-full opacity-80 transform rotate-45"></div>
            <div className="absolute bottom-8 left-6 w-14 h-3 md:w-20 md:h-4 lg:w-28 lg:h-6 bg-pink-300 rounded-full opacity-70 transform -rotate-24"></div>
            <div className="absolute top-16 right-8 w-10 h-2 md:w-14 md:h-3 lg:w-20 lg:h-5 bg-yellow-300 rounded-full opacity-75 transform rotate-60"></div>
            <div className="absolute bottom-32 right-16 w-16 h-3 md:w-22 md:h-5 lg:w-32 lg:h-7 bg-orange-300 rounded-full opacity-65 transform -rotate-30"></div>
          </div>
          
          <div className="relative z-10 text-white text-center lg:text-left">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 lg:mb-6">Welcome to website</h1>
            <p className="text-sm md:text-base lg:text-lg opacity-90 leading-relaxed max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
            </p>
          </div>
        </div>

        {/* Right side - Login/Signup form */}
        <div className="lg:w-96 xl:w-[420px] bg-white flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-sm">
            <div className="text-center mb-6 lg:mb-8">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">
                {isLogin ? 'USER LOGIN' : 'USER SIGNUP'}
              </h2>
              <p className="text-sm text-gray-600">
                {isLogin ? 'Welcome back! Please login to your account.' : 'Create a new account to get started.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
              {/* Email Input */}
              <div>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full px-3 py-2.5 lg:px-4 lg:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pl-9 lg:pl-10 text-sm lg:text-base"
                  />
                  <div className="absolute left-2.5 lg:left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full px-3 py-2.5 lg:px-4 lg:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pl-9 lg:pl-10 pr-9 lg:pr-10 text-sm lg:text-base"
                  />
                  <div className="absolute left-2.5 lg:left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 lg:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me checkbox - only show for login */}
              {isLogin && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <label htmlFor="remember" className="ml-2 text-xs lg:text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
              )}

              {error && (
                <div className="p-2.5 lg:p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-xs lg:text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 lg:py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
              >
                {loading ? 'Processing...' : (isLogin ? 'LOGIN' : 'SIGN UP')}
              </button>

              {/* Toggle between login and signup */}
              <div className="text-center space-y-2">
                {isLogin && (
                  <a href="#" className="block text-xs lg:text-sm text-purple-600 hover:text-purple-700">
                    Forgot password?
                  </a>
                )}
                <p className="text-xs lg:text-sm text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-purple-600 hover:text-purple-700 font-medium focus:outline-none"
                  >
                    {isLogin ? 'Sign up' : 'Login'}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}