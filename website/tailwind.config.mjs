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
          DEFAULT: '#0d9488',
          hover: '#0f766e',
          soft: '#f0fdfa',
          light: '#2dd4bf',
        },
        highlight: {
          DEFAULT: '#b45309',
          soft: '#fffbeb',
          light: '#fbbf24',
        },
        surface: {
          DEFAULT: '#ffffff',
          alt: '#f4f5f7',
        },
      },
      maxWidth: {
        '8xl': '1400px',
      },
    },
  },
  plugins: [],
};
