import { render, screen } from '@testing-library/react'
import DashboardPage from '@/components/DashboardPage'
import { Lesson, UserLesson } from '@/types/lesson'
import { AuthUser } from '@supabase/supabase-js'
import React from 'react';

// Mock subcomponents
jest.mock('@/components/Sidebar', () => {
    const Sidebar = () => <div data-testid="Sidebar" />
    Sidebar.displayName = 'Sidebar'
    return Sidebar
})

jest.mock('@/components/MyLessons', () => {
    const MyLessons = () => <div data-testid="MyLessons" />
    MyLessons.displayName = 'MyLessons'
    return MyLessons
})

jest.mock('@/components/AllLessons', () => {
    const AllLessons = () => <div data-testid="AllLessons" />
    AllLessons.displayName = 'AllLessons'
    return AllLessons
})


describe('DashboardPage', () => {
    const mockLessons: Lesson[] = [
        {
            id: 'lesson-1',
            title: 'Test Lesson',
            date: new Date().toISOString(),
            completed: false
        },
    ]


    const mockUserLessons = [
        {
            lesson_id: 'lesson-1',
            completed: false,
            lessons: {
                id: 'lesson-1',
                title: 'Test Lesson',
                date: new Date().toISOString(),
                completed: false
            }
        }
    ]

    const mockUser = {
        id: 'user-1',
        email: 'testuser@example.com',
    }

    it('renders dashboard with lessons and user info', () => {
        render(
            <DashboardPage
                initialAllLessons={mockLessons}
                initialUserLessons={mockUserLessons}
                user={mockUser as AuthUser}
            />
        )

        // Check for the welcome message
        expect(
            screen.getByText(/Welcome back, testuser/i)
        ).toBeInTheDocument()

        // Check that subcomponents render
        expect(screen.getByTestId('Sidebar')).toBeInTheDocument()
        expect(screen.getByTestId('MyLessons')).toBeInTheDocument()
        expect(screen.getByTestId('AllLessons')).toBeInTheDocument()
    })
})
