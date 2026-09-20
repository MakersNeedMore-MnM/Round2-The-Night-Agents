/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#EEF3F6',
        surface: '#FFFFFF',
        dark: '#111827',
        'secondary-text': '#667085',
        'health-blue': '#69C7DF',
        'health-teal': '#55C8B5',
        'health-success': '#5BC58A',
        'health-warning': '#F2C66D',
        'health-danger': '#E87575',
        'brand-purple': '#7867C8',
        ayush: {
          saffron: '#E67E22',
          lightSaffron: '#FEF5E7',
          herbal: '#27AE60',
          lightHerbal: '#EAFAF1',
        }
      },
      borderRadius: {
        'card': '24px',
        'card-lg': '28px',
        'card-sm': '18px',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(17, 24, 39, 0.04)',
        'soft-hover': '0 14px 40px rgba(17, 24, 39, 0.08)',
        'card': '0 4px 20px -2px rgba(17, 24, 39, 0.05)',
        'elevated': '0 20px 40px -10px rgba(17, 24, 39, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
