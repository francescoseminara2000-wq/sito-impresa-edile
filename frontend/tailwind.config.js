/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#111827',       // Ardesia / antracite profondo
          terracotta: '#C2783B', // Ocra caldo / terracotta materico
          accent: '#D97706',     // Accento luminoso
          light: '#F9FAFB',      // Warm white
          surface: '#F3F4F6',    // Grigio materico chiaro
          stone: '#E5E7EB',
          subtle: '#9CA3AF',
        },
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft-elevation': '0 20px 40px -15px rgba(17, 24, 39, 0.08)',
        'glow-terracotta': '0 10px 30px -10px rgba(194, 120, 59, 0.4)',
      },
    },
  },
  plugins: [],
};
