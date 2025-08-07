// ❌ Đừng thêm "use client" ở đây

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
      <body className="bg-white dark:bg-gray-900 text-black dark:text-white">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
