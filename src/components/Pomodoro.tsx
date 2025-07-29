
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { Task, PomodoroSettings } from '../types';

const Pomodoro: React.FC = () => {
  const { user, updateUserData } = useUser();
  const settings = user?.pomodoroSettings ?? { focus: 25, shortBreak: 5, longBreak: 15, themeColor: '#4f46e5' };
  const tasks = user?.pomodoroTasks ?? [];

  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeRemaining, setTimeRemaining] = useState(settings.focus * 60);
  const [isActive, setIsActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [newTaskText, setNewTaskText] = useState('');

  const focusEndSound = useRef<HTMLAudioElement | null>(null);
  const breakEndSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // When a focus session ends, a break begins.
    if (!focusEndSound.current) focusEndSound.current = new Audio('/assets/pom-break.mp3');
    // When a break session ends, a study session begins.
    if (!breakEndSound.current) breakEndSound.current = new Audio('/assets/pom-study.mp3');
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const resetTimer = useCallback(() => {
    setIsActive(false);
    switch (mode) {
      case 'focus':
        setTimeRemaining(settings.focus * 60);
        break;
      case 'shortBreak':
        setTimeRemaining(settings.shortBreak * 60);
        break;
      case 'longBreak':
        setTimeRemaining(settings.longBreak * 60);
        break;
    }
  }, [mode, settings]);

  useEffect(() => {
    resetTimer();
  }, [settings, resetTimer]);
  
  useEffect(() => {
    let interval: number | null = null;
    if (isActive && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
        if (mode === 'focus') {
            focusEndSound.current?.play().catch(e => console.error("Error playing break start sound:", e));
        } else {
            breakEndSound.current?.play().catch(e => console.error("Error playing focus start sound:", e));
        }
        setIsActive(false);
        setMode(prevMode => prevMode === 'focus' ? 'shortBreak' : 'focus');
    }
    
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isActive, timeRemaining, mode]);
  
   useEffect(() => {
     resetTimer();
   }, [mode, resetTimer]);


  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newSettings = { ...settings, [name]: name === 'themeColor' ? value : Number(value) };
    updateUserData({ pomodoroSettings: newSettings });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() === '') return;
    const newTask: Task = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false,
    };
    updateUserData({ pomodoroTasks: [...tasks, newTask] });
    setNewTaskText('');
  };

  const handleToggleTask = (id: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    updateUserData({ pomodoroTasks: updatedTasks });
  };

  const handleDeleteTask = (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    updateUserData({ pomodoroTasks: updatedTasks });
  };

  const timerDuration = (settings[mode] || 0) * 60;
  const progress = timerDuration > 0 ? ((timerDuration - timeRemaining) / timerDuration) * 100 : 0;
  const circumference = 2 * Math.PI * 90; // 2 * pi * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="p-6 sm:p-8 w-full flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 text-center">Pomodoro Timer</h2>

      <div className="relative w-72 h-72 flex items-center justify-center my-4">
        <svg className="absolute w-full h-full" viewBox="0 0 200 200">
           <circle cx="100" cy="100" r="90" fill="none" stroke={settings.themeColor} strokeOpacity="0.1" strokeWidth="12" />
           <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={settings.themeColor}
              strokeWidth="12"
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
        </svg>
        <div className="relative z-10 text-center">
            <p className="text-6xl font-mono font-bold" style={{ color: settings.themeColor }}>
                {formatTime(timeRemaining)}
            </p>
            <p className="text-slate-500 uppercase tracking-widest text-sm mt-2">
                {mode === 'focus' ? 'Focus' : 'Break'}
            </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 mb-8">
        <button 
          onClick={() => setIsActive(!isActive)}
          className="w-32 text-xl font-bold py-3 px-6 rounded-lg text-white transition-all transform hover:scale-105 shadow-lg"
          style={{ backgroundColor: settings.themeColor }}
          aria-label={isActive ? "Pause timer" : "Start timer"}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
         <button 
          onClick={resetTimer}
          className="p-3 rounded-full text-slate-500 bg-slate-200 hover:bg-slate-300 transition-colors"
          aria-label="Reset timer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 4l16 16"/></svg>
        </button>
        <button 
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="p-3 rounded-full text-slate-500 bg-slate-200 hover:bg-slate-300 transition-colors"
          aria-label="Open settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </button>
      </div>

      <div className="w-full max-w-md mb-6">
        <h3 className="text-lg font-semibold text-slate-700 mb-3 text-center">Task Goals</h3>
        <form onSubmit={handleAddTask} className="flex gap-2 mb-3">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new goal..."
            className="flex-grow p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            aria-label="New task goal"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md text-white font-semibold transition-all transform hover:scale-105 shadow-md"
            style={{ backgroundColor: settings.themeColor }}
            aria-label="Add new task goal"
          >
            Add
          </button>
        </form>

        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-white/50 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    style={{ accentColor: settings.themeColor }}
                    aria-labelledby={`task-text-${task.id}`}
                  />
                  <span
                    id={`task-text-${task.id}`}
                    className={`text-slate-800 transition-all ${
                      task.completed ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  aria-label={`Delete task ${task.text}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 py-4">No goals set. Add one to get started!</p>
          )}
        </div>
      </div>
      
      {isSettingsOpen && (
          <div className="mt-4 w-full max-w-md p-6 bg-white/70 rounded-xl shadow-md animate-fade-in-up">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Settings</h3>
              <div className="space-y-4">
                  <div>
                      <label htmlFor="focus" className="block text-sm font-medium text-slate-700">Focus (minutes)</label>
                      <input type="number" name="focus" id="focus" value={settings.focus} onChange={handleSettingsChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                  </div>
                  <div>
                      <label htmlFor="shortBreak" className="block text-sm font-medium text-slate-700">Short Break (minutes)</label>
                      <input type="number" name="shortBreak" id="shortBreak" value={settings.shortBreak} onChange={handleSettingsChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                  </div>
                  <div>
                      <label htmlFor="longBreak" className="block text-sm font-medium text-slate-700">Long Break (minutes)</label>
                      <input type="number" name="longBreak" id="longBreak" value={settings.longBreak} onChange={handleSettingsChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                  </div>
                  <div className="flex items-center justify-between">
                      <label htmlFor="themeColor" className="block text-sm font-medium text-slate-700">Theme Color</label>
                      <input type="color" name="themeColor" id="themeColor" value={settings.themeColor} onChange={handleSettingsChange} className="w-12 h-8 p-1 border border-slate-300 rounded-md"/>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Pomodoro;