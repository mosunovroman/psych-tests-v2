/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4a6fa5',
          dark: '#3a5a8a',
          light: '#6b8fc5'
        },
        surface: {
          light: '#f8f9fa',
          dark: '#1a1a2e'
        },
        card: {
          light: '#ffffff',
          dark: '#16213e'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif']
      },
      animation: {
        'breathe-in': 'breatheIn 4s ease-in-out forwards',
        'breathe-out': 'breatheOut 4s ease-in-out forwards',
        'fade-in': 'fadeIn 0.3s ease'
      },
      keyframes: {
        breatheIn: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.5)' }
        },
        breatheOut: {
          '0%': { transform: 'scale(1.5)' },
          '100%': { transform: 'scale(1)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
