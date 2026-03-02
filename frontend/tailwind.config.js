/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#0d9488',
                    dark: '#0f766e',
                    light: '#14b8a6',
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                },
            },
        },
    },
    plugins: [],
}
