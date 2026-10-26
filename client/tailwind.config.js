/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        findit: {
          navy: '#101D36',
          'navy-dark': '#0B1426',
          'navy-light': '#1A2B4C',
          teal: '#62D8C3',
          'teal-hover': '#4ecbb4',
          'teal-dark': '#1e8e7a',
          'teal-light': '#E6FBF7',
          gray: '#F8FAFC',
          'gray-card': '#F1F5F9',
          'gray-border': '#E2E8F0',
          'text-main': '#0F172A',
          'text-muted': '#475569',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(16, 29, 54, 0.06)',
        'card': '0 6px 24px -4px rgba(16, 29, 54, 0.08)',
        'hover': '0 12px 30px -6px rgba(16, 29, 54, 0.12)',
      }
    },
  },
  plugins: [],
}
