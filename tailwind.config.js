/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        candida: {
          bg: '#050507',
          panel: '#0c0c10',
          accent: '#00f2ff',
          magenta: '#ff2d6a',
          rose: '#ff4d8d',
          muted: '#6b7280',
          border: '#1e1e26',
          glow: 'rgba(255, 45, 106, 0.35)',
        },
      },
      backgroundImage: {
        'neural-grid': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23121218' stroke-width='1'%3E%3Cpath d='M36 36c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8 8 3.58 8 8zM0 36c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8 8 3.58 8 8zM0 0C0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8 3.58-8 8-8zM36 0c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8-8 3.58-8 8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'void-radial': 'radial-gradient(ellipse at center, #0c0c12 0%, #050507 70%)',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 242, 255, 0.35)',
        'glow-magenta': '0 0 24px rgba(255, 45, 106, 0.45)',
        'glow-rose': '0 0 40px rgba(255, 77, 141, 0.5)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'spin-slower': 'spin 22s linear infinite',
        'pulse-soft': 'pulse 3s ease-in-out infinite',
        'scan': 'scan 4s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%, 100%': { opacity: '0.3', transform: 'rotate(0deg)' },
          '50%': { opacity: '0.9', transform: 'rotate(180deg)' },
        },
      },
    },
  },
  plugins: [],
}
