import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'MyBrand — Premium Streetwear',
  description: 'Premium quality streetwear made in Pakistan',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* <AnnouncementBar /> */}
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
