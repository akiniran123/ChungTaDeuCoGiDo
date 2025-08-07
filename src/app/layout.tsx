import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar/Navbar';

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
    <html lang="en">
      <body className="bg-white text-black">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
