/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                glass: {
                    dark: 'hsl(220, 20%, 8%)',
                    surface: 'hsl(220, 15%, 12%)',
                    border: 'hsl(220, 20%, 20%)',
                    highlight: 'hsl(220, 25%, 25%)',
                },
                cyan: {
                    primary: 'hsl(180, 95%, 45%)',
                    dim: 'hsl(180, 70%, 30%)',
                    glow: 'hsl(180, 100%, 60%)',
                },
                green: {
                    acid: 'hsl(80, 90%, 50%)',
                    dim: 'hsl(80, 60%, 35%)',
                },
                orange: {
                    warning: 'hsl(30, 100%, 55%)',
                },
                text: {
                    primary: 'hsl(0, 0%, 95%)',
                    secondary: 'hsl(0, 0%, 70%)',
                    muted: 'hsl(0, 0%, 50%)',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            spacing: {
                xs: '4px',
                sm: '8px',
                md: '16px',
                lg: '24px',
                xl: '32px',
                '2xl': '48px',
                '3xl': '64px',
                '4xl': '80px',
            },
            borderRadius: {
                glass: '12px',
            },
            backdropBlur: {
                glass: '12px',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                glow: 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)' },
                    '100%': { boxShadow: '0 0 30px rgba(34, 211, 238, 0.6)' },
                },
            },
        },
    },
    plugins: [],
};
