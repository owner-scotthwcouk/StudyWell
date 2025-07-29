
import React, { useState } from 'react';
import PortalLayout from './components/PortalLayout';
import AdminPanel from './components/AdminPanel';
import StaffPanel from './components/StaffPanel';
import ModeratorPanel from './components/ModeratorPanel';
import { UserData, UserRole } from './types';

// Mock data for the portal since there's no login
const mockAdminUser: UserData = {
    _id: 'admin001', name: 'Admin User', email: 'admin@studywell.com', role: 'Admin', university: 'StudyWell University',
    events: [], pomodoroTasks: [], pomodoroSettings: { focus: 25, shortBreak: 5, longBreak: 15, themeColor: '#4f46e5' },
    communityStatus: 'active', appStatus: 'active', communityBanExpires: null, appBanExpires: null, requiresAdminReview: false,
};
const mockStaffUser: UserData = {
    _id: 'staff001', name: 'Staff Member', email: 'staff@studywell.com', role: 'Staff', university: 'StudyWell University',
    events: [], pomodoroTasks: [], pomodoroSettings: { focus: 25, shortBreak: 5, longBreak: 15, themeColor: '#4f46e5' },
    communityStatus: 'active', appStatus: 'active', communityBanExpires: null, appBanExpires: null, requiresAdminReview: false,
};
const mockModeratorUser: UserData = {
    _id: 'mod001', name: 'Moderator Person', email: 'moderator@studywell.com', role: 'Moderator', university: 'StudyWell University',
    events: [], pomodoroTasks: [], pomodoroSettings: { focus: 25, shortBreak: 5, longBreak: 15, themeColor: '#4f46e5' },
    communityStatus: 'active', appStatus: 'active', communityBanExpires: null, appBanExpires: null, requiresAdminReview: false,
};


const initialMockUsers: UserData[] = [
    { _id: 'student001', name: 'Alice Student', email: 'alice@test.com', role: 'Student', university: 'University of Example', communityStatus: 'active', appStatus: 'active', communityBanExpires: null, appBanExpires: null, requiresAdminReview: false, events: [], pomodoroTasks: [], pomodoroSettings: { focus: 25, shortBreak: 5, longBreak: 15, themeColor: '#4f46e5' } },
    { _id: 'student002', name: 'Bob Banned', email: 'bob@test.com', role: 'Student', university: 'Another University', communityStatus: 'banned', appStatus: 'active', communityBanExpires: '2025-01-01T00:00:00.000Z', appBanExpires: null, requiresAdminReview: false, events: [], pomodoroTasks: [], pomodoroSettings: { focus: 25, shortBreak: 5, longBreak: 15, themeColor: '#4f46e5' } },
    { _id: 'mod001_list', name: 'Charlie Moderator', email: 'charlie@test.com', role: 'Moderator', university: 'StudyWell University', communityStatus: 'active', appStatus: 'active', communityBanExpires: null, appBanExpires: null, requiresAdminReview: false, events: [], pomodoroTasks: [], pomodoroSettings: { focus: 25, shortBreak: 5, longBreak: 15, themeColor: '#4f46e5' } },
    { _id: 'staff001_list', name: 'Diana Staff', email: 'diana@test.com', role: 'Staff', university: 'StudyWell University', communityStatus: 'active', appStatus: 'active', communityBanExpires: null, appBanExpires: null, requiresAdminReview: true, events: [], pomodoroTasks: [], pomodoroSettings: { focus: 25, shortBreak: 5, longBreak: 15, themeColor: '#4f46e5' } },
];

const userMap: Record<UserRole, UserData | undefined> = {
    Admin: mockAdminUser,
    Staff: mockStaffUser,
    Moderator: mockModeratorUser,
    Student: undefined
};

const portalRoles: UserRole[] = ['Admin', 'Staff', 'Moderator'];

const PortalApp: React.FC = () => {
    const [userList, setUserList] = useState<UserData[]>(initialMockUsers);
    const [viewAs, setViewAs] = useState<UserRole>('Admin');
    
    const currentUser = userMap[viewAs];

    const renderPanelForRole = () => {
        if (!currentUser) return <div>Invalid role selected.</div>;
        
        switch (currentUser.role) {
          case 'Admin':
            return <AdminPanel currentUser={currentUser} users={userList} setUsers={setUserList} />;
          case 'Staff':
            return <StaffPanel currentUser={currentUser} users={userList} setUsers={setUserList} />;
          case 'Moderator':
            return <ModeratorPanel currentUser={currentUser} users={userList} setUsers={setUserList} />;
          default:
            return <div>Error: Invalid role.</div>;
        }
    }

    if (!currentUser) {
        return <div>Loading or invalid portal user...</div>
    }

    return (
        <PortalLayout user={currentUser}>
            <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg w-full p-4 mb-8">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <h3 className="font-semibold text-slate-700">Demonstration Controls:</h3>
                    <div className="flex items-center justify-center bg-slate-200/50 p-1 rounded-lg space-x-2">
                        {portalRoles.map(role => (
                             <button
                                key={role}
                                onClick={() => setViewAs(role)}
                                className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
                                    viewAs === role ? 'bg-white shadow text-indigo-600' : 'text-slate-600 hover:bg-white/50'
                                }`}
                            >
                                View as {role}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {renderPanelForRole()}
        </PortalLayout>
    );
};

export default PortalApp;