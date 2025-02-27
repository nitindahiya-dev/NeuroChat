// frontend/tailwind.config.js

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Add other file paths if needed
  ],
  theme: {
    theme: {
      extend: {
        colors: {
          primary: {
            dark: "#000957",
            DEFAULT: "#344CB7",
            light: "#577BC1",
          },
          accent: "#FFEB00",
        },
      },
    },
  },
  plugins: [],
};
