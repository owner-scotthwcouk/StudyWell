
import React, { useState } from 'react';
import WellnessVideos from './WellnessVideos';
import WellnessArticles from './WellnessArticles';
import SpotifyPlayer from './SpotifyPlayer';

type WellnessTool = 'Videos' | 'Articles' | 'Audio';

const StudentWellness: React.FC = () => {
  const [activeTool, setActiveTool] = useState<WellnessTool>('Videos');

  const renderTool = () => {
    switch (activeTool) {
      case 'Videos':
        return <WellnessVideos />;
      case 'Articles':
        return <WellnessArticles />;
      case 'Audio':
        return <SpotifyPlayer />;
      default:
        return <WellnessVideos />;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-wrap justify-center border-b border-slate-300/50">
        {(['Videos', 'Articles', 'Audio'] as WellnessTool[]).map(tool => (
          <button
            key={tool}
            onClick={() => setActiveTool(tool)}
            className={`px-4 md:px-6 py-3 text-sm md:text-base font-medium transition-all duration-300 relative -mb-px
              ${activeTool === tool
                ? 'text-indigo-600'
                : 'text-slate-500 hover:text-indigo-500'
              }`}
          >
            {tool}
            {activeTool === tool && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg w-full p-6 sm:p-8">
        {renderTool()}
      </div>
    </div>
  );
};

export default StudentWellness;