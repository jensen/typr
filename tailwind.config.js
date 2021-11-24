module.exports = {
  purge: ["./src/**/*.tsx", "./src/**/*.jsx", "./src/**/*.js", "./src/**/*.ts"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  plugins: [],
};
