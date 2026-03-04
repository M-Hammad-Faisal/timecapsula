export const metadata = {
  title: 'TimeCapsula — Words that wait for the right moment',
  description:
    'Write a letter today. Deliver it to someone in the future. For parents, lovers, friends, and dreamers.',
  keywords: 'time capsule, future letter, digital legacy, message to future self',
  openGraph: {
    title: 'TimeCapsula — Words that wait for the right moment',
    description: 'Write a letter today. Deliver it to someone in the future.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
