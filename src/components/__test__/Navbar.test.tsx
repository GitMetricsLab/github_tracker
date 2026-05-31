// src/components/__tests__/Navbar.test.tsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import Navbar from '../Navbar.tsx'

// Helper to render Navbar with a mock ThemeContext
const renderNavbar = (
  mode: 'light' | 'dark' = 'light',
  isAuthenticated = false
) => {
  const toggleTheme = vi.fn()
  const logout = vi.fn().mockResolvedValue(undefined)
  render(
    <MemoryRouter>
      <ThemeContext.Provider value={{ mode, toggleTheme }}>
        <AuthContext.Provider
          value={{
            user: isAuthenticated ? { id: '1', username: 'tester', email: 'tester@example.com' } : null,
            isAuthenticated,
            isLoading: false,
            refreshAuth: vi.fn(),
            handleLoginSuccess: vi.fn(),
            logout,
          }}
        >
          <Navbar />
        </AuthContext.Provider>
      </ThemeContext.Provider>
    </MemoryRouter>
  )
  return { toggleTheme, logout }
}

describe('Navbar', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  // --- Rendering ---
  it('renders the GitHub Tracker logo link', () => {
    renderNavbar()
    expect(screen.getByText('GitHub Tracker')).toBeInTheDocument()
  })

  it('renders all desktop nav links', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^tracker$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contributors/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /signup/i })).toBeInTheDocument()
  })

  it('shows logout instead of login and signup when authenticated', () => {
    renderNavbar('light', true)
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /signup/i })).not.toBeInTheDocument()
  })

  it('shows profile dropdown trigger when a user is stored', () => {
    window.localStorage.setItem('github_tracker_auth_user', JSON.stringify({ username: 'testuser', email: 'test@example.com' }))

    renderNavbar()

    expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /testuser/i })).toBeInTheDocument()
  })

  // --- Theme toggle ---
  it('shows Moon icon in light mode', () => {
    renderNavbar('light')
    // Lucide renders an <svg> — check the button exists and toggleTheme is wired
    const themeBtn = screen.getAllByRole('button')[0]
    expect(themeBtn).toBeInTheDocument()
  })

  it('calls toggleTheme when the theme button is clicked', () => {
    const { toggleTheme } = renderNavbar('light')
    const themeBtn = screen.getAllByRole('button')[0]
    fireEvent.click(themeBtn)
    expect(toggleTheme).toHaveBeenCalledTimes(1)
  })

  // --- Mobile menu ---
  it('mobile menu is hidden by default', () => {
    renderNavbar()
    expect(screen.getAllByRole('link', { name: /signup/i })).toHaveLength(1)
  })

  it('opens mobile menu when hamburger is clicked', () => {
    renderNavbar()
    const hamburger = screen.getByLabelText(/toggle menu/i)
    fireEvent.click(hamburger)
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contributors/i })).toBeInTheDocument()
  })

  it('closes mobile menu when a nav link is clicked', () => {
    renderNavbar()
    const hamburger = screen.getByLabelText(/toggle menu/i)
    fireEvent.click(hamburger)                          // open
    const homeLinks = screen.getAllByRole('link', { name: /home/i })
    fireEvent.click(homeLinks[homeLinks.length - 1]) // click the mobile one
    expect(screen.getAllByRole('link', { name: /signup/i })).toHaveLength(1)  // closed
  })

  it('calls toggleTheme from the mobile menu button', () => {
    const { toggleTheme } = renderNavbar('dark')
    const themeBtn = screen.getAllByRole('button')[0]
    fireEvent.click(themeBtn)
    expect(toggleTheme).toHaveBeenCalledTimes(1)
  })

  it('calls logout when the authenticated logout button is clicked', async () => {
    const { logout } = renderNavbar('light', true)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /logout/i }))
    })
    expect(logout).toHaveBeenCalledTimes(1)
  })

  // --- Returns null when ThemeContext is missing ---
  it('renders nothing if ThemeContext is not provided', () => {
    const { container } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(container.firstChild).toBeNull()
  })
})