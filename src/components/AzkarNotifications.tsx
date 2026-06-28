"use client";

import { useEffect, useRef } from "react";

export default function AzkarNotifications() {
  const lastNotifiedHour = useRef<number | null>(null);

  useEffect(() => {
    // Request permission on mount if not already granted or denied
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Ensure we only notify once per target hour
      if (lastNotifiedHour.current === hours) return;

      // 12:00 AM (Sleep Azkar)
      if (hours === 0 && minutes === 0) {
        sendNotification("أذكار النوم 🌙", "حان الآن وقت قراءة أذكار النوم. تقبل الله طاعتكم.");
        lastNotifiedHour.current = hours;
      }
      
      // 6:00 AM (Morning Azkar)
      else if (hours === 6 && minutes === 0) {
        sendNotification("أذكار الصباح ☀️", "أصبحنا وأصبح الملك لله. حان وقت أذكار الصباح.");
        lastNotifiedHour.current = hours;
      }
    };

    const sendNotification = (title: string, body: string) => {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, {
          body,
          dir: "rtl",
          lang: "ar"
        });
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkTime, 30000);
    checkTime();

    return () => clearInterval(interval);
  }, []);

  return null;
}
