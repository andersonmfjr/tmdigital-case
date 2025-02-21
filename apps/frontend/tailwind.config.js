const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ffffff',
          100: '#ded9fa',
          200: '#beb4f5',
          300: '#9d8eef',
          400: '#7d69ea',
          500: '#5c43e5',
          600: '#4c36c6',
          700: '#3c29a6',
          800: '#2c1b87',
          900: '#1c0e67',
        },
        background: {
          50: '#ffffff',
          100: '#ded9fa',
          200: '#beb4f4',
          300: '#9d8eef',
          400: '#7d69e9',
          500: '#5c43e4',
          600: '#4c36c5',
          700: '#3c29a5',
          800: '#2c1c86',
          900: '#1c0f66',
        },
      },
    },
  },
  plugins: [],
};
