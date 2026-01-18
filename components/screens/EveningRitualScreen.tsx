import React from 'react';
import { ArrowLeft, Lock, Minus, ArrowUp, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useLockedStore, Task } from '@/store/useLockedStore';
import { cn } from '@/lib/utils'; // Assuming cn exists

export const EveningRitualScreen: React.FC = () => {
  const { tasks, setActiveTab, moveToTomorrow, moveToBacklog, lockTomorrow } = useLockedStore();
  
  const handleLockTomorrow = () => {
    lockTomorrow();
    toast.success("Tomorrow's list is locked!", { description: "Unfinished tasks moved to backlog." });
  };
  
  const backlogTasks = tasks.filter(t => t.isBacklog && !t.completed);
  const tomorrowTasks = tasks.filter(t => t.isTomorrow);
  
  const CAPACITY = 4;
  const filledSlots = tomorrowTasks.length;

  return (
    <div className="bg-locked-background-light dark:bg-locked-background-dark font-display text-gray-900 dark:text-white antialiased overflow-hidden h-screen flex flex-col items-center">
       {/* Mobile Container */}
       <div className="relative flex flex-col w-full max-w-md h-full bg-locked-background-light dark:bg-locked-background-dark shadow-2xl overflow-hidden border-x border-transparent dark:border-locked-surface-border pb-28">
        
        {/* Header Section */}
        <header className="sticky top-0 z-50 bg-locked-background-light/95 dark:bg-locked-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 transition-colors">
          <div className="flex items-center justify-between px-5 py-4">
            <button 
              onClick={() => setActiveTab('backlog')}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-center rounded-full p-1 -ml-2"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-gray-900 dark:text-white text-sm font-bold tracking-wide uppercase opacity-90">Evening Ritual</h1>
            <div className="flex items-center">
              <span className="text-gray-400 text-xs font-bold tracking-wider">STEP 2 OF 3</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full px-5 pb-4">
            <div className="flex gap-1.5 h-1 w-full">
              <div className="h-full w-1/3 bg-locked-primary rounded-full opacity-50"></div>
              <div className="h-full w-1/3 bg-locked-primary rounded-full shadow-[0_0_10px_rgba(55,92,92,0.8)]"></div>
              <div className="h-full w-1/3 bg-gray-200 dark:bg-[#2C3333] rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Capacity Indicator Section */}
        <section className="relative pt-8 pb-6 px-4 text-center">
          <h2 className="text-[32px] font-bold leading-tight tracking-tight text-gray-900 dark:text-white mb-1">
            <span className={cn(filledSlots > CAPACITY ? "text-rose-500" : "text-locked-primary")}>{filledSlots}</span> 
            <span className="text-gray-300 dark:text-white/30 text-2xl mx-1 font-light">/</span> 
            {CAPACITY} Slots
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium tracking-wide">Keep it achievable.</p>
          
          {/* Visual Slot Pills */}
          <div className="flex justify-center gap-3 mt-6">
             {[...Array(Math.max(CAPACITY, filledSlots))].map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-2 w-12 rounded-full transition-colors border",
                    i < filledSlots 
                      ? "bg-locked-primary border-locked-primary shadow-glow" 
                      : "bg-gray-100 border-gray-200 dark:bg-[#2C3333] dark:border-white/5"
                  )}
                />
             ))}
          </div>
        </section>

        {/* Tomorrow List (The Stage) */}
        <section className="px-5 mb-8 relative">
           {/* Subtle background stage */}
           <div className="absolute inset-0 mx-3 rounded-2xl bg-white dark:bg-locked-surface-dark border border-gray-100 dark:border-white/5 -z-10 overflow-hidden shadow-sm dark:shadow-none">
              <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{backgroundImage: 'radial-gradient(#375c5c 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-locked-background-light dark:from-locked-background-dark to-transparent opacity-80"></div>
           </div>

           <div className="pt-6 pb-2 flex justify-between items-end px-2 mb-2">
              <h3 className="text-xs font-bold tracking-[0.15em] text-locked-primary uppercase">Tomorrow</h3>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-locked-background-dark/50 px-2 py-0.5 rounded-full border border-gray-200 dark:border-white/5">LOCKED LIST</span>
           </div>

           <div className="space-y-3 min-h-[100px]">
             {tomorrowTasks.length === 0 && (
               <div className="flex items-center justify-center h-[100px] text-gray-400 text-sm italic">
                  Tap arrow up on tasks below to add them here
               </div>
             )}
             
             {tomorrowTasks.map(task => (
                <div key={task.id} className="group relative flex items-center bg-white dark:bg-[#2A2D33] border border-locked-primary/40 rounded-lg p-4 shadow-sm dark:shadow-lg active:scale-[0.99] transition-all duration-200">
                  <button 
                    onClick={() => moveToBacklog(task.id)}
                    className="flex items-center justify-center size-8 rounded-full bg-gray-100 dark:bg-locked-background-dark/50 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors mr-3"
                  >
                     <Minus className="h-4 w-4" />
                  </button>
                  <div className="flex-1">
                     <p className="text-gray-900 dark:text-white font-medium text-[15px] leading-snug">{task.text}</p>
                     <span className="text-[11px] text-locked-primary mt-0.5 block font-medium">{task.category || 'General'}</span>
                  </div>
                </div>
             ))}
           </div>
        </section>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 px-10 py-2 opacity-50">
           <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-[#334A4A] to-transparent w-full"></div>
           <ArrowUp className="text-gray-300 dark:text-[#334A4A] h-4 w-4" />
           <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-[#334A4A] to-transparent w-full"></div>
        </div>

        {/* Backlog List (Source) */}
        <section className="px-5 mt-4 flex-1 overflow-y-auto no-scrollbar">
           <div className="mb-4 px-2">
              <h3 className="text-xs font-bold tracking-[0.15em] text-gray-400 uppercase">From Backlog</h3>
           </div>
           <div className="space-y-3 pb-8">
              {backlogTasks.map(task => (
                 <button 
                   key={task.id}
                   onClick={() => moveToTomorrow(task.id)}
                   className="w-full text-left group flex items-center justify-between bg-white dark:bg-transparent border border-gray-200 dark:border-[#334A4A] rounded-lg p-4 hover:border-locked-primary/50 dark:hover:bg-white/[0.03] active:scale-[0.99] transition-all shadow-sm dark:shadow-none"
                 >
                    <div className="flex flex-col gap-1">
                       <p className="text-gray-700 dark:text-[#d1d5db] font-medium text-[15px]">{task.text}</p>
                       <span className="inline-flex items-center text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#2C3333] px-1.5 py-0.5 rounded w-fit">{task.category || 'General'}</span>
                    </div>
                    <div className="size-8 rounded-full border border-gray-200 dark:border-[#334A4A] flex items-center justify-center text-gray-300 dark:text-gray-400 opacity-60 group-hover:opacity-100 transition-opacity">
                       <ArrowUp className="h-4 w-4" />
                    </div>
                 </button>
              ))}
           </div>
        </section>

        {/* Sticky Footer CTA */}
        <div className="fixed bottom-0 left-0 w-full z-20 px-5 pb-8 pt-6 bg-gradient-to-t from-locked-background-light via-locked-background-light dark:from-[#17191c] dark:via-[#17191c] to-transparent pointer-events-none flex justify-center">
            <div className="w-full max-w-md pointer-events-auto">
               <button 
                 onClick={handleLockTomorrow}
                 className="w-full bg-locked-primary hover:bg-locked-primary/90 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-locked-primary/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
               >
                  <Lock className="h-5 w-5" />
                  Lock Tomorrow
               </button>
            </div>
        </div>

       </div>
    </div>
  );
};
