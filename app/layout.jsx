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
        <style>{`#__initial-loader{position:fixed;inset:0;z-index:9999;background:#fff;display:flex;align-items:center;justify-content:center}`}</style>
        <div className="flex min-h-dvh flex-col">
          <Suspense fallback={null}><RouteLoader /></Suspense>
          {/* <AnnouncementBar /> */}
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </ToastProvider></body>
    </html>
  )
}
