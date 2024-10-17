import localFont from "next/font/local";
import "./globals.css";
import Link from 'next/link';
import Image from 'next/image';
import logo from './logo.jpg';
import background from './background.jpg'

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="relative min-h-screen bg-[url('./background.jpg')] bg-repeat">
          <Image src={background} layout="fill" objectFit="cover" className="opacity-0" alt="Background" />
          <div className="flex flex-col min-h-screen">
            <header className="shadow-md sticky top-0 z-50" style={{ backgroundColor: '#313133' }}>
              <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="flex items-center">
                  <Image src={logo} alt="Inersa Motorsport Logo" width={200} height={80} className="object-contain" />
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
            <main className="flex-grow container mx-auto px-4 py-8 relative">
              <div className="bg-white p-6 rounded-lg shadow-lg relative z-10">
                {children}
              </div>
            </main>
            <footer className="bg-black text-center py-4 text-sm text-green-500" style={{ backgroundColor: '#313133' }}>
              © {new Date().getFullYear()} Inersa Motorsport. Todos los derechos reservados.
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
