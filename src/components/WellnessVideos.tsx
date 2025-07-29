
import React from 'react';

interface Video {
  id: string;
  title: string;
  description: string;
}

const videos: Video[] = [
  {
    id: '5MgBikgcWnY',
    title: 'The First 20 Hours -- How to Learn Anything',
    description: 'A popular TEDx talk by Josh Kaufman on how to acquire new skills quickly and effectively.',
  },
  {
    id: 'arj7oStGLkU',
    title: 'Inside the mind of a master procrastinator',
    description: 'A funny and insightful TED talk by Tim Urban exploring why we procrastinate and how it affects us.',
  },
  {
    id: 'O-6f5wQXSu8',
    title: '10-Minute Meditation For Beginners',
    description: 'A simple and effective 10-minute guided meditation to help you find calm and focus.',
  },
   {
    id: 'RcGyVTAoXEU',
    title: 'How to make stress your friend',
    description: 'Health psychologist Kelly McGonigal explains how seeing stress as a positive can change our lives.',
  },
];

const WellnessVideos: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 text-center">Helpful Videos</h2>
      <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto">
        A curated collection of videos to help you with focus, stress management, and learning techniques.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {videos.map(video => (
          <div key={video.id} className="bg-white/80 p-4 rounded-xl shadow-md transition-shadow hover:shadow-lg">
            <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <h3 className="font-semibold text-lg text-slate-800">{video.title}</h3>
            <p className="text-slate-600 text-sm mt-1">{video.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WellnessVideos;
