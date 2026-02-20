import { type ReactNode } from 'react';
import bg from '../../assets/bg-image.jpg';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Layout for public pages (login, home, about, etc.)
 * Features a simple, clean design with header and footer
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-center bg-cover" style={{ backgroundImage: `url(${bg})` }}>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
    </div>
  );
}
