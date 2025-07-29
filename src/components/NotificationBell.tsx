
import React, { useState, useEffect, useRef } from 'react';

// Mock data for notifications
interface Notification {
  id: number;
  message: string;
  timestamp: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, message: 'Your essay outline for "The Renaissance" is ready.', timestamp: '15m ago', read: true },
  { id: 2, message: 'Reminder: Physics Mid-term is tomorrow.', timestamp: '1h ago', read: true },
  { id: 3, message: 'You have completed 4 Pomodoro sessions today. Keep it up!', timestamp: '3h ago', read: false },
];

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const notificationSound = useRef<HTMLAudioElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    // Initialize the audio element
    if (!notificationSound.current) {
        notificationSound.current = new Audio('/assets/notification.mp3');
        notificationSound.current.volume = 0.5;
    }

    // Simulate a new notification arriving after 5 seconds
    const timer = setTimeout(() => {
      const newNotification: Notification = {
        id: Date.now(),
        message: 'New comment on your post in "General Discussion".',
        timestamp: 'Just now',
        read: false,
      };
      setNotifications(prev => [newNotification, ...prev]);
      notificationSound.current?.play().catch(e => console.error("Error playing notification sound:", e));
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


  const handleToggle = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
        // Mark all as read when opening
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors duration-300"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200/80 overflow-hidden z-20 animate-fade-in-down">
          <div className="p-3 flex justify-between items-center border-b">
            <h3 className="font-semibold text-slate-800">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div key={notification.id} className="p-3 flex items-start gap-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70 transition-colors">
                   <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${!notification.read ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                  <div className="flex-grow">
                    <p className="text-sm text-slate-700">{notification.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{notification.timestamp}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-sm text-slate-500">No new notifications.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
