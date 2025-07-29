
import React from 'react';

const playlists = [
  {
    title: "Lofi Beats for Study & Relaxation",
    url: "https://open.spotify.com/embed/playlist/2xbWWIt6F9RY6kt5vrQLED",
  },
  {
    title: "Classical Essentials for Focus",
    url: "https://open.spotify.com/embed/playlist/1Tzp6fwG5HFzZiLiywWc6r?utm_source=generator",
  },
  {
    title: "Ambient Relaxation",
    url: "https://open.spotify.com/embed/playlist/6WcQ3IQGrORJr3bD15cTE4?utm_source=generator",
  }
];


const SpotifyPlayer: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6 text-center">Focus & Relax Playlists</h2>
      <p className="text-center text-slate-600 mb-8 max-w-3xl mx-auto">
        Enjoy these curated Spotify playlists to help you focus, study, or just relax. Choose from lofi, classical, or ambient soundscapes.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {playlists.map((playlist) => (
            <div key={playlist.title} className="w-full">
                <iframe
                style={{ borderRadius: '12px' }}
                src={playlist.url}
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={playlist.title}
                ></iframe>
            </div>
        ))}
      </div>
    </div>
  );
};

export default SpotifyPlayer;
