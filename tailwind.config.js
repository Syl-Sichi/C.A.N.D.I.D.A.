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
          bg: '#0a0a0c',
          panel: '#121217',
          accent: '#00f2ff',
          muted: '#6b7280',
          border: '#27272a',
        },
      },
      backgroundImage: {
        'neural-grid': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%231e1e24' stroke-width='1'%3E%3Cpath d='M36 36c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8 8 3.58 8 8zM0 36c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8 8 3.58 8 8zM0 0C0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8 3.58-8 8-8zM36 0c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8-8 3.58-8 8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
