
import React, { useState } from 'react';
import { UserData, UserRole } from '../types';

interface BanUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToBan: UserData;
  currentUser: UserData;
  onSuccess: (updatedUser: UserData) => void;
}

const BanUserModal: React.FC<BanUserModalProps> = ({ isOpen, onClose, userToBan, currentUser, onSuccess }) => {
  const [banType, setBanType] = useState<'community' | 'app'>('community');
  const [duration, setDuration] = useState('1'); // duration in days, -1 for permanent
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const permissions: Record<UserRole, { types: Partial<Record<'community' | 'app', number[]>>, canEscalate: boolean }> = {
    Moderator: { types: { community: [1, 7, 30, 90, 180] }, canEscalate: true },
    Staff: { types: { community: [1, 7, 30, 180, 365], app: [1, 7, 30, 90, 180] }, canEscalate: true },
    Admin: { types: { community: [1, 7, 30, 365, -1], app: [1, 7, 30, 365, -1] }, canEscalate: false },
    Student: { types: {}, canEscalate: false }
  };
  
  const currentPermissions = permissions[currentUser.role];
  const availableBanTypes = Object.keys(currentPermissions.types) as Array<'community' | 'app'>;
  const availableDurations = currentPermissions.types[banType] || [];

  const handleBan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const roleHierarchy = {
        Student: 1,
        Moderator: 2,
        Staff: 3,
        Admin: 4,
    };

    const currentUserLevel = roleHierarchy[currentUser.role];
    const userToBanLevel = roleHierarchy[userToBan.role];

    // Simulate API call and permission check
    setTimeout(() => {
        // Rule: A user cannot ban someone of the same or higher level.
        if (currentUserLevel <= userToBanLevel) {
            setError("You don't have permission to ban this user role.");
            setIsLoading(false);
            return;
        }

        // Check if duration is permitted for the current user's role
        const availableDurationsForType = permissions[currentUser.role]?.types[banType] || [];
        if (!availableDurationsForType.includes(Number(duration))) {
            setError(`This ban duration is not permitted for your role.`);
            setIsLoading(false);
            return;
        }

        const expiryDate = duration === '-1' ? null : new Date(Date.now() + Number(duration) * 24 * 60 * 60 * 1000).toISOString();
        const updatedUser = { ...userToBan };
        
        if (banType === 'community') {
            updatedUser.communityStatus = 'banned';
            updatedUser.communityBanExpires = expiryDate;
        } else { // app
            updatedUser.appStatus = 'banned';
            updatedUser.appBanExpires = expiryDate;
        }

        onSuccess(updatedUser);
        setIsLoading(false);
        onClose();
    }, 500);
  };
  
  const handleEscalate = () => {
      setIsLoading(true);
      setError('');
      // Simulate API call
      setTimeout(() => {
          const updatedUser = { ...userToBan, requiresAdminReview: true };
          onSuccess(updatedUser);
          setIsLoading(false);
          onClose();
      }, 500);
  };

  const getDurationLabel = (days: number) => {
    if (days === -1) return 'Permanent';
    if (days === 1) return '1 Day';
    if (days === 365) return '1 Year';
    return `${days} Days`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Ban User: {userToBan.name}</h2>
        <form onSubmit={handleBan} className="space-y-4">
          <div>
            <label htmlFor="banType" className="block text-sm font-medium text-slate-700">Ban Type</label>
            <select
              id="banType"
              value={banType}
              onChange={(e) => setBanType(e.target.value as 'community' | 'app')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {availableBanTypes.map(type => <option key={type} value={type} className="capitalize">{type}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-slate-700">Duration</label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {availableDurations.map(d => <option key={d} value={d}>{getDurationLabel(d)}</option>)}
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400">
              {isLoading ? 'Banning...' : 'Apply Ban'}
            </button>
          </div>
        </form>
         {currentPermissions.canEscalate && (
            <div className="mt-4 border-t pt-4">
                <p className="text-sm text-slate-600">Need a longer or different type of ban?</p>
                <button
                    onClick={handleEscalate}
                    disabled={isLoading}
                    className="mt-2 w-full text-sm font-semibold text-blue-600 hover:text-blue-800 disabled:text-blue-300"
                >
                    {currentUser.role === 'Moderator' ? 'Escalate to Staff' : 'Escalate to Admin for Review'}
                </button>
            </div>
         )}
      </div>
    </div>
  );
};

export default BanUserModal;