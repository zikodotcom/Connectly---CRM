/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: [
        {
          PRIMARY_NAVY: '#092C4C',
          PRIMARY_BLUE: '#514EF3',
          PRIMARY_BLUE_LIGHT: '#ECECFE',
          PRIMARY_GREEN: '#2DC8A8',
          PRIMARY_YELLOW: '#FFC357',
          PRIMARY_PINK: '#FE8084',
          PRIMARY_WHITE: '#FFFFFF',
          BLACK_BLACK: '#000000',
          BLACK_BLACK_50: '#00000080',
          GREY_GREY_90: '#526477',
          GREY_GREY_70: '#7E92A2',
          GREY_GREY_50: '#D6E1E6',
          GREY_GREY_30: '#EAEEF4',
          GREY_GREY_20: '#EEF6FB',
          GREY_GREY_10: '#F6FAFD'
        }
      ]
    }
  },
  plugins: []
}
