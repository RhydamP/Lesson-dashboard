// 'use server'

// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'

// export type AuthState = {
//   error: string | null
//   success: boolean
// }

// export async function loginOrSignup(
//   _: AuthState,
//   formData: FormData
// ): Promise<AuthState> {
//   const cookieStore = await cookies()

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll: () => cookieStore.getAll(),
//         setAll: (cookiesToSet) => {
//           cookiesToSet.forEach(({ name, value, options }) => {
//             console.log('✅ Setting cookie:', name)
//             cookieStore.set(name, value, options)
//           })
//         },
//       },
//     }
//   )

//   const email = formData.get('email') as string
//   const password = formData.get('password') as string

//   if (!email || !password) {
//     return { error: 'Email and password are required.', success: false }
//   }

//   const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })

//   if (!loginError) {
//     console.log('✅ Login succeeded')
//     return { error: null, success: true }
//   }

//   const { error: signupError } = await supabase.auth.signUp({ email, password })

//   if (signupError) {
//     console.log('❌ Signup error:', signupError.message)
//     return { error: signupError.message, success: false }
//   }

//   console.log('✅ Signup succeeded')
//   return { error: null, success: true }
// }
