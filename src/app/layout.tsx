import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar/Navbar';
import { ThemeProvider } from '@/components/Navbar/ThemeProvider'; // ✅ Import provider đúng

export const metadata: Metadata = {
  title: 'Jawa Clone',
  description: 'Marketplace for custom PCs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-black">
        <ThemeProvider> {/* ✅ Dùng bên trong JSX, KHÔNG phải export ở ngoài */}
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
