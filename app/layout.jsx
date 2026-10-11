import '../src/index.css'
import AppProviders from '../src/components/AppProviders'

export const metadata = {
  title: { default: 'Aster Workspace', template: '%s · Aster Workspace' },
  description: 'A calm, Notion-inspired workspace for notes, pages, and ideas.',
  applicationName: 'Aster Workspace',
}
export default function RootLayout({ children }) {
  return <html lang="en" suppressHydrationWarning><body><AppProviders>{children}</AppProviders></body></html>
}
