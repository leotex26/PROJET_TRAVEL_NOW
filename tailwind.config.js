module.exports = {
  content: [
    "./views/**/*.ejs",
    "./views/*.ejs",
    "./public/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f97316', // orange (équivalent Tailwind: orange-500)
        secondary: '#fb923c', // orange-400
        dark: '#1f2937', // gris foncé
        light: '#f9fafb', // gris très clair
      },
    },
  },
  plugins: [],
}

