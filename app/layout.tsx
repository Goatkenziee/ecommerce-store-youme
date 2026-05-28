import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YouMe E-commerce',
  description: 'An e-commerce store built with Next.js, Tailwind CSS, and Prisma',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* TODO: Add Navbar here */}
        {children}
        {/* TODO: Add Footer here */}
      </body>
    </html>
  );
}