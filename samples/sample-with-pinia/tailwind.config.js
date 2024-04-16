/** @type {import('tailwindcss').Config} */
/* eslint-env node */
export default {
  content: ['./src/**/*.{vue,js,ts}'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['cupcake']
  }
}
