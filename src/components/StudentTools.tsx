
import React, { useState } from 'react';
import Scheduler from './Scheduler';
import Pomodoro from './Pomodoro';
import CitationWizard from './CitationWizard';
import EssayHelper from './EssayHelper';
import ConceptExplainer from './ConceptExplainer';
import NoteOrganiser from './NoteOrganiser';

type Tool = 'Scheduler' | 'Pomodoro' | 'Citation Wizard' | 'Essay Helper' | 'Concept Explainer' | 'Note Organiser';

const StudentTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>('Scheduler');

  const renderTool = () => {
    switch (activeTool) {
      case 'Scheduler':
        return <Scheduler />;
      case 'Pomodoro':
        return <Pomodoro />;
      case 'Citation Wizard':
        return <CitationWizard />;
      case 'Essay Helper':
        return <EssayHelper />;
      case 'Concept Explainer':
        return <ConceptExplainer />;
      case 'Note Organiser':
        return <NoteOrganiser />;
      default:
        return <Scheduler />;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-wrap justify-center border-b border-slate-300/50">
        {(['Scheduler', 'Pomodoro', 'Citation Wizard', 'Essay Helper', 'Concept Explainer', 'Note Organiser'] as Tool[]).map(tool => (
          <button
            key={tool}
            onClick={() => setActiveTool(tool)}
            className={`px-3 md:px-4 py-3 text-sm md:text-base font-medium transition-all duration-300 relative -mb-px
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
      
      <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg w-full">
        {renderTool()}
      </div>
    </div>
  );
};

export default StudentTools;