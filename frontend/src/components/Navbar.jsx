import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
      isActive(path)
        ? 'bg-forest text-white shadow-sm'
        : 'text-forest/70 hover:text-forest hover:bg-forest/5'
    }`;

  const navLinks = [
    { path: '/posts', label: 'المنشورات' },
    { path: '/videos', label: 'فيديوهات' },
    { path: '/book', label: 'احجز موعد' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-cream/80 backdrop-blur-lg border-b border-sage/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.png" alt="د. هالة" className="h-12 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={linkClass('/')}>الرئيسية</Link>
            {navLinks.map(({ path, label }) => (
              <Link key={path} to={path} className={linkClass(path)}>{label}</Link>
            ))}
            {user?.role === 'admin' && (
              <>
                <Link to="/admin/cms" className={linkClass('/admin/cms')}>صيانة المحتوى</Link>
                <Link to="/admin/working-hours" className={linkClass('/admin/working-hours')}>أوقات العمل</Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden md:block">
                  <NotificationBell />
                </div>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-forest text-white text-sm font-semibold hover:bg-forest-light transition-all active:scale-95 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {user.name || t('nav.dashboard')}
                </Link>
                <div className="hidden md:flex items-center gap-2 pl-3 border-l border-sage/20">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-full border border-sage/30 text-forest/70 text-sm font-medium hover:bg-forest/5 hover:text-forest transition-all active:scale-95"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:inline-flex px-5 py-2.5 rounded-full border border-sage/30 text-forest/70 text-sm font-medium hover:bg-forest/5 hover:text-forest transition-all active:scale-95"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="hidden md:inline-flex px-5 py-2.5 rounded-full bg-forest text-white text-sm font-semibold hover:bg-forest-light transition-all active:scale-95 shadow-sm"
                >
                  {t('nav.register')}
                </Link>
              </>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full text-forest hover:bg-forest/5 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-6 animate-slide-down">
            <div className="flex flex-col gap-2 pt-4 border-t border-sage/10">
              <Link to="/" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-xl text-forest/70 hover:text-forest hover:bg-forest/5 text-sm font-medium">الرئيسية</Link>
              {navLinks.map(({ path, label }) => (
                <Link key={path} to={path} onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-xl text-forest/70 hover:text-forest hover:bg-forest/5 text-sm font-medium">{label}</Link>
              ))}
              <div className="border-t border-sage/10 pt-4 mt-2 space-y-2">
                {user ? (
                  <>
                    {user.role === 'admin' && (
                      <>
                        <Link to="/admin/cms" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-forest/70 hover:text-forest hover:bg-forest/5 text-sm font-medium">صيانة المحتوى</Link>
                        <Link to="/admin/working-hours" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-forest/70 hover:text-forest hover:bg-forest/5 text-sm font-medium">أوقات العمل</Link>
                      </>
                    )}
                    <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl bg-forest text-white text-sm font-semibold text-center">{t('nav.dashboard')}</Link>
                    <button onClick={handleLogout} className="w-full px-4 py-2.5 rounded-xl border border-sage/30 text-forest/70 text-sm font-medium hover:bg-forest/5"> {t('nav.logout')}</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl border border-sage/30 text-forest/70 text-sm font-medium text-center hover:bg-forest/5">{t('nav.login')}</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl bg-forest text-white text-sm font-semibold text-center">{t('nav.register')}</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
