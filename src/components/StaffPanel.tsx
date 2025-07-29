
import React, { useState } from 'react';
import { UserData, UserRole } from '../types';
import BanUserModal from './BanUserModal';

interface PanelProps {
  currentUser: UserData;
  users: UserData[];
  setUsers: React.Dispatch<React.SetStateAction<UserData[]>>;
}

const roleBadgeStyles: Record<UserRole, string> = {
  Admin: 'bg-red-100 text-red-800 border-red-300',
  Staff: 'bg-blue-100 text-blue-800 border-blue-300',
  Moderator: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Student: 'bg-green-100 text-green-800 border-green-300',
};

const statusBadgeStyles = {
    active: 'bg-green-100 text-green-800',
    banned: 'bg-red-100 text-red-800',
};

const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Permanent';
    return new Date(dateString).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
};

const StaffPanel: React.FC<PanelProps> = ({ currentUser, users, setUsers }) => {
  const [userToBan, setUserToBan] = useState<UserData | null>(null);

  const handleUpdateUsers = (updatedUser: UserData) => {
    setUsers(currentUsers =>
      currentUsers.map(u => (u._id === updatedUser._id ? updatedUser : u))
    );
    setUserToBan(null);
  };

  const manageableUsers = users.filter(user => user.role === 'Student' || user.role === 'Moderator');

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg w-full p-6 sm:p-8">
      {userToBan && (
          <BanUserModal
            isOpen={!!userToBan}
            onClose={() => setUserToBan(null)}
            userToBan={userToBan}
            currentUser={currentUser}
            onSuccess={handleUpdateUsers}
          />
      )}

      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 text-center">Staff Panel</h2>
      <div className="max-w-7xl mx-auto">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">User Management (Students & Moderators)</h3>
        <div className="bg-white/50 rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-100/80">
              <tr>
                <th className="p-4 font-semibold text-slate-600">User</th>
                <th className="p-4 font-semibold text-slate-600">Role</th>
                <th className="p-4 font-semibold text-slate-600">Community Status</th>
                <th className="p-4 font-semibold text-slate-600">App Status</th>
                <th className="p-4 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {manageableUsers.map((user) => (
                <tr key={user._id} className="border-t border-slate-200">
                  <td className="p-4 font-medium text-slate-800">
                    <div>{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full border ${roleBadgeStyles[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                   <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${statusBadgeStyles[user.communityStatus]}`}>
                            {user.communityStatus}
                        </span>
                        {user.communityStatus === 'banned' && (
                             <div className="text-xs text-slate-500 mt-1">Expires: {formatDate(user.communityBanExpires)}</div>
                        )}
                   </td>
                    <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${statusBadgeStyles[user.appStatus]}`}>
                            {user.appStatus}
                        </span>
                        {user.appStatus === 'banned' && (
                             <div className="text-xs text-slate-500 mt-1">Expires: {formatDate(user.appBanExpires)}</div>
                        )}
                   </td>
                  <td className="p-4">
                     <button onClick={() => setUserToBan(user)} className="text-orange-600 hover:text-orange-800 font-medium transition-colors">Ban/Escalate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffPanel;