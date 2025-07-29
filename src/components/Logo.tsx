import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <img
        src="/assets/StudyWell-Logo.png"
        alt="StudyWell Logo"
        className="w-32 sm:w-40"
        aria-label="StudyWell Logo"
      />
      <span className="text-3xl sm:text-4xl font-bold text-slate-700 tracking-wide select-none">
        StudyWell
      </span>
    </div>
  );
};

export default Logo; // ✅ This must exist
