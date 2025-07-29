
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Event, EventType } from '../types';

const eventTypeColors: { [key in EventType]: { dot: string, bg: string } } = {
  Assignment: { dot: 'bg-blue-500', bg: 'bg-blue-100' },
  Exam: { dot: 'bg-red-500', bg: 'bg-red-100' },
  Lecture: { dot: 'bg-green-500', bg: 'bg-green-100' },
  Other: { dot: 'bg-gray-500', bg: 'bg-gray-100' },
};

const formatDateForDisplay = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC' // Use UTC to avoid timezone shifts from YYYY-MM-DD
    });
};

const Scheduler: React.FC = () => {
  const { user, updateUserData } = useUser();
  const events = user?.events || [];
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('Assignment');
  const [date, setDate] = useState('');
  const [view, setView] = useState<ViewType>('Calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) {
      alert('Please fill in the title and date.');
      return;
    }
    const newEvent: Event = {
      id: Date.now(),
      title: title.trim(),
      type,
      date,
    };
    updateUserData({ events: [...events, newEvent] });
    setTitle('');
    setType('Assignment');
    setDate('');
  };

  const handleDelete = (id: number) => {
    const updatedEvents = events.filter(event => event.id !== id);
    updateUserData({ events: updatedEvents });
  };
  
  const EventListItem: React.FC<{event: Event}> = ({ event }) => (
    <li className={`p-4 rounded-lg shadow-sm flex items-center justify-between transition-transform duration-200 hover:scale-[1.02] hover:shadow-md ${eventTypeColors[event.type].bg}`}>
      <div className="flex items-center gap-4">
        <span className={`flex-shrink-0 w-3 h-3 rounded-full ${eventTypeColors[event.type].dot}`}></span>
        <div className="flex-grow">
          <p className="font-semibold text-slate-800">{event.title}</p>
          <p className="text-sm text-slate-500">{formatDateForDisplay(event.date)} - {event.type}</p>
        </div>
      </div>
      <button onClick={() => handleDelete(event.id)} className="text-slate-400 hover:text-red-500 transition-colors ml-4" aria-label={`Delete event ${event.title}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
        </svg>
      </button>
    </li>
  );

  type ViewType = 'Calendar' | 'List';

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();
    
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const selectedDateString = selectedDate?.toISOString().split('T')[0];

    const calendarDays = [];
    
    // Previous month's days
    for (let i = 0; i < startDayOfWeek; i++) {
      const day = new Date(year, month, i - startDayOfWeek + 1);
      calendarDays.push({ date: day, isCurrentMonth: false });
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      calendarDays.push({ date: day, isCurrentMonth: true });
    }

    // Next month's days
    const remainingCells = 42 - calendarDays.length; // 6 rows * 7 days
     for (let i = 1; i <= remainingCells; i++) {
      const day = new Date(year, month + 1, i);
      calendarDays.push({ date: day, isCurrentMonth: false });
    }

    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="p-2 rounded-full hover:bg-slate-200/50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h3 className="text-xl font-semibold text-slate-700">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
          <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="p-2 rounded-full hover:bg-slate-200/50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm text-slate-500 font-medium mb-2">
         {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <div key={index}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(({ date: day, isCurrentMonth }, index) => {
            const dayString = day.toISOString().split('T')[0];
            const dayEvents = events.filter(e => e.date === dayString);
            const isToday = dayString === todayString;
            const isSelected = dayString === selectedDateString;

            return (
              <button 
                key={index} 
                onClick={() => setSelectedDate(day)}
                className={`relative h-12 rounded-lg transition-colors flex flex-col justify-center items-center ${
                  isCurrentMonth ? 'text-slate-700 hover:bg-indigo-100/60' : 'text-slate-400 hover:bg-slate-200/40'
                } ${isSelected ? 'bg-indigo-200/80 font-bold' : ''} ${isToday ? 'ring-2 ring-indigo-400' : ''}`}
              >
                <span>{day.getDate()}</span>
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-1.5 flex space-x-0.5">
                    {dayEvents.slice(0, 3).map(event => (
                      <span key={event.id} className={`w-1.5 h-1.5 rounded-full ${eventTypeColors[event.type].dot}`}></span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };
  
  const selectedDayString = selectedDate?.toISOString().split('T')[0];
  const selectedDayEvents = events.filter(e => e.date === selectedDayString);

  return (
    <div className="p-6 sm:p-8 w-full">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 text-center">My Schedule</h2>
      
      <div className="mb-8 p-6 bg-white/50 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Add a New Event</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" placeholder="e.g., Physics Mid-term"/>
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select id="type" value={type} onChange={e => setType(e.target.value as EventType)} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow">
              <option>Assignment</option>
              <option>Exam</option>
              <option>Lecture</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"/>
          </div>
          <button type="submit" className="w-full lg:w-auto md:col-span-2 lg:col-span-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Event</button>
        </form>
      </div>

      <div className="flex justify-center mb-6 bg-slate-200/50 p-1 rounded-lg">
        {(['Calendar', 'List'] as ViewType[]).map(viewType => (
          <button key={viewType} onClick={() => setView(viewType)} className={`px-4 sm:px-6 py-2 rounded-md text-sm sm:text-base font-medium transition-all ${view === viewType ? 'bg-white shadow' : 'text-slate-600 hover:bg-white/50'}`}>
            {viewType}
          </button>
        ))}
      </div>

      {view === 'Calendar' ? (
        <>
            {renderCalendar()}
            <div className="mt-8">
                <h3 className="text-xl font-semibold text-slate-700 mb-4">Events for <span className="text-indigo-600">{formatDateForDisplay(selectedDayString ?? '')}</span></h3>
                 <ul className="space-y-3">
                    {selectedDayEvents.length > 0 ? (
                        selectedDayEvents.map(event => <EventListItem key={event.id} event={event} />)
                    ) : (
                        <div className="text-center text-slate-500 py-8 bg-white/50 rounded-lg">
                           <p className="font-semibold">No events for this day.</p>
                           <p className="text-sm">Select another day or add a new event.</p>
                        </div>
                    )}
                </ul>
            </div>
        </>
      ) : (
        <div>
          <h3 className="text-xl font-semibold text-slate-700 mb-4">All Upcoming Events</h3>
          <ul className="space-y-3">
            {sortedEvents.length > 0 ? (
              sortedEvents.map(event => <EventListItem key={event.id} event={event} />)
            ) : (
              <div className="text-center text-slate-500 py-8 bg-white/50 rounded-lg">
                  <p className="font-semibold">All clear!</p>
                  <p className="text-sm">No upcoming events. Add one to get started.</p>
              </div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Scheduler;