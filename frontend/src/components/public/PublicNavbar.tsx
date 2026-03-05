import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/mavade.svg';

type PublicNavbarProps = {
  isLandingPage?: boolean;
};

export function PublicNavbar({ isLandingPage = false }: PublicNavbarProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Why Us', href: isLandingPage ? '#why-us' : '/#why-us' },
    { label: 'Admission', href: '/admissions' },
    { label: 'Contact', href: '/contact' },
    { label: 'Request Info', href: isLandingPage ? '#request-info' : '/#request-info' },
    { label: 'About', href: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fafafa] shadow-md border-b border-[#e5e7eb]">
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{ maxWidth: '1280px', width: '100%', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '96px' }}>
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
            aria-label="Go to home"
          >
            <img src={logo} alt="mavade logo" className="size-30" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) =>
              item.href.startsWith('#') ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[#111827] hover:text-[#6b7280] font-medium transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-[#111827] hover:text-[#6b7280] font-medium transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              style={{ color: '#111827' }}
              className="font-medium hover:opacity-80 hover:text-[#6b7280] transition-opacity px-4 py-2"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              style={{
                backgroundColor: '#0066cc',
                color: 'white',
                padding: '0.7rem 1.4rem',
                borderRadius: '0.5rem',
                fontWeight: 600,
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 102, 204, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0052a3';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 102, 204, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0066cc';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 102, 204, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden w-full border-t border-gray-200 bg-[#fafafa]"
        >
          <div className="w-full">
            {navItems.map((item) =>
              item.href.startsWith('#') ? (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full border-b border-gray-200 px-4 py-3 text-gray-700 font-medium hover:bg-gray-100"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full border-b border-gray-200 px-4 py-3 text-gray-700 font-medium hover:bg-gray-100"
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="p-4 space-y-3 bg-gradient-to-b from-[#fafafa] to-[#f3f4f6]">
              <button
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
                className="block w-full rounded-xl border border-[#0066cc]/20 bg-white px-4 py-3 text-center font-semibold text-[#0066cc] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  navigate('/signup');
                  setMobileMenuOpen(false);
                }}
                className="block w-full rounded-xl bg-gradient-to-r from-[#0066cc] to-[#0052a3] px-4 py-3 text-center font-semibold text-white shadow-[0_8px_24px_rgba(0,102,204,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,102,204,0.34)]"
              >
                Sign Up
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
