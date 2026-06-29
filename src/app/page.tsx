"use client";

import { useState } from "react";
import { Play, BookOpen, Settings, Lock } from "lucide-react";
import Memorizer from "@/components/Memorizer";
import Link from "next/link";

export default function Home() {
  const [showApp, setShowApp] = useState(false);

  if (showApp) {
    return <Memorizer />;
  }

  return (
    <div className="flex flex-col min-h-[80vh]">

      {/* زر الأدمن في أعلى اليمين */}
      <div className="flex justify-end mb-6">
        <Link
          href="/admin/login"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary border border-border hover:border-primary px-4 py-2 rounded-lg transition-all duration-200"
        >
          <Lock size={14} />
          دخول الإدارة
        </Link>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex flex-col items-center justify-center flex-1 space-y-8 text-center animate-in fade-in zoom-in duration-500">

        {/* الشعار */}
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/30 to-primary/5 rounded-full flex items-center justify-center border-2 border-primary/30 shadow-2xl shadow-primary/20">
              <span className="text-7xl select-none">📖</span>
            </div>
            <div className="absolute -inset-1 bg-primary/10 rounded-full blur-xl -z-10"></div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl font-extrabold text-primary tracking-tight">
              منصة تحفيظ القرآن
            </h1>
            <p className="text-xl font-semibold text-muted-foreground">للأطفال والكبار</p>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              تطبيق تفاعلي ذكي يساعد على حفظ القرآن الكريم عبر تكرار الآيات تلقائياً
            </p>
          </div>
        </div>

        {/* بطاقات المميزات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-4">
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col items-center space-y-4 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <div className="p-4 bg-primary/10 rounded-full text-primary">
              <Play size={32} />
            </div>
            <h3 className="text-xl font-bold">تكرار ذكي</h3>
            <p className="text-muted-foreground text-sm">حدد عدد مرات تكرار الآية للتركيز على الحفظ وتثبيته</p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col items-center space-y-4 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <div className="p-4 bg-primary/10 rounded-full text-primary">
              <BookOpen size={32} />
            </div>
            <h3 className="text-xl font-bold">تتبع التلاوة</h3>
            <p className="text-muted-foreground text-sm">تتبع الآية المقروءة بالرسم العثماني وبشكل تفاعلي</p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex flex-col items-center space-y-4 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <div className="p-4 bg-primary/10 rounded-full text-primary">
              <Settings size={32} />
            </div>
            <h3 className="text-xl font-bold">خيارات مرنة</h3>
            <p className="text-muted-foreground text-sm">اختر القارئ، السورة، أو الأجزاء المفضلة للبدء</p>
          </div>
        </div>

        {/* زر البدء */}
        <button
          onClick={() => setShowApp(true)}
          className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white bg-primary rounded-2xl hover:bg-primary/90 hover:-translate-y-1 transition-all duration-200 shadow-xl shadow-primary/30 text-lg mt-4"
        >
          <Play className="w-6 h-6 ml-3 group-hover:scale-110 transition-transform" />
          ابدأ الحفظ الآن
        </button>

      </div>
    </div>
  );
}
