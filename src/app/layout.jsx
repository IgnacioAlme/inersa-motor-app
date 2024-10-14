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
  title: "Inersa Motorsport",
  description: "Especialistas en mejora de rendimiento de vehículos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-200`}
      >
        <div className="flex flex-col min-h-screen">
          <header className="bg-black shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <Link href="/" className="flex items-center">
                <Image src="/im-logo.png" alt="Inersa Motorsport Logo" width={60} height={60} className="object-contain" />
              </Link>
              <nav>
                <ul className="flex space-x-6">
                  {['CLIENTES', 'VEHICULOS', 'REPUESTOS', 'INFORMES'].map((item) => (
                    <li key={item}>
                      <Link 
                        href={`/${item.toLowerCase()}`}
                        className="text-green-500 hover:text-white transition-colors duration-200 font-medium"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </header>
          <main className="flex-grow container mx-auto px-4 py-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              {children}
            </div>
          </main>
          <footer className="bg-black text-center py-4 text-sm text-green-500">
            © {new Date().getFullYear()} Inersa Motorsport. Todos los derechos reservados.
          </footer>
        </div>
      </body>
    </html>
  );
}
