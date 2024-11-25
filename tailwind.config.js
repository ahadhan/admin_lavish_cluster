
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'], // Enable dark mode with 'class' strategy
  content: [
    './index.html',               // Include the main HTML file
    './src/**/*.{js,ts,jsx,tsx}', // Scan all files in the src directory for Tailwind classes
  ],
theme: {
  extend: {
    colors: {
      blueColor: 'rgba(128,0,128,0.7)',
      primaryColor: '#00011F',
      secondaryColor: '#0A1016',
      skinColor: '#EFDBA6',
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      card: {
        DEFAULT: 'hsl(var(--card))',
        foreground: 'hsl(var(--card-foreground))'
      },
      popover: {
        DEFAULT: 'hsl(var(--popover))',
        foreground: 'hsl(var(--popover-foreground))'
      },
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))'
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary))',
        foreground: 'hsl(var(--secondary-foreground))'
      },
      muted: {
        DEFAULT: 'hsl(var(--muted))',
        foreground: 'hsl(var(--muted-foreground))'
      },
      accent: {
        DEFAULT: 'hsl(var(--accent))',
        foreground: 'hsl(var(--accent-foreground))'
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))'
      },
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      chart: {
        '1': 'hsl(var(--chart-1))',
        '2': 'hsl(var(--chart-2))',
        '3': 'hsl(var(--chart-3))',
        '4': 'hsl(var(--chart-4))',
        '5': 'hsl(var(--chart-5))'
      }
    },
    fontFamily: {
      poppins: ['var(--font-roboto)', 'sans-serif'],
      libre: ['var(--font-playfair)', 'serif']
    },
    textShadow: {
      'light-white': '1px 1px 2px rgba(255, 255, 255, 0.6)'
    },
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)'
    }
  }
},
plugins: [
  function ({ addUtilities }) { 
    const newUtilities = {
      '.text-shadow-light-white': {
        textShadow: '1px 1px 2px rgba(255, 255, 255, 0.6)', // Define light white shadow
      },
    }
    addUtilities(newUtilities)
  },
    require("tailwindcss-animate")
],
};
