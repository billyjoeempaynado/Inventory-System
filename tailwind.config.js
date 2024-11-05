/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs", // Include all .ejs files in the views directory
    "./src/**/*.js",
  ], // Include all .js files in the src directory (e.g., for client-side JavaScript) ,
  theme: {
    extend: {},
  },
  plugins: [],
};
