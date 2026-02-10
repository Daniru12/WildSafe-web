/** @type {import('tailwindcss').Config} */
export default {
    content: {
        files: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
        ],
        safelist: [
            {
                pattern: /^(bg|text|border|rounded|shadow|py|px|font|flex|gap|mb|min-h|w|outline|transition|hover|disabled|focus|backdrop-blur)([:\-\/a-z0-9]*)$/,
            },
        ],
    },
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#10b981',
                    dark: '#059669',
                },
                secondary: '#3b82f6',
                accent: '#f59e0b',
                danger: '#ef4444',
                success: '#10b981',
                background: '#0f172a',
                surface: {
                    DEFAULT: '#1e293b',
                    light: '#334155',
                },
                text: {
                    DEFAULT: '#f8fafc',
                    muted: '#94a3b8',
                },
                border: '#334155',
            },
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
            },
            backgroundImage: {
                'auth-gradient': "radial-gradient(circle at top left, #0f172a, #05966955), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
            }
        },
    },
    plugins: [],
}
