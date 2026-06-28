"use client";
import dynamic from "next/dynamic";

const PrayerTimes = dynamic(() => import("@/components/PrayerTimes"), { ssr: false });
const AzkarNotifications = dynamic(() => import("@/components/AzkarNotifications"), { ssr: false });

export default function ClientComponents() {
  return (
    <>
      <PrayerTimes />
      <AzkarNotifications />
    </>
  );
}
