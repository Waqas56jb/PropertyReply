/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#3B82F6',
        },
        secondary: '#7C3AED',
        accent: '#F59E0B',
        success: '#10B981',
        danger: '#EF4444',
        dark: {
          DEFAULT: '#111827',
          light: '#1F2937',
        },
        gray: {
          DEFAULT: '#6B7280',
          light: '#F3F4F6',
        },
        light: '#F9FAFB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
        'gradient-dark': 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
        'gradient-accent': 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.12)',
        'md': '0 4px 6px -1px rgba(0,0,0,0.1)',
        'lg': '0 10px 25px -5px rgba(0,0,0,0.1)',
        'xl': '0 20px 50px -12px rgba(0,0,0,0.25)',
        '2xl': '0 25px 50px -12px rgba(0,0,0,0.5)',
        'primary': '0 4px 15px rgba(37, 99, 235, 0.4)',
        'primary-hover': '0 6px 20px rgba(37, 99, 235, 0.5)',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      maxWidth: {
        'container': '1280px',
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.8s ease-out',
        'float': 'float 20s infinite ease-in-out',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0) rotate(0deg)',
          },
          '33%': {
            transform: 'translateY(-30px) rotate(120deg)',
          },
          '66%': {
            transform: 'translateY(30px) rotate(240deg)',
          },
        },
      },
    },
  },
  plugins: [],
}

