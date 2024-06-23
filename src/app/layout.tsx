import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { Toaster } from "@/components/ui/toaster"
import './globals.css'
import styles from './layout.module.css'
import WithUser from './WithUser'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wink - Wish bank',
  description: 'Created by nighca',
  manifest: '/manifest.json'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <UserProvider>
        <body className={inter.className}>
          <div className={styles.wrapper}>
            <WithUser>
              <main className={styles.main}>{children}</main>
            </WithUser>
          </div>
          <Toaster />
        </body>
      </UserProvider>
    </html>
  )
}
