/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                quest: {
                    dark: 'rgb(var(--color-bg) / <alpha-value>)',
                    card: 'rgb(var(--color-card) / <alpha-value>)',
                    primary: 'rgb(var(--color-primary) / <alpha-value>)',
                    secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
                    accent: 'rgb(var(--color-accent) / <alpha-value>)',
                    text: 'rgb(var(--color-text) / <alpha-value>)',
                    muted: 'rgb(var(--color-muted) / <alpha-value>)',
                },
                primary: "#0b1b4c",
                "background-light": "#f6f6f8",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ["Inter", "sans-serif"],
                heading: ['Outfit', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'aurora-slow': 'aurora 20s linear infinite',
                'aurora-medium': 'aurora 15s linear infinite reverse',
            },
            keyframes: {
                aurora: {
                    '0%': { transform: 'translate(0, 0) rotate(0deg)' },
                    '50%': { transform: 'translate(10%, 10%) rotate(180deg)' },
                    '100%': { transform: 'translate(0, 0) rotate(360deg)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
