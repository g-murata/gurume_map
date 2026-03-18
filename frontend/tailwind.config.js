module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // モダンな少し落ち着いたブルーをメインカラーに設定
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
        }
      },
      height: {
        '128': '32rem',
        '10vh': '10vh',
        '20vh': '20vh',
        '30vh': '30vh',
        '35vh': '35vh',
        '45vh': '45vh',
        '60vh': '60vh',
        '65vh': '65vh',
        '80vh': '80vh',
        '90vh': '90vh',        
      },
      width: {
        '30vw': '30vw',
      }
    },
  },
  plugins: [],
}