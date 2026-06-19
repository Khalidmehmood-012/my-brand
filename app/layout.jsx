import { Geist } from 'next/font/google'
import './globals.css'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const geist = Geist({
  subsets: ['latin'],
})

export const metadata = {
  title: 'MyBrand — Premium Streetwear',
  description: 'Premium quality streetwear made in Pakistan',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <AnnouncementBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
