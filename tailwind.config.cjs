/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    screens: {
      '3xs': '320px',
      // => @media (min-width: 640px) { ... }

      '2xs': '375px',
      // => @media (min-width: 640px) { ... }

      'xs': '425px',
      // => @media (min-width: 640px) { ... }

      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1440px',

      '3xl': '2300px',

      'max-md': {max: "767px"},
      // => @media (min-width: 1536px) { ... }
    },


    extend: {
      colors:{
        'shade':'#000000',
        'shade2':'#020202',
        'shade3':'#080808',
        'shade4':'#1c1c1c',
        'Shade5':'#1b1c1e',
        'shade6':'#191919',
        'Shade7':'#1f1f1f',
        'Shade8':'#232323',
        'Shade9':'#2b2b2b',
        'Shade10':'#303030'
      },
    },
  },
  plugins: [],
}
