import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, BookOpen, LogOut, Tags, BrainCircuit, ChevronLeft, ChevronRight, Settings, BarChart } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CommandGrid from './ui/CommandGrid';

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const isAdminDashboard = location.pathname === '/admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/admin', exact: true, label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Students', icon: Users },
    { path: '/admin/categories', label: 'Categories', icon: Tags },
    { path: '/admin/quizzes', label: 'Quizzes', icon: BookOpen },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart }, // Placeholder
    { path: '/admin/settings', label: 'Settings', icon: Settings }, // Placeholder
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${isAdminDashboard ? 'text-white bg-slate-950' : 'bg-[var(--color-background)]'}`}>
      
      {/* 3D Background specifically for dashboard */}
      {isAdminDashboard && <CommandGrid />}

      {/* Sidebar */}
      <motion.aside 
        animate={{ width: isCollapsed ? 72 : 260 }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        className={`${isAdminDashboard ? 'bg-slate-950/80 backdrop-blur-xl border-r border-white/5 text-slate-300' : 'bg-[var(--color-background-dark)] text-slate-300'} hidden md:flex md:flex-col relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.06)]`}
      >
        <div className="h-[72px] flex items-center px-5 flex-shrink-0">
          <Link to="/admin" className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="relative flex-shrink-0">
              <BrainCircuit className="w-8 h-8 text-[var(--color-primary-light)]" />
              <div className="absolute inset-0 bg-[var(--color-primary-light)] opacity-20 blur-md rounded-full"></div>
            </div>
            {!isCollapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight leading-none">Quizora</span>
                <span className="text-[10px] font-bold text-[var(--color-primary-light)] uppercase tracking-widest mt-1">Admin Portal</span>
              </motion.div>
            )}
          </Link>
        </div>

        {/* Collapse Toggle */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-[30px] w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] shadow-sm transition-colors z-30"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">
          <ul className="space-y-1.5 px-3">
            {navLinks.map((link) => {
              const isActive = link.exact 
                ? location.pathname === link.path 
                : location.pathname.startsWith(link.path);
                
              return (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="relative flex items-center px-3 h-11 rounded-xl text-sm font-medium transition-all group overflow-hidden"
                    title={isCollapsed ? link.label : ''}
                  >
                    {/* Background layers */}
                    {isActive ? (
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 rounded-xl"></div>
                    ) : (
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>
                    )}
                    
                    {/* Active Indicator Bar */}
                    {isActive && (
                      <motion.div 
                        layoutId="sidebar-indicator"
                        className="absolute left-0 top-2.5 bottom-2.5 w-[3px] bg-[var(--color-primary-light)] rounded-r-md"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    {/* Content */}
                    <div className="relative flex items-center gap-3 w-full">
                      <link.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-[var(--color-primary-light)]' : 'text-slate-400 group-hover:text-slate-300'}`} />
                      
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span 
                            initial={{ opacity: 0, x: -10 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className={`whitespace-nowrap ${isActive ? 'text-white font-bold' : 'text-slate-300'}`}
                          >
                            {link.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 mt-auto">
          <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br from-[var(--color-primary-light)] to-[var(--color-secondary)] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-bold text-white truncate leading-tight">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 font-medium capitalize mt-0.5">{user?.role?.toLowerCase() || 'Administrator'}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={handleLogout}
            className={`mt-2 w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start px-4'} gap-3 h-10 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium text-sm`}
            title={isCollapsed ? "Log out" : ""}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Log out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Header (Only visible on small screens) */}
      <div className="md:hidden flex flex-col w-full h-full relative z-10">
        <header className={`${isAdminDashboard ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10' : 'bg-[var(--color-background-dark)]'} h-16 flex items-center justify-between px-4 flex-shrink-0`}>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-[var(--color-primary-light)]" />
            <span className="text-lg font-bold text-white tracking-tight">Quizora Admin</span>
          </div>
          <button className="text-white p-2">
            <LogOut className="w-5 h-5" onClick={handleLogout} />
          </button>
        </header>
        {/* Mobile Content Area */}
        <main className="flex-1 overflow-y-auto bg-[var(--color-background)] p-4">
           {/* Add a simple mobile nav here if needed, or rely on desktop view for admin */}
           <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-4 text-sm font-medium">
             Admin dashboard is optimized for desktop view.
           </div>
           <Outlet />
        </main>
      </div>

      {/* Desktop Main Content */}
      <main className="flex-1 flex flex-col hidden md:flex h-full min-w-0 relative z-10">
        <header className={`h-16 flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-10 ${isAdminDashboard ? 'bg-transparent border-b border-white/5' : 'bg-white/80 backdrop-blur-md border-b border-slate-200/60'}`}>
           {/* Dynamic Breadcrumbs could go here based on route */}
           <div className={`flex items-center text-sm font-medium ${isAdminDashboard ? 'text-slate-400' : 'text-slate-500'}`}>
             Admin <span className={`mx-2 ${isAdminDashboard ? 'text-slate-600' : 'text-slate-300'}`}>/</span> <span className={`capitalize ${isAdminDashboard ? 'text-white' : 'text-slate-900'}`}>{location.pathname.split('/').pop() || 'Dashboard'}</span>
           </div>
        </header>
        <div className={`flex-1 p-8 overflow-y-auto overflow-x-hidden custom-scrollbar ${isAdminDashboard ? 'bg-transparent text-white' : 'bg-[var(--color-background)]'}`}>
          <Outlet />
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </div>
  );
}
