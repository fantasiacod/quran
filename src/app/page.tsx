"use client";

import { useState } from "react";
import { Play, Settings, BookOpen } from "lucide-react";
import Memorizer from "@/components/Memorizer";

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

      <button 
        onClick={() => setShowApp(true)}
        className="mt-8 px-8 py-4 bg-primary text-primary-foreground font-bold text-xl rounded-full shadow-lg hover:bg-primary/90 transition transform hover:-translate-y-1"
      >
        ابدأ التحفيظ الآن
      </button>
    </div>
  );
}
