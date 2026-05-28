import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ecommerce Store',
  description: 'An ecommerce store built with Next.js and Tailwind CSS',
};

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
