
import React, { useState } from 'react';

interface Article {
  id: number;
  title: string;
  content: string[];
}

const articles: Article[] = [
  {
    id: 1,
    title: 'Beating Procrastination: The 2-Minute Rule',
    content: [
      "Procrastination often stems from the feeling of being overwhelmed. The 2-Minute Rule is a simple but powerful technique to overcome this.",
      "The rule is: When you start a new habit, it should take less than two minutes to do. You'll find that nearly any habit can be scaled down into a two-minute version. 'Read before bed each night' becomes 'Read one page.' 'Study for class' becomes 'Open my notes.'",
      "The idea is that motivation will follow action. Once you've started doing the right thing, it's much easier to continue doing it. The goal is to make your habits as easy as possible to start."
    ],
  },
  {
    id: 2,
    title: 'The Importance of a "Shutdown Ritual"',
    content: [
      "In our always-on culture, it can be difficult to switch off from work or study. A 'shutdown ritual' is a set routine you perform at the end of your workday to signal to your brain that it's time to stop thinking about work.",
      "This could be as simple as organizing your desk, making a to-do list for the next day, and saying a specific phrase like 'shutdown complete'. This act of closure helps you properly disengage, leading to better rest and less burnout.",
      "By creating a clear dividing line between your study time and personal time, you can be more present in both."
    ]
  },
  {
    id: 3,
    title: 'Managing Exam Anxiety with Mindful Breathing',
    content: [
      "Exam anxiety is a common experience, but it can be managed. One of the most effective tools is right under your nose: your breath.",
      "When you feel anxious, your breathing often becomes shallow and rapid. You can consciously change this by practicing 'box breathing'. Inhale for 4 seconds, hold your breath for 4 seconds, exhale for 4 seconds, and hold for another 4 seconds. Repeat this for a few cycles.",
      "This simple exercise activates the parasympathetic nervous system, which promotes a state of calm. It's a discreet tool you can use anywhere, even in the exam hall, to ground yourself and reduce anxiety."
    ]
  }
];

const ArticleItem: React.FC<{ article: Article; isOpen: boolean; onClick: () => void; }> = ({ article, isOpen, onClick }) => (
    <div className="border-b border-slate-200">
        <h2>
            <button
                type="button"
                className="flex items-center justify-between w-full p-5 font-medium text-left text-slate-700 hover:bg-slate-100/50 transition-colors"
                onClick={onClick}
                aria-expanded={isOpen}
                aria-controls={`article-content-${article.id}`}
            >
                <span>{article.title}</span>
                <svg
                    className={`w-6 h-6 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
        </h2>
        <div
            id={`article-content-${article.id}`}
            className={`transition-max-height duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
        >
            <div className="p-5 border-t border-slate-200/80">
                <div className="space-y-4 text-slate-600">
                    {article.content.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </div>
        </div>
    </div>
);


const WellnessArticles: React.FC = () => {
    const [openArticleId, setOpenArticleId] = useState<number | null>(1);

    const handleToggle = (id: number) => {
        setOpenArticleId(openArticleId === id ? null : id);
    };

    return (
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 text-center">Wellbeing Articles</h2>
            <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto">
                Practical tips and insights to support your mental and emotional wellbeing as a student.
            </p>
            <div className="max-w-3xl mx-auto bg-white/80 rounded-xl shadow-md overflow-hidden">
                {articles.map(article => (
                    <ArticleItem
                        key={article.id}
                        article={article}
                        isOpen={openArticleId === article.id}
                        onClick={() => handleToggle(article.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default WellnessArticles;
