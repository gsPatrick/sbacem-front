import '@/styles/globals.css';

export const metadata = {
  title: 'SBACEM Distribution Pro',
  description: 'Plataforma de distribuição de direitos autorais — SBACEM',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
