// __mocks__/supabase.ts
export const mockUser = {
  id: 'mock-user-id',
  email: 'test@example.com',
}

export const supabase = {
  auth: {
    signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
    signUp: jest.fn().mockResolvedValue({ error: null }),
    getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockResolvedValue({
    data: [
      { id: 'lesson-1', title: 'Test Lesson', date: new Date().toISOString() },
    ],
    error: null,
  }),
}
