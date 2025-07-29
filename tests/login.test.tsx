import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '@/lib/actions/auth'
import { supabase } from '../__mocks__/supabase'
import React from 'react';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));


jest.mock('@/lib/supabase/client', () => {
  const mockSupabase = {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
    },
  };
  return {
    createBrowserClient: () => mockSupabase,
  };
});

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
      signUp: jest.fn().mockResolvedValue({ error: null }),
      getSession: jest.fn().mockResolvedValue({ data: { session: { user: { id: '123' } } } }),
    },
  }),
}));



describe('LoginOrSignupPage', () => {
  it('renders form and logs in successfully', async () => {
    render(<LoginForm />)

    await userEvent.type(screen.getByPlaceholderText(/Email/i), 'test@example.com')
    await userEvent.type(screen.getByPlaceholderText(/Password/i), 'password123')

    await userEvent.click(screen.getByRole('button', { name: /login/i }))

    // Expect some redirect or success (mock router)
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
  })
})
