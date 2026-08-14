import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, Clock, LogOut, Bell, BrainCircuit, Menu, X, Settings, HelpCircle, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);

  // Handle scroll for sticky nav glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/quizzes', label: 'Quizzes', icon: BookOpen },
    { path: '/history', label: 'History', icon: Clock },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      {/* Top Navbar */}
      <header 
        className={`h-16 sticky top-0 z-50 transition-all duration-200 ${
          scrolled ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-sm' : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="relative">
                <BrainCircuit className="w-6 h-6 text-[var(--color-primary)]" />
                <div className="absolute inset-0 bg-[var(--color-primary)] opacity-0 group-hover:opacity-20 blur-md rounded-full transition-opacity duration-700"></div>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cognivault</h1>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className="relative px-3 py-2 rounded-lg text-sm font-medium transition-colors group flex items-center gap-2"
                  >
                    <link.icon className={`w-4 h-4 ${isActive ? 'text-[var(--color-primary)]' : 'text-slate-500 group-hover:text-[var(--color-primary)]'}`} />
                    <span className={isActive ? 'text-[var(--color-primary-dark)] font-bold' : 'text-slate-600 group-hover:text-slate-900'}>
                      {link.label}
                    </span>
                    {isActive && (
                      <motion.div 
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-t-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 bg-slate-100 rounded-lg opacity-0 group-hover:opacity-100 -z-10 transition-opacity"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Notification Bell */}
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors hidden sm:block">
              <Bell className="w-5 h-5" />
              {hasNotifications && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 pr-2 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-secondary)] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div className="hidden sm:block text-left text-sm">
                  <p className="font-semibold text-slate-900 leading-none">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 capitalize">{user?.role?.toLowerCase() || 'Student'}</p>
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-slate-200/50 py-2 z-50 transform origin-top-right"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 sm:hidden">
                      <p className="font-semibold text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{user?.role?.toLowerCase()}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[var(--color-primary)]">
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[var(--color-primary)]">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <Link to="/help" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[var(--color-primary)]">
                      <HelpCircle className="w-4 h-4" /> Help & Support
                    </Link>
                    <div className="h-px bg-slate-100 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                    >
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white md:hidden pt-16 flex flex-col"
          >
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive ? 'bg-indigo-50 text-[var(--color-primary-dark)]' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <link.icon className={`w-5 h-5 ${isActive ? 'text-[var(--color-primary)]' : 'text-slate-400'}`} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-100">
               <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-bold transition-colors"
              >
                <LogOut className="w-5 h-5" /> Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}
