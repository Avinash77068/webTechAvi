/**
 * TechSutra - Advanced Theme Configuration
 * Centralized theme management for colors, typography, spacing, and images
 */

export const themeConfig = {
  // Brand Identity
  brand: {
    name: "TechSutra",
    tagline: "INNOVATE • ELEVATE",
    logo: {
      main: "/logo-techsutra.svg",
      icon: "/logo-icon.svg",
      width: 200,
      height: 60,
    },
  },

  // Color Palette - Based on TechSutra Logo
  colors: {
    primary: {
      main: "hsl(199, 89%, 48%)", // Cyan Blue from logo
      light: "hsl(199, 89%, 58%)",
      dark: "hsl(199, 89%, 38%)",
      foreground: "hsl(222, 47%, 6%)",
    },
    secondary: {
      main: "hsl(280, 80%, 60%)", // Purple/Magenta from logo
      light: "hsl(280, 80%, 70%)",
      dark: "hsl(280, 80%, 50%)",
      foreground: "hsl(0, 0%, 100%)",
    },
    accent: {
      orange: "hsl(25, 95%, 53%)", // Orange from logo
      pink: "hsl(330, 85%, 60%)", // Pink from logo
      blue: "hsl(210, 100%, 60%)", // Bright blue
    },
    neutral: {
      background: "hsl(222, 47%, 6%)", // Dark background
      surface: "hsl(222, 47%, 9%)", // Card background
      border: "hsl(222, 30%, 18%)",
      text: {
        primary: "hsl(210, 40%, 96%)",
        secondary: "hsl(215, 20%, 55%)",
        muted: "hsl(215, 15%, 45%)",
      },
    },
    status: {
      success: "hsl(142, 76%, 36%)",
      warning: "hsl(38, 92%, 50%)",
      error: "hsl(0, 84%, 60%)",
      info: "hsl(199, 89%, 48%)",
    },
  },

  // Gradients - Inspired by TechSutra Logo
  gradients: {
    primary: "linear-gradient(135deg, hsl(199, 89%, 48%), hsl(210, 100%, 60%))",
    secondary: "linear-gradient(135deg, hsl(280, 80%, 60%), hsl(330, 85%, 60%))",
    accent: "linear-gradient(135deg, hsl(25, 95%, 53%), hsl(330, 85%, 60%))",
    logo: "linear-gradient(135deg, hsl(25, 95%, 53%) 0%, hsl(330, 85%, 60%) 50%, hsl(210, 100%, 60%) 100%)",
    glow: "linear-gradient(135deg, hsl(199, 89%, 48%), hsl(280, 80%, 60%))",
    hero: "linear-gradient(180deg, hsl(222, 47%, 6%) 0%, hsl(222, 47%, 9%) 100%)",
  },

  // Typography System
  typography: {
    fontFamily: {
      sans: "'Inter', system-ui, -apple-system, sans-serif",
      heading: "'Space Grotesk', sans-serif",
      mono: "'Fira Code', 'Courier New', monospace",
    },
    fontSize: {
      xs: "0.75rem",      // 12px
      sm: "0.875rem",     // 14px
      base: "1rem",       // 16px
      lg: "1.125rem",     // 18px
      xl: "1.25rem",      // 20px
      "2xl": "1.5rem",    // 24px
      "3xl": "1.875rem",  // 30px
      "4xl": "2.25rem",   // 36px
      "5xl": "3rem",      // 48px
      "6xl": "3.75rem",   // 60px
      "7xl": "4.5rem",    // 72px
      "8xl": "6rem",      // 96px
      "9xl": "8rem",      // 128px
    },
    fontWeight: {
      thin: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      black: "900",
    },
    lineHeight: {
      none: "1",
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },

  // Spacing System (based on 4px grid)
  spacing: {
    px: "1px",
    0: "0",
    0.5: "0.125rem",  // 2px
    1: "0.25rem",     // 4px
    1.5: "0.375rem",  // 6px
    2: "0.5rem",      // 8px
    2.5: "0.625rem",  // 10px
    3: "0.75rem",     // 12px
    3.5: "0.875rem",  // 14px
    4: "1rem",        // 16px
    5: "1.25rem",     // 20px
    6: "1.5rem",      // 24px
    7: "1.75rem",     // 28px
    8: "2rem",        // 32px
    9: "2.25rem",     // 36px
    10: "2.5rem",     // 40px
    11: "2.75rem",    // 44px
    12: "3rem",       // 48px
    14: "3.5rem",     // 56px
    16: "4rem",       // 64px
    20: "5rem",       // 80px
    24: "6rem",       // 96px
    28: "7rem",       // 112px
    32: "8rem",       // 128px
    36: "9rem",       // 144px
    40: "10rem",      // 160px
    44: "11rem",      // 176px
    48: "12rem",      // 192px
    52: "13rem",      // 208px
    56: "14rem",      // 224px
    60: "15rem",      // 240px
    64: "16rem",      // 256px
    72: "18rem",      // 288px
    80: "20rem",      // 320px
    96: "24rem",      // 384px
  },

  // Border Radius
  borderRadius: {
    none: "0",
    sm: "0.25rem",    // 4px
    base: "0.5rem",   // 8px
    md: "0.75rem",    // 12px
    lg: "1rem",       // 16px
    xl: "1.25rem",    // 20px
    "2xl": "1.5rem",  // 24px
    "3xl": "2rem",    // 32px
    full: "9999px",
  },

  // Shadows & Effects
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    none: "none",
    glow: {
      primary: "0 0 40px -10px hsl(199 89% 48% / 0.4)",
      secondary: "0 0 40px -10px hsl(280 80% 60% / 0.4)",
      accent: "0 0 40px -10px hsl(25 95% 53% / 0.4)",
      strong: "0 0 60px -10px hsl(199 89% 48% / 0.6)",
    },
    card: "0 8px 32px -8px hsl(0 0% 0% / 0.4)",
  },

  // Breakpoints
  breakpoints: {
    xs: "475px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Z-Index Scale
  zIndex: {
    auto: "auto",
    0: "0",
    10: "10",
    20: "20",
    30: "30",
    40: "40",
    50: "50",
    dropdown: "1000",
    sticky: "1020",
    fixed: "1030",
    modalBackdrop: "1040",
    modal: "1050",
    popover: "1060",
    tooltip: "1070",
  },

  // Animation Durations
  animation: {
    duration: {
      fast: "150ms",
      base: "300ms",
      slow: "500ms",
      slower: "800ms",
    },
    easing: {
      linear: "linear",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },

  // Image Sizes
  images: {
    logo: {
      navbar: { width: 180, height: 50 },
      footer: { width: 200, height: 60 },
      mobile: { width: 150, height: 42 },
    },
    hero: {
      width: 1920,
      height: 1080,
    },
    portfolio: {
      thumbnail: { width: 600, height: 400 },
      full: { width: 1200, height: 800 },
    },
    team: {
      avatar: { width: 300, height: 300 },
    },
  },
} as const;

// Type exports for TypeScript
export type ThemeConfig = typeof themeConfig;
export type ColorPalette = typeof themeConfig.colors;
export type Typography = typeof themeConfig.typography;
export type Spacing = typeof themeConfig.spacing;

// Helper functions
export const getColor = (path: string): string => {
  const keys = path.split('.');
  let value: any = themeConfig.colors;
  for (const key of keys) {
    value = value[key];
  }
  return value as string;
};

export const getSpacing = (key: keyof typeof themeConfig.spacing): string => {
  return themeConfig.spacing[key];
};

export const getFontSize = (key: keyof typeof themeConfig.typography.fontSize): string => {
  return themeConfig.typography.fontSize[key];
};
