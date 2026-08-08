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
        // Approved palette from the design spec (Task 8).
        ink: {
          DEFAULT: '#132A2A',
          secondary: '#44545A',
          tertiary: '#6E7B82',
        },
        teal: {
          DEFAULT: '#0E5E58',
          hover: '#0A4A45',
          soft: '#EAF2F0',
        },
        paper: {
          DEFAULT: '#F7F8F4',
        },
        rule: {
          DEFAULT: '#D9E0DC',
          subtle: '#E6EBE7',
        },
        warning: {
          DEFAULT: '#B7791F',
          soft: '#FBF3E3',
        },
        conflict: {
          DEFAULT: '#B64545',
        },
        // Backward-compat aliases used by older pages (Tailwind utilities).
        accent: {
          DEFAULT: '#0E5E58',
          hover: '#0A4A45',
          soft: '#EAF2F0',
          light: '#2DD4BF',
        },
        highlight: {
          DEFAULT: '#B7791F',
          soft: '#FBF3E3',
          light: '#FBBF24',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#EFF1EC',
        },
      },
      maxWidth: {
        '8xl': '1400px',
        // Full-width database cap (raised above the legacy 1400px on this page).
        'db': '1600px',
        'screen-2xl': '1536px',
      },
    },
  },
  plugins: [],
};
