import React, { useState } from 'react';
import Logo from './components/Logo';
import StudentTools from './components/StudentTools';
import StudentWellness from './components/StudentWellness';
import { useUser } from './context/UserContext';
import NotificationBell from './components/NotificationBell';

type MainView = 'tools' | 'wellness';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<MainView>('tools');
  
  // User context is still used by child components (Scheduler, Pomodoro)
  const { user } = useUser();

  // The user should always exist now, this is a safeguard.
  if (!user) {
    return (
      <main className="bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-200 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 font-sans">
        <div className="mb-8">
            <Logo />
        </div>
        <p className="text-slate-700">Loading...</p>
      </main>
    );
  }

  const renderMainContent = () => {
    switch (activeView) {
        case 'tools':
            return <StudentTools />;
        case 'wellness':
            return <StudentWellness />;
        default:
            return <StudentTools />;
    }
  };

  return (
    <main className="bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-200 min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
      <header className="w-full max-w-5xl mx-auto flex flex-col items-center mb-6 sm:mb-8">
        <div className="w-full flex justify-between items-center">
            {/* Left placeholder to help center the logo */}
            <div className="w-40" />
            
            <Logo />

            {/* Right side content */}
            <div className="flex items-center justify-end w-40">
                <NotificationBell />
            </div>
        </div>
        <nav className="mt-6 w-full max-w-lg bg-white/50 backdrop-blur-sm p-1.5 rounded-xl shadow-sm flex justify-center items-center space-x-2">
          <button
            onClick={() => setActiveView('tools')}
            className={`flex-1 text-center px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              activeView === 'tools'
                ? 'bg-white shadow text-indigo-700'
                : 'text-slate-600 hover:bg-white/70'
            }`}
          >
            Student Tools
          </button>
          <button
            onClick={() => setActiveView('wellness')}
            className={`flex-1 text-center px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              activeView === 'wellness'
                ? 'bg-white shadow text-indigo-700'
                : 'text-slate-600 hover:bg-white/70'
            }`}
          >
            Student Wellness
          </button>
        </nav>
      </header>
      <div className="w-full max-w-5xl mx-auto">
        {renderMainContent()}
      </div>
    </main>
  );
};

export default App;