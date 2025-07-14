export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        desi: {
          primary: '#E76F51', // Example: a warm orange
          secondary: '#264653', // Example: a deep blue
          accent: '#F4A261', // Example: a soft accent
        },
      },
      fontFamily: {
        brand: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
