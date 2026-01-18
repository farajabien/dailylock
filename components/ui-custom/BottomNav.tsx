import React from 'react';
import { Calendar, Layers, Settings, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLockedStore } from '@/store/useLockedStore';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useLockedStore();

  return (
    <nav className="fixed bottom-0 w-full z-20 border-t border-gray-200 dark:border-[#2a2d33] bg-locked-background-light/90 dark:bg-locked-background-dark/90 backdrop-blur-md pb-safe">
      <div className="max-w-md mx-auto flex justify-around items-center h-20 px-2">
        {/* Today Tab */}
        <button 
          onClick={() => setActiveTab('today')}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors group",
            activeTab === 'today' ? "text-locked-primary" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          )}
        >
          <div className={cn(
            "relative p-1 rounded-xl transition-colors",
            activeTab === 'today' ? "bg-locked-primary/10 group-hover:bg-locked-primary/20" : ""
          )}>
            <Calendar className={cn("h-6 w-6", activeTab === 'today' ? "fill-current" : "")} />
          </div>
          <span className="text-[10px] font-bold tracking-wide">Today</span>
        </button>

        {/* Backlog Tab */}
        <button 
          onClick={() => setActiveTab('backlog')}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors group",
            activeTab === 'backlog' ? "text-locked-primary" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          )}
        >
          <div className={cn(
            "relative p-1 rounded-xl transition-colors",
            activeTab === 'backlog' ? "bg-locked-primary/10 group-hover:bg-locked-primary/20" : ""
          )}>
            <Layers className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-medium tracking-wide">Backlog</span>
        </button>

       

        {/* Completed Tab */}
        <button 
          onClick={() => setActiveTab('completed')}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors group",
            activeTab === 'completed' ? "text-locked-primary" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          )}
        >
          <div className={cn(
            "relative p-1 rounded-xl transition-colors",
            activeTab === 'completed' ? "bg-locked-primary/10 group-hover:bg-locked-primary/20" : ""
          )}>
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-medium tracking-wide">Done</span>
        </button>

         {/* Settings Tab */}
        <button 
          onClick={() => setActiveTab('settings')}
          className={cn(
            "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors group",
            activeTab === 'settings' ? "text-locked-primary" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          )}
        >
          <div className={cn(
            "relative p-1 rounded-xl transition-colors",
            activeTab === 'settings' ? "bg-locked-primary/10 group-hover:bg-locked-primary/20" : ""
          )}>
            <Settings className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-medium tracking-wide">Settings</span>
        </button>
      </div>
    </nav>
  );
};
