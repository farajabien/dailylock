import React from 'react';
import { CheckCircle2, History } from 'lucide-react';
import { useLockedStore } from '@/store/useLockedStore';
import { BottomNavigation } from '@/components/ui-custom/BottomNavigation';
import { cn } from '@/lib/utils';

export const CompletedScreen: React.FC = () => {
  const { tasks } = useLockedStore();
  
  // Filter completions and sort by completedAt desc
  const completedTasks = tasks
    .filter(t => t.completed)
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-locked-background-light dark:bg-locked-background-dark font-display text-gray-900 dark:text-white antialiased overflow-hidden h-screen flex flex-col items-center">
      {/* Mobile Container */}
      <div className="relative flex flex-col w-full max-w-md h-full bg-locked-background-light dark:bg-locked-background-dark shadow-2xl overflow-hidden border-x border-transparent dark:border-[#2a2d33]">
        
        {/* Header Section */}
        <header className="flex-none px-6 pt-12 pb-4 z-10 bg-locked-background-light/90 dark:bg-locked-background-dark/95 backdrop-blur-md sticky top-0 transition-all">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Completed</h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-locked-success-muted" />
                {completedTasks.length} tasks finished
              </p>
            </div>
          </div>
        </header>

        {/* Main Content: Scrollable List */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-32 space-y-3">
          {completedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center opacity-40">
              <History className="h-12 w-12 mb-4" />
              <p className="font-medium">No completed tasks yet.</p>
            </div>
          ) : (
            completedTasks.map((task) => (
              <div 
                key={task.id}
                className="group relative p-4 rounded-2xl bg-white dark:bg-[#1a1c1e] border border-gray-100 dark:border-[#2a2d33] transition-all hover:border-locked-primary/20"
              >
                <div className="flex items-start gap-3 opacity-60">
                   <div className="flex-shrink-0 mt-0.5">
                     <CheckCircle2 className="h-5 w-5 text-locked-success-muted" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="text-base font-medium line-through text-gray-500 dark:text-gray-400 truncate group-hover:whitespace-normal group-hover:break-words">
                       {task.text}
                     </p>
                     <p className="text-xs text-gray-400 mt-1">
                       Completed {formatDate(task.completedAt)}
                     </p>
                   </div>
                </div>
              </div>
            ))
          )}
        </main>
        
        {/* Content Fade */}
        <div className="absolute bottom-20 left-0 right-0 h-24 bg-gradient-to-t from-locked-background-light dark:from-locked-background-dark to-transparent pointer-events-none"></div>

      </div>
      <BottomNavigation />
    </div>
  );
};
