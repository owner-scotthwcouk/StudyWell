
export type UserRole = 'Student' | 'Moderator' | 'Admin' | 'Staff';

export interface User {
  _id: string; // Use _id from MongoDB
  name: string;
  email: string;
  role: UserRole;
}

export type EventType = 'Assignment' | 'Exam' | 'Lecture' | 'Other';

export interface Event {
  id: number;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
}

export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export interface PomodoroSettings {
    focus: number;
    shortBreak: number;
    longBreak: number;
    themeColor: string;
}

// Full user data object from backend, including the core User interface
export interface UserData extends User {
    events: Event[];
    pomodoroTasks: Task[];
    pomodoroSettings: PomodoroSettings;
    communityStatus: 'active' | 'banned';
    appStatus: 'active' | 'banned';
    communityBanExpires: string | null;
    appBanExpires: string | null;
    requiresAdminReview: boolean;
    university?: string;
}
