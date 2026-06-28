"use client";

import { useState } from "react";
import { Play, Settings, BookOpen, Clock } from "lucide-react";
import Memorizer from "@/components/Memorizer";
import { useQuranStore } from "@/store/useQuranStore";

export default function Home() {
  const [showApp, setShowApp] = useState(false);

  if (showApp) {
    return <Memorizer />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary tracking-tight">
          منصة تحفيظ القرآن للأطفال
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          تطبيق تفاعلي ذكي يساعد الأطفال والكبار على حفظ القرآن الكريم عبر تكرار الآيات تلقائياً
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col items-center space-y-4 hover:shadow-md transition">
          <div className="p-4 bg-primary/10 rounded-full text-primary">
            <Play size={32} />
          </div>
          <h3 className="text-xl font-bold">تكرار ذكي</h3>
          <p className="text-muted-foreground text-sm">حدد عدد مرات تكرار الآية للتركيز على الحفظ وتثبيته</p>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col items-center space-y-4 hover:shadow-md transition">
          <div className="p-4 bg-primary/10 rounded-full text-primary">
            <BookOpen size={32} />
          </div>
          <h3 className="text-xl font-bold">تتبع التلاوة</h3>
          <p className="text-muted-foreground text-sm">تتبع الآية المقروءة بالرسم العثماني وبشكل تفاعلي</p>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col items-center space-y-4 hover:shadow-md transition">
          <div className="p-4 bg-primary/10 rounded-full text-primary">
            <Settings size={32} />
          </div>
          <h3 className="text-xl font-bold">خيارات مرنة</h3>
          <p className="text-muted-foreground text-sm">اختر القارئ، السورة، أو الأجزاء المفضلة للبدء</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
        <button
          onClick={() => setShowApp(true)}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-primary font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover:bg-primary/90 hover:-translate-y-1 w-full sm:w-auto"
        >
          <Play className="w-6 h-6 ml-2 animate-pulse" />
          <span>ابدأ الحفظ الآن</span>
        </button>
        
        <button
          onClick={() => {
            // We need to show the app first to mount the store effectively or we can just open modal
            setShowApp(true);
            // Small delay to let Memorizer mount and sync store if needed
            setTimeout(() => {
              useQuranStore.getState().setIsPrayerModalOpen(true);
            }, 100);
          }}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-primary transition-all duration-200 bg-primary/10 border-2 border-primary/20 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary hover:bg-primary/20 w-full sm:w-auto"
        >
          <Clock className="w-6 h-6 ml-2" />
          <span>أوقات الصلاة</span>
        </button>
      </div>
    </div>
  );
}
