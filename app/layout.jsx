import { Manrope } from "next/font/google"
import "@/app/globals.css"
import { AuthProvider } from "@/contexts/auth-context"

<<<<<<< HEAD
const manrope = Manrope({ 
  subsets: ["latin"],
  variable: '--font-manrope',
  display: 'swap',
})
=======
const manrope = Manrope({ subsets: ["latin"] })
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893

export const metadata = {
  title: "Smart Care - Your Health, One Click Away",
  description: "A modern telehealth platform for all your healthcare needs",
<<<<<<< HEAD
=======
    generator: 'v0.dev'
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
}

export default function RootLayout({ children }) {
  return (
<<<<<<< HEAD
    <html lang="en" suppressHydrationWarning className={manrope.variable}>
      <body className={`min-h-screen bg-pale-stone antialiased ${manrope.className}`}>
=======
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-pale-stone font-sans antialiased ${manrope.className}`}>
>>>>>>> f93706602cbce9451b890424cbf8332ebb30c893
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
