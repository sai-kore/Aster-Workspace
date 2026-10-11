import typography from '@tailwindcss/typography'

export default {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx,mdx}', './src/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        accent: { DEFAULT: '#4f46e5', hover: '#4338ca' },
      },
      typography: () => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            h1: { fontSize: '1.875rem', fontWeight: '700', marginTop: '2.25rem', marginBottom: '0.375rem' },
            h2: { fontSize: '1.5rem', fontWeight: '700', marginTop: '1.75rem', marginBottom: '0.25rem' },
            h3: { fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.25rem' },
            p: { marginTop: '0.375rem', marginBottom: '0.375rem', lineHeight: '1.75' },
            'ul, ol': { marginTop: '0.375rem', marginBottom: '0.375rem' },
            'li > p': { marginTop: '0.125rem', marginBottom: '0.125rem' },
            blockquote: { fontStyle: 'normal' },
            img: { borderRadius: '0.375rem' },
          },
        },
      }),
    },
  },
  plugins: [typography],
}