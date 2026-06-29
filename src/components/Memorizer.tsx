"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useQuranStore } from "@/store/useQuranStore";
import { RECITERS, SURAHS } from "@/lib/constants";
import { BACKGROUNDS } from "@/lib/backgrounds";
import YoutubeBackground from "@/components/YoutubeBackground";
import { Play, Pause, RotateCcw, Maximize, Minimize, Settings, ImageIcon, BookOpen, ListPlus, X, Clock } from "lucide-react";

export default function Memorizer() {
  const {
    reciterId,
    surahId,
    repeatCount,
    currentVerse,
    isPlaying,
    currentRepeatProgress,
    fontSize,
    playMode,
    setReciter,
    setSurah,
    setRepeatCount,
    setCurrentVerse,
    setIsPlaying,
    incrementRepeatProgress,
    resetRepeatProgress,
    setFontSize,
    setPlayMode,
    backgroundId,
    backgroundOpacity,
    setBackgroundId,
    setBackgroundOpacity,
    showTafsir,
    setShowTafsir,
    customBackgroundUrl,
    customBackgroundType,
    setCustomBackground,
    isPlaylistMode,
    playlistSurahs,
    setPlaylistSurahs,
    setIsPlaylistMode,
    setIsPrayerModalOpen
  } = useQuranStore();

  const [surahData, setSurahData] = useState<any>(null);
  const [tafsirData, setTafsirData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeBackground, setActiveBackground] = useState('');
  const [activeBackgroundType, setActiveBackgroundType] = useState<'image'|'video'|'youtube'|null>(null);
  const [activeBackgroundBlur, setActiveBackgroundBlur] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const basmalahPlayedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
      setCustomBackground(url, isVideo ? 'video' : 'image');
    }
  };

  // Calculate Active Background
  useEffect(() => {
    if (backgroundId === 'none') {
      setActiveBackground('');
      setActiveBackgroundType(null);
      setActiveBackgroundBlur(false);
    } else if (backgroundId === 'custom') {
      setActiveBackground(customBackgroundUrl || '');
      setActiveBackgroundType(customBackgroundType);
      setActiveBackgroundBlur(false);
    } else if (backgroundId === 'auto') {
      const validBgs = BACKGROUNDS.filter(b => b.id !== 'none' && b.id !== 'auto' && b.id !== 'custom');
      const idx = (surahId - 1) % validBgs.length;
      setActiveBackground(validBgs[idx].url);
      setActiveBackgroundType(validBgs[idx].type as 'image'|'video'|'youtube');
      setActiveBackgroundBlur(!!validBgs[idx].blur);
    } else {
      const bg = BACKGROUNDS.find(b => b.id === backgroundId);
      setActiveBackground(bg?.url || '');
      setActiveBackgroundType(bg?.type as 'image'|'video'|'youtube');
      setActiveBackgroundBlur(!!bg?.blur);
    }
  }, [backgroundId, surahId, customBackgroundUrl, customBackgroundType]);

  // Fetch Surah Data
  useEffect(() => {
    const fetchSurah = async () => {
      setIsLoading(true);
      try {
        const isEveryAyah = reciterId.startsWith("everyayah_");
        const fetchId = isEveryAyah ? "quran-uthmani" : reciterId;
        
        const [res, tafsirRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/${fetchId}`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahId}/ar.muyassar`)
        ]);
        const data = await res.json();
        const tData = await tafsirRes.json();

        if (data.code === 200) {
          const surah = data.data;

          if (isEveryAyah) {
            const folder = reciterId.replace("everyayah_", "");
            surah.ayahs = surah.ayahs.map((ayah: any) => {
              const sId = String(surahId).padStart(3, '0');
              const aId = String(ayah.numberInSurah).padStart(3, '0');
              ayah.audio = `https://everyayah.com/data/${folder}/${sId}${aId}.mp3`;
              return ayah;
            });
          }

          setSurahData(surah);
          setTafsirData(tData.data);
        }
      } catch (error) {
        console.error("Error fetching surah:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSurah();
  }, [surahId, reciterId]);

  // Page Grouping
  const pages = React.useMemo(() => {
    if (!surahData) return {};
    const grouped: Record<number, any[]> = {};
    surahData.ayahs.forEach((ayah: any) => {
      if (!grouped[ayah.page]) grouped[ayah.page] = [];
      grouped[ayah.page].push(ayah);
    });
    return grouped;
  }, [surahData]);

  const currentPage = React.useMemo(() => {
    if (!surahData || !surahData.ayahs) return 1;
    const ayah = surahData.ayahs[currentVerse - 1];
    return ayah ? ayah.page : 1;
  }, [surahData, currentVerse]);

  useEffect(() => {
    basmalahPlayedRef.current = false;
  }, [surahId]);

  // Audio Playback Logic
  useEffect(() => {
    if (!surahData || !surahData.ayahs) return;

    const ayah = surahData.ayahs[currentVerse - 1];
    if (!ayah || !ayah.audio) return; // Finished surah potentially or no audio

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    // Determine if we need to play Basmalah first
    const needsBasmalah = currentVerse === 1 && surahId !== 1 && surahId !== 9 && !basmalahPlayedRef.current;

    if (needsBasmalah) {
      // Create Basmalah URL by replacing the ayah number with 1
      const basmalahUrl = ayah.audio.split('/').slice(0, -1).join('/') + '/1.mp3';
      if (audio.dataset.currentAudio !== 'basmalah') {
        audio.src = basmalahUrl;
        audio.dataset.currentAudio = 'basmalah';
      }
    } else {
      if (audio.dataset.currentAudio !== ayah.audio) {
        audio.src = ayah.audio;
        audio.dataset.currentAudio = ayah.audio;
      }
    }

    const handleEnded = () => {
      if (audio.dataset.currentAudio === 'basmalah') {
        basmalahPlayedRef.current = true;
        audio.src = ayah.audio;
        audio.dataset.currentAudio = ayah.audio;
        if (isPlaying) {
          audio.play().catch(e => console.error("Error playing after basmalah:", e));
        }
        return;
      }

      if (currentRepeatProgress + 1 < repeatCount) {
        incrementRepeatProgress();
        audio.currentTime = 0;
        audio.play();
      } else {
        resetRepeatProgress();
        if (currentVerse < surahData.ayahs.length) {
          setCurrentVerse(currentVerse + 1);
        } else {
          // Finished surah
          if (isPlaylistMode && playlistSurahs.length > 0) {
            const currentIndex = playlistSurahs.indexOf(surahId);
            let nextIndex = 0;
            if (currentIndex !== -1 && currentIndex + 1 < playlistSurahs.length) {
              nextIndex = currentIndex + 1;
            }
            setSurah(playlistSurahs[nextIndex]);
          } else if (playMode === 'full') {
            const nextSurah = surahId < 114 ? surahId + 1 : 1;
            setSurah(nextSurah);
            // It will fetch the next surah and continue playing since isPlaying is true
          } else {
            setCurrentVerse(1);
            setIsPlaying(false); 
            setTimeout(() => setIsPlaying(true), 1000); 
          }
        }
      }
    };

    audio.onended = handleEnded;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => {
          if (e.name !== 'AbortError') {
            console.error("Autoplay prevented or error:", e);
            setIsPlaying(false);
          }
        });
      }
    } else {
      audio.pause();
    }

    return () => {
      audio.onended = null;
    };
  }, [surahData, currentVerse, isPlaying, currentRepeatProgress, repeatCount, playMode, surahId]);

  // Auto-scroll to active verse
  useEffect(() => {
    if (currentVerse > 0) {
      const verseElement = document.getElementById(`verse-${currentVerse}`);
      if (verseElement) {
        setTimeout(() => {
          verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }

      const tafsirContainer = document.getElementById('tafsir-container');
      if (tafsirContainer) {
        setTimeout(() => {
          tafsirContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    }
  }, [currentVerse]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div ref={containerRef} className={`flex flex-col w-full max-w-5xl mx-auto space-y-6 ${isFullscreen ? 'p-4 md:p-8 bg-background h-screen overflow-hidden relative' : 'h-full'}`}>
      
      {/* Control Panel - Hidden in Fullscreen */}
      {!isFullscreen && (
        <div className="bg-card p-4 rounded-2xl shadow border flex flex-col xl:flex-row gap-4 justify-between items-center">
        
        <div className="flex flex-wrap justify-center gap-3 items-center w-full xl:w-auto">
          <select 
            className="bg-background border rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
            value={reciterId}
            onChange={(e) => {
              setReciter(e.target.value);
              setIsPlaying(false);
            }}
          >
            {RECITERS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          
          <select 
            className="bg-background border rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
            value={surahId}
            onChange={(e) => {
              setSurah(Number(e.target.value));
              setIsPlaying(false);
            }}
            disabled={isPlaylistMode}
          >
            {isPlaylistMode ? (
              <option value={surahId}>{surahId}. {SURAHS.find(s => s.id === surahId)?.name} (قائمة تشغيل)</option>
            ) : (
              SURAHS.map((s) => <option key={s.id} value={s.id}>{s.id}. {s.name}</option>)
            )}
          </select>

          <button
            onClick={() => setIsPlaylistModalOpen(true)}
            className={`p-2 rounded-lg border flex items-center gap-2 transition-colors ${isPlaylistMode ? 'bg-primary/20 text-primary border-primary/50' : 'bg-background hover:bg-muted'}`}
            title="قائمة التشغيل المخصصة"
          >
            <ListPlus size={18} />
            <span className="text-sm font-medium hidden sm:inline">قائمة السور</span>
          </button>

          <button
            onClick={() => setIsPrayerModalOpen(true)}
            className="p-2 rounded-lg border flex items-center gap-2 transition-colors bg-background hover:bg-muted"
            title="أوقات الصلاة"
          >
            <Clock size={18} className="text-primary" />
            <span className="text-sm font-medium hidden sm:inline">أوقات الصلاة</span>
          </button>

          <select 
            className="bg-background border rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
            value={playMode}
            onChange={(e) => setPlayMode(e.target.value as 'surah' | 'full')}
          >
            <option value="surah">تكرار السورة فقط</option>
            <option value="full">القرآن كامل متتالي</option>
          </select>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ImageIcon size={18} className="text-muted-foreground hidden sm:block" />
            <select 
              className="bg-background border rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
              value={backgroundId}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  fileInputRef.current?.click();
                }
                setBackgroundId(e.target.value);
              }}
            >
              {BACKGROUNDS.map((bg) => <option key={bg.id} value={bg.id}>{bg.name}</option>)}
            </select>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,video/*" 
              onChange={handleFileUpload} 
            />
          </div>

          {backgroundId !== 'none' && (
            <div className="flex items-center gap-2 w-full sm:w-auto px-2" dir="ltr">
              <input 
                type="range" 
                min="0.05" 
                max="1" 
                step="0.05"
                value={backgroundOpacity}
                onChange={(e) => setBackgroundOpacity(parseFloat(e.target.value))}
                className="w-20 accent-primary cursor-pointer"
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">الشفافية</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 border rounded-lg px-3 py-2 bg-background w-full sm:w-auto">
            <span className="text-sm">التكرار:</span>
            <select 
              className="bg-transparent outline-none text-sm"
              value={repeatCount}
              onChange={(e) => setRepeatCount(Number(e.target.value))}
            >
              <option value={1}>مرة واحدة</option>
              <option value={3}>3 مرات</option>
              <option value={5}>5 مرات</option>
              <option value={10}>10 مرات</option>
              <option value={20}>20 مرة</option>
              <option value={999}>لا نهائي</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <button 
            onClick={() => setShowTafsir(!showTafsir)}
            className={`p-3 rounded-full transition hidden md:flex items-center gap-2 ${showTafsir ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}
            title="التفسير الميسر"
          >
            <BookOpen size={20} />
          </button>

          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 transition shadow-lg flex items-center gap-2 px-6 font-bold"
          >
            {isPlaying ? <><Pause size={20} /> إيقاف</> : <><Play size={20} /> تشغيل</>}
          </button>
          
          <button 
            onClick={() => {
              setCurrentVerse(1);
              resetRepeatProgress();
            }}
            className="p-3 bg-secondary rounded-full hover:bg-secondary/80 transition"
            title="إعادة من البداية"
          >
            <RotateCcw size={20} />
          </button>

          <button 
            onClick={toggleFullscreen}
            className="p-3 bg-secondary rounded-full hover:bg-secondary/80 transition hidden md:block"
            title="ملء الشاشة"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>
      )}

      {/* Reader Viewer */}
      <div className={`relative flex-1 rounded-2xl shadow border overflow-hidden ${isFullscreen ? 'h-[calc(100vh-140px)]' : 'min-h-[50vh]'}`}>
        
        {/* Animated Background */}
        {activeBackgroundType === 'youtube' && (
          <YoutubeBackground videoId={activeBackground} opacity={backgroundOpacity} blur={activeBackgroundBlur} />
        )}
        {activeBackgroundType === 'video' && activeBackground && (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 z-0 pointer-events-none w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: backgroundOpacity }}
            src={activeBackground}
          />
        )}
        {activeBackgroundType === 'image' && activeBackground && (
          <div 
            className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-500 animate-slow-zoom-pan ${activeBackgroundBlur ? 'blur-xl scale-110' : ''}`}
            style={{
              backgroundImage: `url(${activeBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: backgroundOpacity
            }}
          />
        )}

        {/* Content Overlay */}
        <div className="relative z-10 w-full h-full flex flex-col p-4 md:p-8">
          
          {isLoading ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Tafsir Mode Layout (1 Page + Tafsir) */}
              {showTafsir ? (
                <div className="flex flex-col md:flex-row-reverse w-full gap-6 h-full">
                  {/* Right Pane: Mushaf Page */}
                  <div className="flex-1 bg-background/30 backdrop-blur-md p-6 md:p-10 rounded-xl shadow-lg border border-border/50 relative flex flex-col overflow-y-auto">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-foreground/80 font-amiri text-lg">
                      {currentPage}
                    </div>
                    <div 
                      className="text-center font-amiri leading-[2.5] text-justify flex-1 mt-6"
                      style={{ fontSize: `${fontSize}px`, direction: 'rtl' }}
                    >
                      {surahId !== 1 && surahId !== 9 && pages[currentPage]?.[0]?.numberInSurah === 1 && (
                        <div className="w-full text-center mb-6 font-bold text-primary/90" style={{ fontSize: `${fontSize * 1.2}px` }}>
                          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                        </div>
                      )}
                      
                      {pages[currentPage]?.map((ayah: any) => {
                        let cleanText = ayah.text;
                        if (ayah.numberInSurah === 1 && surahId !== 1 && surahId !== 9) {
                          cleanText = cleanText.replace(/بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ/g, '').replace(/بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/g, '').trim();
                        }
                        return (
                          <span 
                            key={ayah.number} 
                            id={`verse-${ayah.numberInSurah}`}
                            className={`inline transition-colors duration-300 cursor-pointer ${ayah.numberInSurah === currentVerse ? 'text-primary font-bold bg-primary/20 rounded px-1' : 'text-foreground hover:bg-primary/10'}`}
                            onClick={() => {
                              setCurrentVerse(ayah.numberInSurah);
                              setIsPlaying(true);
                            }}
                          >
                            {cleanText}
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-primary/40 text-sm mx-2 text-primary/80">
                              {ayah.numberInSurah}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Left Pane: Tafsir */}
                  <div id="tafsir-container" className="flex-1 bg-card/30 backdrop-blur-md p-6 md:p-10 rounded-xl shadow-lg border border-border/50 flex flex-col relative overflow-y-auto">
                    <h3 className="text-xl font-bold mb-6 text-primary absolute top-6 left-1/2 -translate-x-1/2">التفسير الميسر</h3>
                    <div className="w-full text-center space-y-6 mt-16 px-4 pb-10" dir="rtl">
                      {(() => {
                        const currentAyahObj = pages[currentPage]?.find((a: any) => a.numberInSurah === currentVerse) || pages[currentPage]?.[0];
                        if (!currentAyahObj) return null;
                        
                        const tAyah = tafsirData?.ayahs?.find((a: any) => a.numberInSurah === currentAyahObj.numberInSurah);
                        
                        return (
                          <div key={`tafsir-display-${currentAyahObj.numberInSurah}`} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <p className="font-bold text-primary/80 mb-8 text-2xl bg-primary/10 inline-block px-6 py-2 rounded-full border border-primary/20">
                              آية {currentAyahObj.numberInSurah}
                            </p>
                            <p 
                              className="font-amiri text-foreground mb-10 leading-[2.5] border-b border-border/50 pb-8"
                              style={{ fontSize: `${fontSize}px` }}
                            >
                              « {currentAyahObj.text} »
                            </p>
                            <p 
                              className="font-amiri text-foreground/90 leading-[2.5] text-justify bg-background/40 p-8 rounded-2xl border border-primary/20 shadow-inner"
                              style={{ fontSize: `${fontSize * 0.8}px` }}
                            >
                              {tAyah?.text}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                /* Two-Page Spread Layout */
                <div className="flex flex-col md:flex-row w-full gap-2 md:gap-4 justify-center">
                  {[currentPage % 2 !== 0 ? currentPage : currentPage - 1, currentPage % 2 !== 0 ? currentPage + 1 : currentPage].map((pageNum) => (
                    <div key={pageNum} className={`flex-1 bg-background/30 backdrop-blur-md p-6 md:p-10 rounded-xl shadow-2xl border border-border/50 relative flex flex-col min-h-[500px] ${!pages[pageNum] && 'hidden md:flex opacity-50 items-center justify-center'}`}>
                      {pages[pageNum] ? (
                        <>
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-foreground/80 font-amiri text-lg">
                            {pageNum}
                          </div>
                          
                          <div 
                            className="text-center font-amiri leading-[2.5] text-justify flex-1 mt-6 text-foreground"
                            style={{ fontSize: `${fontSize}px`, direction: 'rtl' }}
                          >
                            {surahId !== 1 && surahId !== 9 && pages[pageNum]?.[0]?.numberInSurah === 1 && (
                              <div className="w-full text-center mb-6 font-bold text-primary/90" style={{ fontSize: `${fontSize * 1.2}px` }}>
                                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                              </div>
                            )}
                            
                            {pages[pageNum]?.map((ayah: any) => {
                              let cleanText = ayah.text;
                              if (ayah.numberInSurah === 1 && surahId !== 1 && surahId !== 9) {
                                cleanText = cleanText.replace(/بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ/g, '').replace(/بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ/g, '').trim();
                              }
                              return (
                                <span 
                                  key={ayah.number} 
                                  id={`verse-${ayah.numberInSurah}`}
                                  className={`inline transition-colors duration-300 cursor-pointer ${ayah.numberInSurah === currentVerse ? 'text-primary font-bold bg-primary/20 rounded px-1' : 'hover:bg-primary/10'}`}
                                  onClick={() => {
                                    setCurrentVerse(ayah.numberInSurah);
                                    setIsPlaying(true);
                                  }}
                                >
                                  {cleanText}
                                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-primary/40 text-sm mx-2 text-primary/80">
                                    {ayah.numberInSurah}
                                  </span>
                                </span>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <div className="text-primary/50 text-center mt-auto mb-auto font-amiri text-2xl">
                          {pageNum}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sadaqah Jariyah Footer (Visible in Fullscreen) */}
      {isFullscreen && (
        <div className="w-full py-2 mt-4 text-center animate-in fade-in">
          <p className="font-amiri text-xl text-primary/80 leading-loose">
            « صدقة جارية لي ولوالديّ ولزوجتي ولكل من مر من هنا »
          </p>
        </div>
      )}
      {/* Playlist Modal */}
      {isPlaylistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border flex flex-col max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <ListPlus size={24} /> قائمة التشغيل المخصصة
              </h2>
              <button onClick={() => setIsPlaylistModalOpen(false)} className="p-2 hover:bg-muted rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 border-b border-border/50 bg-muted/30">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={isPlaylistMode}
                    onChange={(e) => {
                      setIsPlaylistMode(e.target.checked);
                      if (e.target.checked && playlistSurahs.length > 0) {
                        setSurah(playlistSurahs[0]);
                        setIsPlaying(false);
                      }
                    }}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${isPlaylistMode ? 'bg-primary' : 'bg-muted-foreground/30'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isPlaylistMode ? 'translate-x-4' : ''}`}></div>
                </div>
                <span className="font-medium">تفعيل وضع قائمة التشغيل (تكرار السور المحددة)</span>
              </label>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6" dir="rtl">
              {playlistSurahs.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground mb-3 px-1">السور المضافة ({playlistSurahs.length}):</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SURAHS.filter(s => playlistSurahs.includes(s.id)).map((s) => (
                      <label key={s.id} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors bg-primary/10 border-primary/50">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-primary rounded border-muted-foreground/30 focus:ring-primary"
                          checked={true}
                          onChange={(e) => {
                            setPlaylistSurahs(playlistSurahs.filter(id => id !== s.id));
                          }}
                        />
                        <span className="text-sm select-none">{s.id}. {s.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-muted-foreground mb-3 px-1">باقي سور القرآن:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SURAHS.filter(s => !playlistSurahs.includes(s.id)).map((s) => (
                    <label key={s.id} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted border-transparent">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary rounded border-muted-foreground/30 focus:ring-primary"
                        checked={false}
                        onChange={(e) => {
                          setPlaylistSurahs([...playlistSurahs, s.id].sort((a, b) => a - b));
                        }}
                      />
                      <span className="text-sm select-none">{s.id}. {s.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-border/50 flex justify-end">
              <button 
                onClick={() => setIsPlaylistModalOpen(false)}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                حفظ وإغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
