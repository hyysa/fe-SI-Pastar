/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // BAGIAN INI YANG HARUS DITAMBAHKAN
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out forwards',
        fadeInUp: 'fadeInUp 1s ease-out forwards',
      },
      // END BAGIAN TAMBAHAN
      colors: {
        midnight: '#020617',
        'midnight-light': '#0f172a',
        'gold-dignity': '#EEBF63',
      },
    },
  },
  plugins: [],
}