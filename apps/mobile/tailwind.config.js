/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary blue palette (matching web)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Brand colors (sky/cyan - for legacy compatibility)
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Feature accent colors
        accent: {
          purple: {
            DEFAULT: '#a855f7',
            light: '#c084fc',
            dark: '#7c3aed',
          },
          green: {
            DEFAULT: '#10b981',
            light: '#34d399',
            dark: '#059669',
          },
          yellow: {
            DEFAULT: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
          },
        },
        // Privacy level colors
        privacy: {
          private: '#7c3aed',
          trusted: '#2563eb',
          family: '#059669',
          friends: '#d97706',
          professional: '#dc2626',
          public: '#6b7280',
        },
        // Dark mode specific
        dark: {
          background: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          text: {
            primary: '#f8fafc',
            secondary: '#94a3b8',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'System', 'sans-serif'],
        mono: ['SpaceMono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
