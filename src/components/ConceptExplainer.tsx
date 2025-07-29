
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';

const ConceptExplainer: React.FC = () => {
    const [concept, setConcept] = useState('');
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleExplain = useCallback(async () => {
        if (!concept.trim()) {
            setError('Please enter a concept to explain.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setExplanation('');
        setCopySuccess(false);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: concept,
                config: {
                    systemInstruction: 'You are an expert educator who excels at breaking down complex topics. Explain the following concept in a clear, simple, and easy-to-understand way for a beginner. Use analogies and real-world examples where appropriate to make the explanation engaging and memorable.',
                },
            });

            setExplanation(response.text);

        } catch (e) {
            console.error("Error generating explanation:", e);
            setError('Sorry, something went wrong while generating the explanation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [concept]);

    const handleCopy = () => {
        if (explanation) {
            navigator.clipboard.writeText(explanation).then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            });
        }
    };

    return (
        <div className="p-6 sm:p-8 w-full">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 text-center">Concept Explainer</h2>
            
            <div className="max-w-2xl mx-auto">
                <div className="mb-4">
                    <label htmlFor="conceptInput" className="block text-lg font-semibold text-slate-700 mb-2">Enter a Concept</label>
                    <textarea
                        id="conceptInput"
                        value={concept}
                        onChange={e => setConcept(e.target.value)}
                        placeholder="e.g., Quantum Entanglement, Photosynthesis, The Stock Market..."
                        className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow min-h-[100px] resize-y"
                        aria-label="Input for concept to explain"
                    />
                </div>

                <div className="text-center mb-6">
                    <button
                        onClick={handleExplain}
                        disabled={isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-md transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center mx-auto"
                    >
                        {isLoading && (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isLoading ? 'Explaining...' : 'Generate Explanation'}
                    </button>
                </div>
                
                <div className="relative w-full p-4 bg-slate-100/70 border border-slate-200 rounded-md min-h-[200px] shadow-inner">
                    {isLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50">
                            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-3 text-slate-600 font-medium">Thinking...</p>
                        </div>
                    ) : error ? (
                         <div className="text-center text-red-600 p-4">{error}</div>
                    ) : explanation ? (
                        <>
                            <pre className="whitespace-pre-wrap font-sans text-slate-800 text-sm sm:text-base">{explanation}</pre>
                            <button
                                onClick={handleCopy}
                                className="absolute top-2 right-2 p-2 text-slate-500 hover:bg-slate-200 rounded-md transition-colors"
                                aria-label="Copy explanation"
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
                            Your explanation will appear here.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConceptExplainer;
