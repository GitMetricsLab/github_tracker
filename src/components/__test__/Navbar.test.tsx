// src/components/__tests__/Navbar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { ThemeContext } from "../../context/ThemeContext";
import Navbar from '../Navbar.tsx'

// Helper to render Navbar with a mock ThemeContext
const renderNavbar = (mode: 'light' | 'dark' = 'light') => {
  const toggleTheme = vi.fn()
  render(
    <MemoryRouter>
      <ThemeContext.Provider value={{ mode, toggleTheme }}>
        <Navbar />
      </ThemeContext.Provider>
    </MemoryRouter>
  )
  return { toggleTheme }
}

describe('Navbar', () => {
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
    expect(screen.getAllByRole('link', { name: /^tracker$/i })).toHaveLength(1)
  })

  it('opens mobile menu when hamburger is clicked', () => {
    renderNavbar()
    const hamburger = screen.getAllByRole('button')[2] // third button = hamburger
    fireEvent.click(hamburger)
    expect(screen.getAllByRole('link', { name: /^tracker$/i })).toHaveLength(2)
  })

  it('closes mobile menu when a nav link is clicked', () => {
    renderNavbar()
    const hamburger = screen.getAllByRole('button')[2]
    fireEvent.click(hamburger)                          // open
    expect(screen.getAllByRole('link', { name: /^tracker$/i })).toHaveLength(2)
    const homeLinks = screen.getAllByRole('link', { name: /home/i })
    fireEvent.click(homeLinks[homeLinks.length - 1]) // click the mobile one
    expect(screen.getAllByRole('link', { name: /^tracker$/i })).toHaveLength(1)  // closed
  })

  it('calls toggleTheme from the mobile theme button', () => {
    const { toggleTheme } = renderNavbar('dark')
    const mobileThemeBtn = screen.getAllByRole('button')[1] // second button = mobile theme toggle
    fireEvent.click(mobileThemeBtn)
    expect(toggleTheme).toHaveBeenCalledTimes(1)
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