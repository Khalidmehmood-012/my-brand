import './globals.css'
import { ModalProvider } from '@/components/ModalProvider'
import ToastProvider from '@/components/ToastProvider'

export const metadata = {
  title: 'Komrez Admin',
  description: 'Komrez store administration panel',
}

export default function RootLayout({ children }) {
  return <html lang="en"><body><ToastProvider><ModalProvider>{children}</ModalProvider></ToastProvider></body></html>
}
