
import React from 'react';
import Logo from './Logo';
import { UserData, UserRole } from '../types';

interface PortalLayoutProps {
  user: UserData;
  children: React.ReactNode;
}

const roleBadges: Record<UserRole, string> = {
  Admin: 'bg-red-100 text-red-800',
  Staff: 'bg-blue-100 text-blue-800',
  Moderator: 'bg-yellow-100 text-yellow-800',
  Student: 'bg-green-100 text-green-800',
};

const PortalLayout: React.FC<PortalLayoutProps> = ({ user, children }) => {
  return (
    <div className="min-h-screen w-full bg-slate-100 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" aria-label="Go to student homepage">
              <Logo />
            </a>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-slate-800">{user.name}</p>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${roleBadges[user.role]}`}>{user.role}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PortalLayout;