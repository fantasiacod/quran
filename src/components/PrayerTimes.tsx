"use client";

import { useEffect, useState, useRef } from "react";
import { useQuranStore } from "@/store/useQuranStore";

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_NAMES: Record<string, string> = {
  Fajr: "الفجر",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء"
};

// Makkah Adhan audio URL
const ADHAN_AUDIO_URL = "https://media.blubrry.com/muslim_central_adhan/p/dts.podtrac.com/redirect.mp3/archive.org/download/adhan-makkah/Adhan-Makkah.mp3";

export default function PrayerTimes() {
  const [timings, setTimings] = useState<Record<string, string> | null>(null);
  const [activeAdhan, setActiveAdhan] = useState<string | null>(null);
  const adhanAudioRef = useRef<HTMLAudioElement | null>(null);
  const { isPlaying, setIsPlaying, isPrayerModalOpen, setIsPrayerModalOpen } = useQuranStore();
  const wasPlayingRef = useRef(false);
  const [showDua, setShowDua] = useState(false);

  // 1. Get Geolocation & Fetch Timings
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const date = new Date();
            const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
            const res = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=4`);
            const data = await res.json();
            if (data.code === 200) {
              setTimings(data.data.timings);
            }
          } catch (error) {
            console.error("Error fetching prayer times:", error);
          }
        },
        (error) => console.log("Geolocation error or denied:", error)
      );
    }
  }, []);

  // 2. Check time every minute
  useEffect(() => {
    if (!timings) return;

    const checkTime = () => {
      if (activeAdhan) return; // Don't trigger if already playing

      const now = new Date();
      // Format as HH:mm to match Aladhan API output
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const currentTimeStr = `${hours}:${minutes}`;

      for (const prayer of PRAYERS) {
        if (timings[prayer] === currentTimeStr) {
          triggerAdhan(prayer);
          break;
        }
      }
    };

    const interval = setInterval(checkTime, 30000); // Check every 30s
    checkTime(); // Check immediately

    return () => clearInterval(interval);
  }, [timings, activeAdhan]);

  const triggerAdhan = (prayer: string) => {
    wasPlayingRef.current = isPlaying;
    if (isPlaying) {
      setIsPlaying(false);
    }
    
    setActiveAdhan(prayer);

    if (!adhanAudioRef.current) {
      adhanAudioRef.current = new Audio(ADHAN_AUDIO_URL);
    }
    
    adhanAudioRef.current.onended = () => {
      setActiveAdhan(null);
      setShowDua(true);
      
      // Auto close Dua after 15 seconds
      setTimeout(() => {
        // Only if it's still showing (user didn't manually close)
        setShowDua(prev => {
          if (prev) {
            if (wasPlayingRef.current) setIsPlaying(true);
            return false;
          }
          return prev;
        });
      }, 15000);
    };

    adhanAudioRef.current.play().catch(e => {
      console.error("Could not play Adhan:", e);
      // Auto close if playback failed
      setActiveAdhan(null);
      if (wasPlayingRef.current) setIsPlaying(true);
    });
  };

  // Skip Adhan manually
  const skipAdhan = () => {
    if (adhanAudioRef.current) {
      adhanAudioRef.current.pause();
      adhanAudioRef.current.currentTime = 0;
    }
    setActiveAdhan(null);
    if (wasPlayingRef.current) {
      setIsPlaying(true);
    }
  };

  if (showDua) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-500 p-4">
        <div className="bg-card border-2 border-primary p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-2xl w-full mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-primary">دعاء ما بعد الأذان</h2>
          <p className="text-2xl md:text-3xl text-foreground leading-relaxed font-arabic py-4">
            اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّداً الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَاماً مَحْمُوداً الَّذِي وَعَدْتَهُ.
          </p>
          <button 
            onClick={() => {
              setShowDua(false);
              if (wasPlayingRef.current) setIsPlaying(true);
            }}
            className="mt-8 bg-primary text-primary-foreground px-8 py-3 rounded-full hover:bg-primary/90 transition text-lg font-bold"
          >
            متابعة التلاوة
          </button>
        </div>
      </div>
    );
  }

  if (isPrayerModalOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-300 p-4">
        <div className="bg-card border border-border p-6 md:p-8 rounded-3xl shadow-2xl max-w-md w-full relative">
          <button 
            onClick={() => setIsPrayerModalOpen(false)}
            className="absolute top-4 left-4 p-2 bg-muted hover:bg-destructive hover:text-destructive-foreground rounded-full transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>

          <h2 className="text-2xl font-bold text-center text-primary mb-6">أوقات الصلاة</h2>
          
          {!timings ? (
            <p className="text-center text-muted-foreground py-8">جاري تحديد الموقع...</p>
          ) : (
            <div className="space-y-3">
              {PRAYERS.map(prayer => (
                <div key={prayer} className="flex justify-between items-center p-4 bg-muted/50 rounded-2xl hover:bg-primary/10 transition-colors">
                  <span className="font-bold text-lg">{PRAYER_NAMES[prayer]}</span>
                  <span className="text-xl font-mono text-primary" dir="ltr">{timings[prayer]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!activeAdhan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-500 p-4">
      <div className="bg-card border-2 border-primary p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-lg w-full mx-auto space-y-6">
        <div className="w-24 h-24 mx-auto bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 1 3 3v1h-6V5a3 3 0 0 1 3-3Z"/>
            <path d="M18.5 7h-13A1.5 1.5 0 0 0 4 8.5v6.26A12 12 0 0 0 12 22a12 12 0 0 0 8-7.24V8.5A1.5 1.5 0 0 0 18.5 7Z"/>
            <path d="M8 7v6"/>
            <path d="M16 7v6"/>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-primary">حان الآن وقت الصلاة</h2>
        <p className="text-xl text-muted-foreground">
          أذان صلاة <span className="font-bold text-foreground">{PRAYER_NAMES[activeAdhan]}</span>
          <br/>
          حسب التوقيت المحلي لمدينتك
        </p>

        <p className="text-sm text-muted-foreground mt-4 opacity-75">
          تم إيقاف التلاوة مؤقتاً، وستستأنف تلقائياً بعد الأذان والدعاء
        </p>

        <button 
          onClick={skipAdhan}
          className="mt-8 px-6 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition"
        >
          تخطي الأذان والمتابعة
        </button>
      </div>
    </div>
  );
}
