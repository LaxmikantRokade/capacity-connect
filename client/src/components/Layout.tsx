import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { CapacityBotModal } from './CapacityBotModal';
import { useAuth } from '../context/AuthContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isBotOpen, setIsBotOpen] = useState(false);

  // Show sidebar on internal workspace routes
  const internalRoutes = [
    '/dashboard',
    '/courses',
    '/assessments',
    '/skills',
    '/training',
    '/knowledge',
    '/certificates',
    '/notifications',
    '/admin',
    '/reports',
    '/profile',
  ];

  const isLearningPlayer = location.pathname.startsWith('/learning/');
  const showSidebar = isAuthenticated && !isLearningPlayer && internalRoutes.some((r) => location.pathname.startsWith(r));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar onOpenBot={() => setIsBotOpen(true)} />

      <div className="flex-1 flex w-full">
        {showSidebar && <Sidebar onOpenBot={() => setIsBotOpen(true)} />}
        <main className={`flex-1 flex flex-col ${showSidebar ? 'overflow-x-hidden' : ''}`}>
          {children}
        </main>
      </div>

      {!isLearningPlayer && <Footer />}

      <CapacityBotModal isOpen={isBotOpen} onClose={() => setIsBotOpen(false)} />
    </div>
  );
};
