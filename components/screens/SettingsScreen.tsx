import React from 'react';
import { Settings as SettingsIcon, Trash2, Info, Moon, Github } from 'lucide-react';
import { toast } from 'sonner';
import { useLockedStore } from '@/store/useLockedStore';
import { BottomNav } from '@/components/ui-custom/BottomNav';
import { Button } from '@/components/ui/button';

export const SettingsScreen: React.FC = () => {
  const { tasks, addTask } = useLockedStore();
  
  // Dark Mode Logic
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  };

  // Export Data
  const handleExport = () => {
    const dataStr = JSON.stringify(localStorage.getItem('daily-lock-storage'));
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'dailylock-backup.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('Data exported successfully!');
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to reset all tasks? This cannot be undone.')) {
      localStorage.removeItem('daily-lock-storage');
      window.location.reload();
    }
  };

  return (
    <div className="bg-locked-background-light dark:bg-locked-background-dark font-display text-gray-900 dark:text-white antialiased overflow-hidden h-screen flex flex-col items-center">
      {/* Mobile Container */}
      <div className="relative flex flex-col w-full max-w-md h-full bg-locked-background-light dark:bg-locked-background-dark shadow-2xl overflow-hidden border-x border-transparent dark:border-[#2a2d33]">
        
        {/* Header Section */}
        <header className="flex-none px-6 pt-12 pb-4 z-10 bg-locked-background-light/95 dark:bg-locked-background-dark/95 backdrop-blur-md sticky top-0 transition-all border-b border-gray-100 dark:border-white/5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Settings</h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                Preferences & Data
              </p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
              <SettingsIcon className="h-5 w-5" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-5 pt-6 pb-48 space-y-8">
          
          {/* Section: Appearance */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold tracking-wider text-gray-400 uppercase ml-1">Appearance</h2>
            <div className="bg-white dark:bg-[#2A2D33] rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
               <div className="p-4 flex items-center justify-between cursor-pointer active:bg-gray-50 dark:active:bg-white/5 transition-colors" onClick={toggleDarkMode}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-locked-primary/10 text-locked-primary">
                      <Moon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tap to toggle theme</p>
                    </div>
                  </div>
                  {/* Simple Toggle UI (Visual only for now since we manual toggle class) */}
                  <div className="w-10 h-6 bg-gray-200 dark:bg-locked-primary rounded-full relative transition-colors">
                     <div className="absolute top-1 left-1 dark:left-5 w-4 h-4 bg-white rounded-full transition-all shadow-sm"></div>
                  </div>
               </div>
            </div>
          </section>

          {/* Section: Data */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold tracking-wider text-gray-400 uppercase ml-1">Data Management</h2>
            <div className="bg-white dark:bg-[#2A2D33] rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
               <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-indigo-500/10 text-indigo-500">
                      <SettingsIcon className="h-5 w-5" /> 
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Export Tasks</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Save backup to file</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleExport} className="h-8">
                    Export
                  </Button>
               </div>
               
               <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-rose-500/10 text-rose-500">
                      <Trash2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Reset Application</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Clear all tasks locally</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleClearData} className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 h-8">
                    Reset
                  </Button>
               </div>
            </div>
             <p className="text-xs text-gray-400 ml-1">
                Currently storing {tasks.length} tasks locally.
             </p>
          </section>

          {/* Section: About */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold tracking-wider text-gray-400 uppercase ml-1">About</h2>
            <div className="bg-white dark:bg-[#2A2D33] rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
               <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300">
                      <Info className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Version</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">v0.1.0 (Alpha)</p>
                    </div>
                  </div>
               </div>
               <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300">
                      <Github className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Open Source</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Built with Next.js & Shadcn</p>
                    </div>
                  </div>
               </div>
            </div>
          </section>

        </main>

      </div>
      
      <BottomNav />
    </div>
  );
};
