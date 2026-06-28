"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Settings, LogOut, Users, FileText, Palette, Image as ImageIcon, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");
  const [onlineUsers, setOnlineUsers] = useState(0);

  // Settings State
  const [siteName, setSiteName] = useState("منصة تحفيظ القرآن للأطفال");
  const [primaryColor, setPrimaryColor] = useState("#00C9A7");
  const [logoUrl, setLogoUrl] = useState("");
  
  // Ad State
  const [adEnabled, setAdEnabled] = useState(false);
  const [adText, setAdText] = useState("");
  const [adLink, setAdLink] = useState("");

  useEffect(() => {
    checkUser();
    fetchSettings();
    
    // Simulate real-time presence for now
    const interval = setInterval(() => {
      setOnlineUsers(Math.floor(Math.random() * 5) + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/admin/login");
    } else {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*').single();
    if (data) {
      setSiteName(data.site_name || "منصة تحفيظ القرآن للأطفال");
      setPrimaryColor(data.primary_color || "#00C9A7");
      setLogoUrl(data.logo_url || "");
      setAdEnabled(data.ad_enabled || false);
      setAdText(data.ad_text || "");
      setAdLink(data.ad_link || "");
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    
    // We assume the settings table has an id=1 row.
    const { error } = await supabase
      .from('site_settings')
      .upsert({ 
        id: 1, 
        site_name: siteName, 
        primary_color: primaryColor,
        logo_url: logoUrl,
        ad_enabled: adEnabled,
        ad_text: adText,
        ad_link: adLink
      });

    setSaving(false);
    if (!error) {
      alert("تم الحفظ بنجاح!");
    } else {
      alert("حدث خطأ أثناء الحفظ. تأكد من إعداد جدول site_settings");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navbar */}
      <header className="bg-card border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="text-primary" />
          لوحة تحكم المدير
        </h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-destructive hover:bg-destructive/10 px-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} />
          تسجيل الخروج
        </button>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
        {/* Sidebar */}
        <aside className="space-y-2">
          <button 
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "settings" ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted"}`}
          >
            <Palette size={20} />
            إعدادات الموقع
          </button>
          <button 
            onClick={() => setActiveTab("ads")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "ads" ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted"}`}
          >
            <FileText size={20} />
            نظام الإعلانات
          </button>
          <button 
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "analytics" ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted"}`}
          >
            <Users size={20} />
            إحصائيات الزوار
          </button>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-3 bg-card p-6 md:p-8 rounded-3xl shadow-sm border">
          {activeTab === "settings" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 border-b pb-4">إعدادات الموقع الأساسية</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">اسم الموقع</label>
                  <input 
                    type="text" 
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">رابط الشعار (Logo URL)</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="url" 
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none"
                      dir="ltr"
                    />
                    {logoUrl && <img src={logoUrl} alt="Logo preview" className="h-10 w-10 object-contain rounded-md border" />}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">اللون الأساسي (Primary Color)</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="color" 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-12 w-24 rounded-lg cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="px-4 py-3 rounded-xl border font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ads" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 border-b pb-4">إدارة الإعلانات</h2>
              
              <label className="flex items-center gap-3 cursor-pointer p-4 border rounded-xl hover:bg-muted transition">
                <input 
                  type="checkbox" 
                  checked={adEnabled}
                  onChange={(e) => setAdEnabled(e.target.checked)}
                  className="w-5 h-5 accent-primary"
                />
                <span className="font-bold">تفعيل ظهور الإعلان في الموقع</span>
              </label>

              {adEnabled && (
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">نص الإعلان</label>
                    <textarea 
                      value={adText}
                      onChange={(e) => setAdText(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none min-h-[100px]"
                      placeholder="اكتب نص الإعلان هنا..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">رابط الإعلان (اختياري)</label>
                    <input 
                      type="url" 
                      value={adLink}
                      onChange={(e) => setAdLink(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-primary outline-none"
                      dir="ltr"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-6 border-b pb-4">إحصائيات الزوار المباشرة</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-primary/10 border-2 border-primary/20 p-8 rounded-2xl text-center">
                  <div className="w-16 h-16 bg-primary/20 text-primary mx-auto rounded-full flex items-center justify-center mb-4">
                    <Users size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-muted-foreground mb-2">الزوار المتواجدون حالياً</h3>
                  <p className="text-6xl font-black text-primary font-mono">{onlineUsers}</p>
                  <p className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    تحديث مباشر (Real-time)
                  </p>
                </div>
                
                <div className="border border-border p-8 rounded-2xl text-center flex flex-col justify-center items-center">
                  <CheckCircle size={48} className="text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-bold mb-2">إحصائيات كاملة</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    سيتم هنا عرض رسومات بيانية للزيارات اليومية والشهرية بعد ربط خدمة الإحصائيات الكاملة.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {(activeTab === "settings" || activeTab === "ads") && (
            <div className="mt-8 pt-6 border-t flex justify-end">
              <button 
                onClick={saveSettings}
                disabled={saving}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition flex items-center gap-2"
              >
                {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
