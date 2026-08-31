/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        colors: {
          bg: '#fafafa',
          surface: '#ffffff',
          border: '#e8e8ed',
          text: '#16181d',
          textsoft: '#6b7280',
          accent: '#4c6ef5',
          accentdark: '#3b57d1',
          teal: '#0f9c8c',
          danger: '#d1435f',
          dangersoft: '#fceef1',
        },
      },
    },
    plugins: [],
  };