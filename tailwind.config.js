/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        pink: {
          DEFAULT: '#E11D48',
          dark: '#BE123C',
          light: '#FFF1F2',
        },
        slate: {
          950: '#020617', 900: '#0F172A', 800: '#1E293B', 700: '#334155',
          600: '#475569', 500: '#64748B', 400: '#94A3B8', 300: '#CBD5E1',
          200: '#E2E8F0', 100: '#F1F5F9', 50: '#F8FAFC',
        },
        // Novos Design Tokens Adicionados Aqui 👇
        status: {
          success: { bg: '#DCFCE7', text: '#166534' },
          info: { bg: '#DBEAFE', text: '#1E40AF' },
          warning: { bg: '#FEF9C3', text: '#92400E' },
          alert: { bg: '#FEF3C7', text: '#B45309' },
          danger: { bg: '#FEE2E2', text: '#B91C1C' },
          pending: { bg: '#FEF3C7', text: '#B45309' },
        }
      },
      borderRadius: {
        sm: '6px', md: '8px', lg: '10px', xl: '12px', '2xl': '16px',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0,0,0,.05), 0 2px 4px -1px rgba(0,0,0,.03)',
        'card-hover': '0 8px 20px rgba(0,0,0,.08)',
        login: '0 8px 32px rgba(0,0,0,.07), 0 2px 8px rgba(0,0,0,.04)',
        'focus-pink': '0 0 0 3px rgba(225,29,72,.1)',
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '1.4' }],
        xs: ['11px', { lineHeight: '1.4' }],
        sm: ['13px', { lineHeight: '1.5' }],
        base: ['14px', { lineHeight: '1.5' }],
        lg: ['18px', { lineHeight: '1.4' }],
        xl: ['22px', { lineHeight: '1.3' }],
        '2xl': ['26px', { lineHeight: '1.2' }],
        '3xl': ['28px', { lineHeight: '1.2' }],
      },
    },
  },
  plugins: [],
};