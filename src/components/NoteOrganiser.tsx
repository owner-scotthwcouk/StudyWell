
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';

interface OrganisedNoteSection {
    title: string;
    points: string[];
}

interface OrganisedNote {
    sections: OrganisedNoteSection[];
}

const NoteOrganiser: React.FC = () => {
    const [rawNotes, setRawNotes] = useState('');
    const [organisedNotes, setOrganisedNotes] = useState<OrganisedNote | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleOrganise = useCallback(async () => {
        if (!rawNotes.trim()) {
            setError('Please enter some notes to organise.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setOrganisedNotes(null);
        setCopySuccess(false);
        
        const schema = {
          type: Type.OBJECT,
          properties: {
            sections: {
              type: Type.ARRAY,
              description: 'The organized sections of the notes.',
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: 'The title of this section.'
                  },
                  points: {
                    type: Type.ARRAY,
                    description: 'The key points or sub-notes for this section as bullet points.',
                    items: { type: Type.STRING }
                  }
                },
                required: ['title', 'points']
              }
            }
          },
          required: ['sections']
        };

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Organize the following notes into clear, structured sections. Identify the main themes and group related points under appropriate headings. Notes: ${rawNotes}`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: schema,
                },
            });

            const parsed = JSON.parse(response.text);
            setOrganisedNotes(parsed);

        } catch (e) {
            console.error("Error organizing notes:", e);
            setError('Sorry, something went wrong while organizing the notes. The text might be too complex. Please try again or simplify the notes.');
        } finally {
            setIsLoading(false);
        }
    }, [rawNotes]);

    const handleCopy = () => {
        if (organisedNotes) {
            const textToCopy = organisedNotes.sections.map(section => {
                const points = section.points.map(p => `  • ${p}`).join('\n');
                return `${section.title}\n${points}`;
            }).join('\n\n');

            navigator.clipboard.writeText(textToCopy).then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            });
        }
    };
    
    return (
        <div className="p-6 sm:p-8 w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 text-center">Note Organiser</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label htmlFor="rawNotes" className="text-lg font-semibold text-slate-700 mb-2">Your Raw Notes</label>
                    <textarea
                        id="rawNotes"
                        value={rawNotes}
                        onChange={e => setRawNotes(e.target.value)}
                        placeholder="Paste your messy notes here... from lectures, brainstorming, etc."
                        className="w-full flex-grow p-3 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow min-h-[300px] resize-y"
                        aria-label="Input for raw notes"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-lg font-semibold text-slate-700 mb-2">Organised Notes</label>
                    <div className="relative w-full flex-grow p-3 bg-slate-100/70 border border-slate-200 rounded-md min-h-[300px] shadow-inner">
                        {isLoading ? (
                             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50">
                                <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="mt-3 text-slate-600 font-medium">Organising...</p>
                            </div>
                        ) : error ? (
                             <div className="text-center text-red-600 p-4">{error}</div>
                        ) : organisedNotes ? (
                            <>
                                <div className="prose prose-sm sm:prose-base max-w-none">
                                {organisedNotes.sections.map((section, idx) => (
                                    <div key={idx} className="mb-4">
                                        <h3 className="font-bold text-slate-800">{section.title}</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {section.points.map((point, pIdx) => (
                                                <li key={pIdx} className="text-slate-700">{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="absolute top-2 right-2 p-2 text-slate-500 hover:bg-slate-200 rounded-md transition-colors"
                                    aria-label="Copy organised notes"
                                >
                                    {copySuccess ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    )}
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500 text-center">
                                Your organised notes will appear here.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="text-center mt-6">
                <button
                    onClick={handleOrganise}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-md transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center mx-auto"
                >
                    {isLoading && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {isLoading ? 'Organising...' : 'Organise Notes'}
                </button>
            </div>
        </div>
    );
};

export default NoteOrganiser;
