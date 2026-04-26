import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'learn2-orange': '#F16A24',
        'learn2-red': '#C6202A',
        'learn2-gray': '#7B7979',
        'learn2-dark': '#414651',
        'learn2-text': '#1A1A1A',
        'learn2-light': '#F9F6F2',
        'gold-mine': '#CCAA00',
        'blue-ocean': '#0081C1',
        'green-planet': '#16AD00',
        'orange-sky': '#F48B00',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        heading: ['"URW Geometric"', '"Century Gothic"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
