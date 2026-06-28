import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuranState {
  reciterId: string;
  surahId: number;
  repeatCount: number;
  currentVerse: number;
  isPlaying: boolean;
  currentRepeatProgress: number;
  fontSize: number;
  playMode: 'surah' | 'full';
  backgroundId: string;
  backgroundOpacity: number;
  showTafsir: boolean;
  customBackgroundUrl: string | null;
  customBackgroundType: 'image' | 'video' | null;
  playlistSurahs: number[];
  isPlaylistMode: boolean;

  setReciter: (id: string) => void;
  setSurah: (id: number) => void;
  setRepeatCount: (count: number) => void;
  setCurrentVerse: (verse: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  incrementRepeatProgress: () => void;
  resetRepeatProgress: () => void;
  setFontSize: (size: number) => void;
  setPlayMode: (mode: 'surah' | 'full') => void;
  setBackgroundId: (id: string) => void;
  setBackgroundOpacity: (opacity: number) => void;
  setShowTafsir: (show: boolean) => void;
  setCustomBackground: (url: string | null, type: 'image' | 'video' | null) => void;
  setPlaylistSurahs: (surahs: number[]) => void;
  setIsPlaylistMode: (enabled: boolean) => void;
}

export const useQuranStore = create<QuranState>()(
  persist(
    (set) => ({
      reciterId: 'ar.alafasy',
      surahId: 1, // Al-Fatihah
      repeatCount: 3,
      currentVerse: 1,
      isPlaying: false,
      currentRepeatProgress: 0,
      fontSize: 28,
      playMode: 'surah',
      backgroundId: 'none',
      backgroundOpacity: 0.1,
      showTafsir: false,
      customBackgroundUrl: null,
      customBackgroundType: null,
      playlistSurahs: [],
      isPlaylistMode: false,

      setReciter: (id) => set({ reciterId: id, currentVerse: 1, currentRepeatProgress: 0 }),
      setSurah: (id) => set({ surahId: id, currentVerse: 1, currentRepeatProgress: 0 }),
      setRepeatCount: (count) => set({ repeatCount: count }),
      setCurrentVerse: (verse) => set({ currentVerse: verse, currentRepeatProgress: 0 }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      incrementRepeatProgress: () =>
        set((state) => ({ currentRepeatProgress: state.currentRepeatProgress + 1 })),
      resetRepeatProgress: () => set({ currentRepeatProgress: 0 }),
      setFontSize: (size) => set({ fontSize: size }),
      setPlayMode: (mode) => set({ playMode: mode }),
      setBackgroundId: (id) => set({ backgroundId: id }),
      setBackgroundOpacity: (opacity) => set({ backgroundOpacity: opacity }),
      setShowTafsir: (show) => set({ showTafsir: show }),
      setCustomBackground: (url, type) => set({ customBackgroundUrl: url, customBackgroundType: type }),
      setPlaylistSurahs: (surahs) => set({ playlistSurahs: surahs }),
      setIsPlaylistMode: (enabled) => set({ isPlaylistMode: enabled }),
    }),
    {
      name: 'quran-memorization-storage',
      partialize: (state) => ({
        reciterId: state.reciterId,
        surahId: state.surahId,
        repeatCount: state.repeatCount,
        currentVerse: state.currentVerse,
        fontSize: state.fontSize,
        playlistSurahs: state.playlistSurahs,
        isPlaylistMode: state.isPlaylistMode,
      }), // only persist these fields
    }
  )
);
