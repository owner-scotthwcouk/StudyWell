
import React, { useState } from 'react';
import { UserData, UserRole } from '../types';

interface ManageRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToManage: UserData;
  onSuccess: (updatedUser: UserData) => void;
}

const ManageRoleModal: React.FC<ManageRoleModalProps> = ({ isOpen, onClose, userToManage, onSuccess }) => {
  const [newRole, setNewRole] = useState<UserRole>(userToManage.role);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const roles: UserRole[] = ['Student', 'Moderator', 'Staff', 'Admin'];

  const handleUpdateRole = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
        const updatedUser = { ...userToManage, role: newRole };
        onSuccess(updatedUser);
        setIsLoading(false);
        onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Manage Role: {userToManage.name}</h2>
        <form onSubmit={handleUpdateRole} className="space-y-4">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700">User Role</label>
            <select
              id="role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {roles.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
              {isLoading ? 'Updating...' : 'Update Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageRoleModal;