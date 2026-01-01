/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#81B29A',
          light: '#A8C5B8',
          dark: '#5E9179',
        },
        secondary: {
          DEFAULT: '#E07A5F',
          light: '#E89880',
        },
        neutral: '#F4F1DE',
        background: '#FDFAF6',
        text: {
          DEFAULT: '#2D3142',
          light: '#6B7280',
        },
        error: '#E63946',
        success: '#2A9D8F',
        warning: '#F4A261',
      },
      fontFamily: {
        heading: ['Nunito', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
        '24': '96px',
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '8px',
        'lg': '16px',
        'full': '9999px',
      },
    },
  },
  plugins: [],
}
