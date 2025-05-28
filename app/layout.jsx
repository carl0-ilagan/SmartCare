import { Manrope } from "next/font/google"
import "@/app/globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { SuspiciousLoginAlert } from "@/components/suspicious-login-alert"


const manrope = Manrope({ 
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap"
})

export const metadata = {
  title: "Smart Care - Your Health, One Click Away",
  description: "A modern telehealth platform for all your healthcare needs",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={manrope.variable}>
      <head>
        <title>Smart care</title>
        <link rel="icon" href="/SmartCare.png?v=2" type="image/png" />
        <link rel="shortcut icon" href="/SmartCare.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/SmartCare.png?v=2" />
      </head>
      <body className="min-h-screen bg-pale-stone font-manrope antialiased">
        <AuthProvider>
          <SuspiciousLoginAlert />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
