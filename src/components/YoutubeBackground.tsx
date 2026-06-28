import React from 'react';

interface Props {
  videoId: string;
  opacity: number;
  blur?: boolean;
}

export default function YoutubeBackground({ videoId, opacity, blur = false }: Props) {
  if (!videoId) return null;

  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${videoId}&modestbranding=1&playsinline=1&enablejsapi=1`;

  return (
    <div 
      className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 overflow-hidden bg-black ${blur ? 'blur-2xl scale-110' : ''}`} 
      style={{ opacity }}
    >
      <iframe
        className="absolute top-1/2 left-1/2 w-[120vw] h-[120vh] min-w-[1920px] min-h-[1080px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        src={src}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
