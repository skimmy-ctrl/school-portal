import { useState, type ReactNode, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../common/Button';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: string[];
}

/**
 * Dashboard Layout for authenticated users
 * Features a responsive sidebar navigation and main content area
 * Responsive breakpoints:
 * - Mobile (< 768px): Collapsible drawer sidebar
 * - Tablet (768px - 1023px): Collapsible sidebar with icons only option
 * - Desktop (≥ 1024px): Fixed full sidebar
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, updateProfile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileFullName, setProfileFullName] = useState(user?.fullName || '');
  const [profileTitle, setProfileTitle] = useState(user?.title || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileAddress, setProfileAddress] = useState(user?.address || '');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(user?.avatar || null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const hasProfileChanges =
    (profileName.trim() || '') !== (user?.name || '') ||
    (profileFullName.trim() || '') !== (user?.fullName || '') ||
    (profileTitle.trim() || '') !== (user?.title || '') ||
    (profilePhone.trim() || '') !== (user?.phone || '') ||
    (profileAddress.trim() || '') !== (user?.address || '') ||
    !!profileFile;

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openProfile = () => {
    setProfileName(user?.name || '');
    setProfileFullName(user?.fullName || '');
    setProfileTitle(user?.title || '');
    setProfilePhone(user?.phone || '');
    setProfileAddress(user?.address || '');
    setProfileFile(null);
    setProfilePreview(user?.avatar || null);
    setProfileError('');
    setProfileOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setProfileFile(file);
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
    } else {
      setProfilePreview(user?.avatar || null);
    }
  };

  const handleProfileSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    try {
      await updateProfile({
        displayName: profileName.trim() || undefined,
        fullName: profileFullName.trim() || undefined,
        title: profileTitle.trim() || undefined,
        phone: profilePhone.trim() || undefined,
        address: profileAddress.trim() || undefined,
        avatarFile: profileFile,
      });
      setProfileOpen(false);
    } catch (error) {
      setProfileError(
        error instanceof Error ? error.message : 'Profile update failed.'
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // Navigation items based on user role
  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      { label: 'Dashboard', path: `/dashboard/${user?.role}`, icon: '', roles: ['student', 'teacher', 'admin'] },
    ];

    if (user?.role === 'student') {
      return [
        ...baseItems,
        { label: 'Courses', path: '/dashboard/student/courses', icon: '', roles: ['student'] },
        { label: 'Timetable', path: '/dashboard/student/timetable', icon: '', roles: ['student'] },
        { label: 'Assignments', path: '/dashboard/student/assignments', icon: '', roles: ['student'] },
        { label: 'Grades', path: '/dashboard/student/grades', icon: '', roles: ['student'] },
      ];
    } else if (user?.role === 'teacher') {
      return [
        ...baseItems,
        { label: 'Classes', path: '/dashboard/teacher/classes', icon: '', roles: ['teacher'] },
        { label: 'Assignments', path: '/dashboard/teacher/assignments', icon: '', roles: ['teacher'] },
        { label: 'Submissions', path: '/dashboard/teacher/submissions', icon: '', roles: ['teacher'] },
      ];
    } else if (user?.role === 'admin') {
      return [
        ...baseItems,
        { label: 'Students', path: '/dashboard/admin/students', icon: '', roles: ['admin'] },
        { label: 'Teachers', path: '/dashboard/admin/teachers', icon: '', roles: ['admin'] },
        { label: 'Classes', path: '/dashboard/admin/classes', icon: '', roles: ['admin'] },
        { label: 'Announcements', path: '/dashboard/admin/announcements', icon: '', roles: ['admin'] },
        { label: 'Timetable', path: '/dashboard/admin/timetable', icon: '', roles: ['admin'] },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Mobile Drawer on small screens, Fixed on desktop */}
      <aside
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-40' : 'relative'}
          ${sidebarCollapsed && !isMobile ? 'w-0 overflow-hidden' : 'w-64'}
          bg-white shadow-lg transition-all duration-300
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          ${isMobile ? '' : 'shrink-0'}
        `}
      >
        <div className="h-full flex flex-col">
          {sidebarCollapsed && !isMobile ? null : (
            <>
              {/* Logo */}
              <div className="px-6 py-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-primary-600">
                  Mavade
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  School Portal
                </p>
              </div>

              {/* User Info */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={openProfile}
                      className="text-sm font-semibold text-gray-900 truncate text-left hover:underline"
                    >
                      {user?.name}
                    </button>
                    <p className="text-xs text-gray-500 capitalize truncate">{user?.role}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors duration-200
                      ${
                        isActive(item.path)
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <div className="px-4 py-4 border-t border-gray-200">
                <Button
                  variant="danger"
                  fullWidth
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>

            {/* Desktop Collapse Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden md:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar collapse"
            >
              {sidebarCollapsed ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              )}
            </button>

            <div className="flex-1" />
            
            {/* User Email - Hide on very small screens */}
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {profileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
              <p className="text-sm text-gray-500">Update your display name and profile image.</p>
            </div>
            <form onSubmit={handleProfileSave} className="px-6 py-4 space-y-4">
              {profileError && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {profileError}
                </div>
              )}

              <div className="flex items-center gap-4">
                <img
                  src={profilePreview || user?.avatar}
                  alt={user?.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <label className="text-sm font-medium text-gray-700">
                  <span className="mb-2 block">Profile Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-600"
                  />
                </label>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(event) => setProfileName(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileFullName}
                  onChange={(event) => setProfileFullName(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={profileTitle}
                  onChange={(event) => setProfileTitle(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Mr., Dr., Prof."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(event) => setProfilePhone(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  value={profileAddress}
                  onChange={(event) => setProfileAddress(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter address"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={profileLoading}
                  disabled={!hasProfileChanges || profileLoading}
                  className='border border-gray-300 bg-blue-400 text-white hover:bg-blue-600 hover:shadow-lg hover:cursor-pointer'
                >
                  Confirm Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setProfileOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
