import './globals.css';

export const metadata = {
  title: 'Image Background Remover',
  description: 'Remove backgrounds from images using AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}