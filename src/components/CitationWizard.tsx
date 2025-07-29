
import React, { useState, useMemo } from 'react';

type Style = 'APA' | 'MLA' | 'Harvard';
type SourceType = 'Website' | 'Book' | 'Journal' | 'AI';

const sourceFields: Record<SourceType, Array<{ name: string; label: string; placeholder: string }>> = {
  Website: [
    { name: 'author', label: 'Author(s)', placeholder: 'e.g., Smith, J.' },
    { name: 'year', label: 'Year Published', placeholder: 'e.g., 2023' },
    { name: 'title', label: 'Page Title', placeholder: 'e.g., The History of the Internet' },
    { name: 'websiteName', label: 'Website Name', placeholder: 'e.g., Wikipedia' },
    { name: 'url', label: 'URL', placeholder: 'https://...' },
    { name: 'accessDate', label: 'Date Accessed', placeholder: 'e.g., October 26, 2023' },
  ],
  Book: [
    { name: 'author', label: 'Author(s)', placeholder: 'e.g., Doe, J.' },
    { name: 'year', label: 'Year Published', placeholder: 'e.g., 2021' },
    { name: 'title', label: 'Book Title', placeholder: 'e.g., The Art of Science' },
    { name: 'city', label: 'City of Publication', placeholder: 'e.g., New York' },
    { name: 'publisher', label: 'Publisher', placeholder: 'e.g., Penguin Books' },
  ],
  Journal: [
    { name: 'author', label: 'Author(s)', placeholder: 'e.g., Lee, H.' },
    { name: 'year', label: 'Year Published', placeholder: 'e.g., 2022' },
    { name: 'title', label: 'Article Title', placeholder: 'e.g., Quantum Entanglement Explained' },
    { name: 'journalName', label: 'Journal Name', placeholder: 'e.g., Nature Physics' },
    { name: 'volume', label: 'Volume', placeholder: 'e.g., 18' },
    { name: 'issue', label: 'Issue', placeholder: 'e.g., 4' },
    { name: 'pages', label: 'Pages', placeholder: 'e.g., 201-210' },
  ],
  AI: [
    { name: 'author', label: 'Author/Company', placeholder: 'e.g., Google' },
    { name: 'year', label: 'Year', placeholder: 'e.g., 2024' },
    { name: 'title', label: 'AI Model Name', placeholder: 'e.g., Gemini' },
    { name: 'description', label: 'Description', placeholder: 'Large language model' },
    { name: 'url', label: 'URL', placeholder: 'https://gemini.google.com' },
  ],
};

const CitationWizard: React.FC = () => {
  const [style, setStyle] = useState<Style>('APA');
  const [sourceType, setSourceType] = useState<SourceType>('Website');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedCitation, setGeneratedCitation] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const currentFields = useMemo(() => sourceFields[sourceType], [sourceType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = () => {
    let citation = '';
    const { author, year, title, url, websiteName, accessDate, city, publisher, journalName, volume, issue, pages, description } = formData;
    
    switch (style) {
      case 'APA':
        if (sourceType === 'Website') citation = `${author || ''} (${year || 'n.d.'}). *${title || ''}*. ${websiteName || ''}. Retrieved ${accessDate || 'n.d.'}, from ${url || ''}`;
        if (sourceType === 'Book') citation = `${author || ''} (${year || 'n.d.'}). *${title || ''}*. ${city || ''}: ${publisher || ''}.`;
        if (sourceType === 'Journal') citation = `${author || ''} (${year || 'n.d.'}). ${title || ''}. *${journalName || ''}*, *${volume || ''}*(${issue || ''}), ${pages || ''}.`;
        if (sourceType === 'AI') citation = `${author || ''} (${year || 'n.d.'}). *${title}* (${description || 'AI model'}). ${url || ''}`;
        break;
      case 'MLA':
        if (sourceType === 'Website') citation = `${author || ''}. "${title || ''}." *${websiteName || ''}*, ${year || 'n.d.'}, ${url || ''}. Accessed ${accessDate || 'n.d.'}.`;
        if (sourceType === 'Book') citation = `${author || ''}. *${title || ''}*. ${publisher || ''}, ${year || 'n.d.'}.`;
        if (sourceType === 'Journal') citation = `${author || ''}. "${title || ''}." *${journalName || ''}*, vol. ${volume || ''}, no. ${issue || ''}, ${year || 'n.d.'}, pp. ${pages || ''}.`;
        if (sourceType === 'AI') citation = `*${title}*. ${author}, ${year}, ${url}.`;
        break;
      case 'Harvard':
        if (sourceType === 'Website') citation = `${author || ''} ${year || 'n.d.'}, *${title || ''}*, ${websiteName || ''}, viewed ${accessDate || 'n.d.'}, <${url || ''}>.`;
        if (sourceType === 'Book') citation = `${author || ''} ${year || 'n.d.'}, *${title || ''}*, ${publisher || ''}, ${city || ''}.`;
        if (sourceType === 'Journal') citation = `${author || ''} ${year || 'n.d.'}, '${title || ''}', *${journalName || ''}*, vol. ${volume || ''}, no. ${issue || ''}, pp. ${pages || ''}.`;
        if (sourceType === 'AI') citation = `${author || ''} ${year || 'n.d.'}, *${title}* [${description || 'AI model'}], ${url}.`;
        break;
    }
    setGeneratedCitation(citation.replace(/  +/g, ' ').replace(/\. \./g, '.').replace(/\, \./g, '.'));
    setCopySuccess('');
  };

  const handleCopy = () => {
    if (generatedCitation) {
      navigator.clipboard.writeText(generatedCitation).then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      }, () => {
        setCopySuccess('Failed to copy.');
      });
    }
  };

  const handleSourceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSourceType(e.target.value as SourceType);
    setFormData({});
    setGeneratedCitation('');
    setCopySuccess('');
  };

  return (
    <div className="p-6 sm:p-8 w-full">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 text-center">Citation Wizard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label htmlFor="style" className="block text-sm font-medium text-slate-700 mb-1">Referencing Style</label>
          <select id="style" value={style} onChange={e => setStyle(e.target.value as Style)} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option>APA</option>
            <option>MLA</option>
            <option>Harvard</option>
          </select>
        </div>
        <div>
          <label htmlFor="sourceType" className="block text-sm font-medium text-slate-700 mb-1">Source Type</label>
          <select id="sourceType" value={sourceType} onChange={handleSourceTypeChange} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option>Website</option>
            <option>Book</option>
            <option>Journal</option>
            <option>AI</option>
          </select>
        </div>
      </div>
      
      {sourceType === 'AI' && (
        <div className="bg-yellow-100/70 border-l-4 border-yellow-500 text-yellow-800 p-4 my-6 rounded-r-lg shadow-sm" role="alert">
          <p className="font-bold">Important Note</p>
          <p className="text-sm">If you have used StudyWell for AI generated content, StudyWell uses Google Gemini to generate all AI Content. This should be referenced in your work.</p>
        </div>
      )}

      <div className="p-6 bg-white/50 rounded-xl shadow-md mb-8">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Source Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentFields.map(field => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-slate-600">{field.label}</label>
              <input 
                type="text" 
                id={field.name}
                name={field.name} 
                value={formData[field.name] || ''}
                onChange={handleInputChange} 
                className="mt-1 w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center mb-8">
        <button onClick={handleGenerate} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-md transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Generate Citation
        </button>
      </div>

      {generatedCitation && (
        <div className="p-4 bg-slate-100 rounded-lg shadow-inner">
          <h3 className="text-md font-semibold text-slate-600 mb-2">Generated Citation:</h3>
          <div className="relative p-4 bg-white rounded-md border border-slate-200">
            <p className="text-slate-800 break-words pr-12" dangerouslySetInnerHTML={{ __html: generatedCitation.replace(/\*(.*?)\*/g, '<i>$1</i>') }} />
            <button onClick={handleCopy} className="absolute top-2 right-2 p-2 text-slate-500 hover:bg-slate-200 rounded-md transition-colors" aria-label="Copy citation">
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
          </div>
           {copySuccess && <p className="text-sm text-green-600 mt-2 text-right">{copySuccess}</p>}
        </div>
      )}
    </div>
  );
};

export default CitationWizard;
