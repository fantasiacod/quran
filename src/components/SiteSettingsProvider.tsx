"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";

export default function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [adEnabled, setAdEnabled] = useState(false);
  const [adText, setAdText] = useState("");
  const [adLink, setAdLink] = useState("");
  const [showAd, setShowAd] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      // In a real app, this should only fetch once or be cached.
      // Since supabase might not be initialized yet by the user, we wrap in try-catch
      try {
        const { data } = await supabase.from('site_settings').select('*').single();
        if (data) {
          // Apply Primary Color
          if (data.primary_color) {
            document.documentElement.style.setProperty('--primary', hexToHsl(data.primary_color));
          }
          // Apply Title
          if (data.site_name) {
            document.title = data.site_name;
          }
          
          setAdEnabled(data.ad_enabled || false);
          setAdText(data.ad_text || "");
          setAdLink(data.ad_link || "");
        }
      } catch (e) {
        console.warn("Supabase not connected yet.");
      }
    };

    fetchSettings();
  }, []);

  // Helper to convert HEX to HSL for Tailwind CSS variable
  const hexToHsl = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt("0x" + hex[1] + hex[1]);
      g = parseInt("0x" + hex[2] + hex[2]);
      b = parseInt("0x" + hex[3] + hex[3]);
    } else if (hex.length === 7) {
      r = parseInt("0x" + hex[1] + hex[2]);
      g = parseInt("0x" + hex[3] + hex[4]);
      b = parseInt("0x" + hex[5] + hex[6]);
    }
    
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  return (
    <>
      {adEnabled && showAd && adText && (
        <div className="bg-primary text-primary-foreground py-3 px-4 relative flex items-center justify-center text-center animate-in slide-in-from-top duration-500 z-50">
          <p className="text-sm font-medium pr-8">
            {adText}{" "}
            {adLink && (
              <a href={adLink} target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-white/80 mr-2">
                اضغط هنا
              </a>
            )}
          </p>
          <button 
            onClick={() => setShowAd(false)}
            className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {children}
    </>
  );
}
