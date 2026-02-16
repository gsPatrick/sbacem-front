import '@/styles/globals.css';
import { SessionExpiredModal } from './SessionExpiredModal';
import { AuthGuard } from './components/AuthGuard';

export const metadata = {
  title: 'SBACEM Distribution Pro',
  description: 'Plataforma de distribuição de direitos autorais — SBACEM',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthGuard>
          {children}
          <SessionExpiredModal />
        </AuthGuard>
      </body>
    </html>
  );
}
