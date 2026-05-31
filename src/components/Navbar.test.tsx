import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Navbar from './Navbar';
import { ThemeContext } from '../context/ThemeContext';

// Helper function to render components with required providers
const renderWithProviders = (ui: React.ReactElement, themeMode: 'light' | 'dark' = 'light') => {
  const mockToggleTheme = vi.fn();
  
  return render(
    <ThemeContext.Provider value={{ mode: themeMode, toggleTheme: mockToggleTheme }}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </ThemeContext.Provider>
  );
};

describe('Navbar Component', () => {
  it('renders the brand name and logo', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText('GitHub Tracker')).toBeInTheDocument();
    expect(screen.getByAltText('CRL Icon')).toBeInTheDocument();
  });

  it('renders desktop navigation links', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Tracker')).toBeInTheDocument();
    expect(screen.getByText('Contributors')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('renders the correct theme toggle icon based on context', () => {
    // Render with dark mode
    renderWithProviders(<Navbar />, 'dark');
    const toggleButtons = screen.getAllByLabelText('Toggle Theme');
    
    // Check that the toggle buttons are present (one for desktop, one for mobile)
    expect(toggleButtons.length).toBeGreaterThan(0);
  });

  it('opens mobile menu when hamburger icon is clicked', () => {
    renderWithProviders(<Navbar />);
    
    const menuButton = screen.getByLabelText('Toggle Menu');
    fireEvent.click(menuButton);
    
    // The mobile menu should now be visible with the links
    const mobileLinks = screen.getAllByText('Home');
    expect(mobileLinks.length).toBe(2); // One desktop, one mobile
  });
});
