import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ToastProvider from '@/components/ui/ToastProvider'
import RouteLoader from '@/components/ui/RouteLoader'
import { Suspense } from 'react'

export const metadata = {
  title: 'MyBrand — Premium Streetwear',
  description: 'Premium quality streetwear made in Pakistan',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning><ToastProvider>
        <Suspense fallback={null}><RouteLoader /></Suspense>
        {/* <AnnouncementBar /> */}
        <Navbar />
        <main>{children}</main>
        <Footer />
      </ToastProvider></body>
    </html>
  )
}
