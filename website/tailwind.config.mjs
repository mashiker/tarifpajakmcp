/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#0E5E58',   /* matches --accent in Base.astro — single source of truth */
          hover: '#0A4843',
          soft: '#E6EFEE',
        },
      },
    },
  },
  plugins: [],
};
