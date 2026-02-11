import type { Metadata } from 'next'
import './globals.css'

// Root layout metadata
export const metadata: Metadata = {
  title: {
    default: 'المسرد التوثيقي للألعاب التراثية العربية',
    template: '%s | المسرد التوثيقي للألعاب التراثية العربية',
  },
  description:
    'أرشيف رقمي توثيقي للألعاب الشعبية العربية - منصة لحفظ التراث غير المادي وفق معايير اليونسكو',
  keywords: [
    'ألعاب شعبية',
    'تراث عربي',
    'ألعاب تقليدية',
    'ألعاب الأطفال',
    'تراث خليجي',
    'أرشيف رقمي',
    'يونسكو',
    'تراث غير مادي',
  ],
  authors: [{ name: 'المسرد التوثيقي للألعاب التراثية العربية' }],
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    title: 'المسرد التوثيقي للألعاب التراثية العربية',
    description: 'أرشيف رقمي توثيقي للألعاب الشعبية العربية',
    siteName: 'المسرد التوثيقي للألعاب التراثية العربية',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'المسرد التوثيقي للألعاب التراثية العربية',
    description: 'أرشيف رقمي توثيقي للألعاب الشعبية العربية',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Local TSHanazad Display Font */}
        <link rel="preload" href="/alfont_com_TSHanazad-Display.otf" as="font" type="font/otf" crossOrigin="" />
        {/* Cloudinary Upload Widget Script */}
        <script
          src="https://upload-widget.cloudinary.com/global/all.js"
          type="text/javascript"
          async
        />
      </head>
      <body className="min-h-screen bg-background font-arabic antialiased">
        {children}
      </body>
    </html>
  )
}
