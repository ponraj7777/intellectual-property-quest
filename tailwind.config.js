/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                quest: {
                    // THEME 3: Glowup Nature (Modern Earthy)
                    // dark: '#111A19',      // Noir De Vigne (Deepest Green-Black)
                    // card: '#1A2826',      // Subtle variation of Noir
                    // primary: '#284139',   // Emerald Green
                    // secondary: '#809076', // Wasabi (Sage/Muted Green)
                    // accent: '#BB6830',    // Egyptian Earth (Burnt Orange)
                    // text: '#F8FAF1',      // Warm Milky White
                    // muted: '#809076',     // Wasabi/Muted Green

                    /* BACKUP: THEME 2 (Mesh Aurora - Midnight Silk)
                    dark: '#030712', card: '#0f172a', primary: '#6366f1',
                    secondary: '#10b981', accent: '#8b5cf6', text: '#f8fafc', muted: '#64748b',
                    */

                    // BACKUP: THEME 1 (Classic - Gamer Dark)
                    dark: '#0f172a', card: '#1e293b', primary: '#6366f1',
                    secondary: '#10b981', accent: '#8b5cf6', text: '#f8fafc', muted: '#94a3b8',
                    
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
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
