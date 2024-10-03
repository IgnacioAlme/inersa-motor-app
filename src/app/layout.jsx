import localFont from "next/font/local";
import "./globals.css";
import Link from 'next/link';
import Image from 'next/image';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen">
          <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <nav>
                <ul className="flex space-x-6">
                  {['CLIENTES', 'VEHICULOS', 'REPUESTOS', 'REVISIONES'].map((item) => (
                    <li key={item}>
                      <Link 
                        href={`/${item.toLowerCase()}`}
                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <Link href="/" className="flex items-center">
                <Image src="/logo.png" alt="Logo" width={120} height={60} className="object-contain" />
              </Link>
            </div>
          </header>
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-gray-100 text-center py-4 text-sm text-gray-600">
            © {new Date().getFullYear()} Inersa Motorsport. Todos los derechos reservados.
          </footer>
        </div>
      </body>
    </html>
  );
}
