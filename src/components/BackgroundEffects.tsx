import React from 'react';

interface Props {
  effectId: string;
  opacity: number;
}

export default function BackgroundEffects({ effectId, opacity }: Props) {
  if (!effectId) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 overflow-hidden" style={{ opacity }}>
      {effectId === 'falling_stars' && (
        <div className="relative w-full h-full bg-slate-950">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-60"></div>
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className="absolute bg-white w-1 h-1 rounded-full shadow-[0_0_10px_2px_#fff]"
              style={{
                top: `${Math.random() * 50}%`,
                left: `${Math.random() * 100}%`,
                animation: `shootingStar ${2 + Math.random() * 4}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-32 h-[1px] bg-gradient-to-r from-white to-transparent origin-left rotate-45"></div>
            </div>
          ))}
        </div>
      )}

      {effectId === 'galaxy' && (
        <div className="relative w-full h-full bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-purple-900/20 to-black animate-pulse duration-[10000ms]"></div>
          <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[spin_180s_linear_infinite]"></div>
          <div className="absolute inset-0 opacity-60 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[spin_120s_linear_infinite_reverse]"></div>
        </div>
      )}

      {effectId === 'sea_movement' && (
        <div className="relative w-full h-full bg-gradient-to-b from-slate-900 to-cyan-900">
           <svg className="absolute bottom-0 w-full h-[50vh] text-cyan-800/40" preserveAspectRatio="none" viewBox="0 0 1440 320" style={{ animation: 'wave 15s ease-in-out infinite alternate' }}>
             <path fill="currentColor" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,229.3C960,245,1056,235,1152,213.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
           </svg>
           <svg className="absolute bottom-0 w-full h-[40vh] text-blue-900/50" preserveAspectRatio="none" viewBox="0 0 1440 320" style={{ animation: 'wave 12s ease-in-out infinite alternate-reverse' }}>
             <path fill="currentColor" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
           </svg>
        </div>
      )}

      {effectId === 'planets' && (
        <div className="relative w-full h-full bg-slate-950">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
          {/* Planet */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full shadow-[inset_-30px_-30px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(255,255,255,0.05)] bg-gradient-to-br from-orange-400 via-red-600 to-purple-900"></div>
          {/* Moon */}
          <div className="absolute top-1/4 right-1/4 w-12 h-12 rounded-full shadow-[inset_-5px_-5px_10px_rgba(0,0,0,0.8)] bg-slate-300 animate-[orbit_20s_linear_infinite] origin-[160px_160px]"></div>
        </div>
      )}

      {effectId === 'islamic_stars' && (
        <div className="relative w-full h-full bg-emerald-950">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-30 animate-[pulse_6s_ease-in-out_infinite]"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-emerald-950/50"></div>
        </div>
      )}
    </div>
  );
}
