module.exports = {
  darkMode: 'class',
  content: ['./src/*.html'],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light", "dark", "cyberpunk", "cupcake", "luxury"], // Ensure these themes are correctly installed
  },
}
