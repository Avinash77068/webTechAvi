# Theme Toggle Guide - TechSutra

## Overview
The TechSutra website now features a complete dark/light theme toggle system with smooth transitions and persistent theme preferences.

## Features

### ✨ Theme Modes
- **Dark Mode** (Default): Black background with white text
- **Light Mode**: White background with black text
- **Persistent**: Theme preference saved in localStorage
- **Smooth Transitions**: All color changes are animated

### 🎨 Color Schemes

#### Dark Mode
- Background: `hsl(222, 47%, 6%)` - Deep dark blue-black
- Foreground: `hsl(210, 40%, 96%)` - Off-white text
- Cards: `hsl(222, 47%, 9%)` - Slightly lighter dark
- Borders: `hsl(222, 30%, 18%)` - Subtle borders

#### Light Mode
- Background: `hsl(0, 0%, 100%)` - Pure white
- Foreground: `hsl(222, 47%, 11%)` - Dark text
- Cards: `hsl(0, 0%, 98%)` - Light gray cards
- Borders: `hsl(214, 32%, 91%)` - Light borders

### 🎯 Brand Colors (Same in Both Modes)
- Primary: `hsl(199, 89%, 48%)` - Cyan Blue
- Secondary: `hsl(280, 80%, 60%)` - Purple/Magenta
- Accent Orange: `hsl(25, 95%, 53%)`
- Accent Pink: `hsl(330, 85%, 60%)`
- Accent Blue: `hsl(210, 100%, 60%)`

## Implementation

### Theme Provider
Located at: `src/contexts/ThemeContext.tsx`

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  );
}
```

### Theme Toggle Component
Located at: `src/components/ThemeToggle.tsx`

The toggle button features:
- Animated switch with moon/sun icons
- Smooth sliding animation
- Color changes based on active theme
- Accessible with keyboard navigation

### Usage in Components

#### Using the Hook
```tsx
import { useTheme } from '@/contexts/ThemeContext';

const MyComponent = () => {
  const { theme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'dark-specific-class' : 'light-specific-class'}>
      Content
    </div>
  );
};
```

#### Using CSS Classes
The theme automatically applies `.light` or `.dark` class to the `<html>` element.

```css
/* Automatically switches based on theme */
.my-element {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
```

## Toggle Button Location

### Desktop
- Located in the navbar between navigation links and "Hire Us" button
- Always visible on screens ≥ 768px

### Mobile
- Located in the mobile menu dropdown
- Appears with label "Theme" for clarity
- Positioned above the "Hire Us" button

## CSS Variables

All theme-aware CSS variables automatically switch when theme changes:

```css
/* These automatically update based on theme */
--background
--foreground
--card
--card-foreground
--primary
--primary-foreground
--muted
--muted-foreground
--border
--input
--shadow-glow
--shadow-card
```

## LocalStorage

Theme preference is saved to localStorage as:
- **Key**: `techsutra-theme`
- **Values**: `"light"` or `"dark"`
- **Default**: `"dark"` (if no preference saved)

## Best Practices

### 1. Use CSS Variables
```tsx
// ✅ Good - Uses theme-aware variables
<div className="bg-background text-foreground">Content</div>

// ❌ Avoid - Hardcoded colors
<div className="bg-black text-white">Content</div>
```

### 2. Test Both Themes
Always test your components in both light and dark modes to ensure:
- Text is readable
- Contrast is sufficient
- Colors work well in both modes

### 3. Use Semantic Colors
```tsx
// ✅ Good - Semantic naming
<button className="bg-primary text-primary-foreground">Click</button>

// ❌ Avoid - Specific colors
<button className="bg-blue-500 text-white">Click</button>
```

### 4. Gradients Work in Both Modes
The brand gradients (logo, primary, secondary) work beautifully in both themes:

```tsx
<h1 className="gradient-logo-text">TechSutra</h1>
```

## Customizing Theme Colors

To modify theme colors, edit `src/index.css`:

```css
:root {
  /* Dark mode colors */
  --background: 222 47% 6%;
  /* ... other dark mode variables */
}

.light {
  /* Light mode colors */
  --background: 0 0% 100%;
  /* ... other light mode variables */
}
```

## Accessibility

The theme toggle is fully accessible:
- ✅ Keyboard navigable (Tab to focus, Enter/Space to toggle)
- ✅ Focus ring visible
- ✅ ARIA label: "Toggle theme"
- ✅ Visual feedback on hover and focus
- ✅ Sufficient color contrast in both modes

## Troubleshooting

### Theme not persisting
- Check browser's localStorage is enabled
- Clear localStorage and try again: `localStorage.removeItem('techsutra-theme')`

### Colors not changing
- Ensure component uses CSS variables (e.g., `bg-background` not `bg-black`)
- Check that ThemeProvider wraps your app in `App.tsx`
- Verify CSS variables are defined in `src/index.css`

### Toggle button not working
- Ensure ThemeProvider is imported and wrapping the app
- Check browser console for errors
- Verify useTheme hook is being called inside ThemeProvider

## Files Modified

1. **`src/contexts/ThemeContext.tsx`** - Theme provider and hook
2. **`src/components/ThemeToggle.tsx`** - Toggle button component
3. **`src/components/Navbar.tsx`** - Integrated toggle in navbar
4. **`src/App.tsx`** - Wrapped with ThemeProvider
5. **`src/index.css`** - Added light mode CSS variables

## Example: Creating Theme-Aware Components

```tsx
import { useTheme } from '@/contexts/ThemeContext';

const ThemedCard = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <div className="glass card-shadow p-6 rounded-lg transition-colors duration-300">
      {children}
      <p className="text-xs text-muted-foreground mt-4">
        Current theme: {theme}
      </p>
    </div>
  );
};
```

---

**TechSutra** - INNOVATE • ELEVATE

*Theme switching made simple and beautiful*
