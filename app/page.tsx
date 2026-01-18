"use client";

import { useLockedStore } from "@/store/useLockedStore";
import { LockedTodayScreen } from "@/components/screens/LockedTodayScreen";
import { BacklogScreen } from "@/components/screens/BacklogScreen";
import { EveningRitualScreen } from "@/components/screens/EveningRitualScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";

export default function Home() {
  const activeTab = useLockedStore((state) => state.activeTab);

  if (activeTab === 'settings') {
    return <SettingsScreen />;
  }

  if (activeTab === 'evening-ritual') {
    return <EveningRitualScreen />;
  }

  if (activeTab === 'backlog') {
    return <BacklogScreen />;
  }

  return <LockedTodayScreen />;
}
