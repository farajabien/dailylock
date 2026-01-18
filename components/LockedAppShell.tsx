"use client";

import React, { useEffect, useState } from 'react';
import { useLockedStore } from "@/store/useLockedStore";
import { LockedTodayScreen } from "@/components/screens/LockedTodayScreen";
import { BacklogScreen } from "@/components/screens/BacklogScreen";
import { EveningRitualScreen } from "@/components/screens/EveningRitualScreen";
import { CompletedScreen } from "@/components/screens/CompletedScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";

export const LockedAppShell: React.FC = () => {
  const activeTab = useLockedStore((state) => state.activeTab);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner / skeleton matching the locked screen
  }

  if (activeTab === 'settings') {
    return <SettingsScreen />;
  }

  if (activeTab === 'evening-ritual') {
    return <EveningRitualScreen />;
  }

  if (activeTab === 'backlog') {
    return <BacklogScreen />;
  }
  
  if (activeTab === 'completed') {
    return <CompletedScreen />;
  }

  return <LockedTodayScreen />;
};
