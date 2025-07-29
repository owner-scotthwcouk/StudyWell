
import React, { useState, useCallback, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';

type HelperMode = 'Outline' | 'Paraphrase' | 'Grammar & Style';

const EssayHelper: React.FC = () => {
    const [activeMode, setActiveMode] = useState<HelperMode>('Outline');
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    const placeholderText: Record<HelperMode, string> = {
        Outline: 'Enter your essay topic or thesis statement to generate an outline...',
        Paraphrase: 'Paste the text you want to rephrase. Aim for a paragraph or a few sentences for best results.',
        'Grammar & Style': 'Paste your text here to check for grammar, spelling, and style improvements.',
    };

    const wordCount = useMemo(() => {
        return inputText.trim().split(/\s+/).filter(Boolean).length;
    }, [inputText]);

    const getSystemInstruction = (mode: HelperMode): string => {
        switch (mode) {
            case 'Outline':
                return 'You are an academic assistant specializing in structuring arguments. Create a clear, logical, and detailed essay outline based on the user\'s topic. Use nested bullet points for structure.';
            case 'Paraphrase':
                return 'You are an expert writer. Rephrase the following text to enhance clarity, improve flow, and vary vocabulary, while strictly preserving the original meaning. Do not add any new information or opinions.';
            case 'Grammar & Style':
                return 'You are a meticulous proofreader. Correct all grammatical errors, spelling mistakes, and punctuation issues in the provided text. Additionally, offer suggestions for improving sentence structure and overall style. Return only the corrected text.';
        }
    };
    
    const handleGenerate = useCallback(async () => {
        if (!inputText.trim()) {
            setError('Please enter some text to get started.');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setOutputText('');
        setCopySuccess(false);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: inputText,
                config: {
                    systemInstruction: getSystemInstruction(activeMode),
                },
            });

            setOutputText(response.text);

        } catch (e) {
            console.error("Error generating content:", e);
            setError('Sorry, something went wrong while generating content. Please try again.');
        } finally {
            setIsLoading(false);
        }

    }, [inputText, activeMode]);

    const handleCopy = () => {
        if (outputText) {
            navigator.clipboard.writeText(outputText).then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            });
        }
    };
    
    return (
        <div className="p-6 sm:p-8 w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 text-center">Essay & Report Helper</h2>
            
            <div className="flex justify-center mb-6 bg-slate-200/50 p-1 rounded-lg">
                {(['Outline', 'Paraphrase', 'Grammar & Style'] as HelperMode[]).map(mode => (
                    <button
                        key={mode}
                        onClick={() => {
                            setActiveMode(mode);
                            setOutputText('');
                            setError(null);
                        }}
                        className={`px-3 sm:px-5 py-2 rounded-md text-sm sm:text-base font-medium transition-all ${
                            activeMode === mode ? 'bg-white shadow text-indigo-600' : 'text-slate-600 hover:bg-white/50'
                        }`}
                    >
                        {mode}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="inputText" className="text-lg font-semibold text-slate-700">Your Text</label>
                        <span className="text-sm text-slate-600 font-semibold bg-slate-200/60 px-2 py-1 rounded-md" aria-live="polite">
                            Word Count: {wordCount}
                        </span>
                    </div>
                    <textarea
                        id="inputText"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        placeholder={placeholderText[activeMode]}
                        className="w-full flex-grow p-3 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow min-h-[250px] resize-y"
                        aria-label="Input text for essay helper"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-lg font-semibold text-slate-700 mb-2">AI Suggestions</label>
                    <div className="relative w-full flex-grow p-3 bg-slate-100/70 border border-slate-200 rounded-md min-h-[250px] shadow-inner">
                        {isLoading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50">
                                <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="mt-3 text-slate-600 font-medium">Generating...</p>
                            </div>
                        ) : error ? (
                             <div className="text-center text-red-600 p-4">{error}</div>
                        ) : outputText ? (
                            <>
                                <pre className="whitespace-pre-wrap font-sans text-slate-800 text-sm sm:text-base">{outputText}</pre>
                                <button
                                    onClick={handleCopy}
                                    className="absolute top-2 right-2 p-2 text-slate-500 hover:bg-slate-200 rounded-md transition-colors"
                                    aria-label="Copy suggestions"
                                >
                                    {copySuccess ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500 text-center">
                                Your results will appear here.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="text-center mt-6">
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-md transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center mx-auto"
                >
                    {isLoading && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {isLoading ? 'Thinking...' : `Generate ${activeMode}`}
                </button>
            </div>
        </div>
    );
};

export default EssayHelper;
