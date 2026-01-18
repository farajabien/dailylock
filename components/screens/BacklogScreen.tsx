import React from 'react';
import { SortAsc, Plus, Tent, ArrowRight } from 'lucide-react'; // Using Tent as replacement for night_shelter
import { toast } from 'sonner';
import { useLockedStore, Task } from '@/store/useLockedStore';
import { BacklogItem } from '@/components/ui-custom/BacklogItem';
import { BottomNav } from '@/components/ui-custom/BottomNav';
import { EditTaskDrawer } from '@/components/ui-custom/EditTaskDrawer';

export const BacklogScreen: React.FC = () => {
  const { tasks, addTask, setActiveTab } = useLockedStore();
  const [inputValue, setInputValue] = React.useState('');
  const [editingTaskId, setEditingTaskId] = React.useState<string | null>(null);
  
  // Filter only backlog tasks and sort by recency (newest first)
  const backlogTasks = tasks
    .filter(t => t.isBacklog)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addTask(inputValue.trim(), true); // true for isBacklog
      toast.success('Task added to Backlog.');
      setInputValue('');
    }
  };

  return (
    <div className="bg-locked-background-light dark:bg-locked-background-dark font-display text-gray-900 dark:text-white antialiased overflow-hidden h-screen flex flex-col items-center">
      {/* Mobile Container */}
      <div className="relative flex flex-col w-full max-w-md h-full bg-locked-background-light dark:bg-locked-background-dark shadow-2xl overflow-hidden border-x border-transparent dark:border-[#2a2d33]">
        
        {/* Header Section */}
        <header className="flex-none px-6 pt-12 pb-4 z-10 bg-locked-background-light/90 dark:bg-locked-background-dark/95 backdrop-blur-md sticky top-0 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Backlog</h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-locked-primary/60 animate-pulse"></span>
                {backlogTasks.length} items tucked away
              </p>
            </div>
            
            <div className="flex gap-2">
              {/* Action: Plan Tomorrow */}
              <button 
                onClick={() => setActiveTab('evening-ritual')}
                className="h-10 px-3 rounded-full bg-locked-primary/10 text-locked-primary hover:bg-locked-primary/20 transition-colors flex items-center gap-2 text-sm font-bold"
              >
                Plan Tomorrow
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Input Area */}
          <div className="relative group mt-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Plus className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              className="block w-full pl-10 pr-3 py-3.5 border-none rounded-xl bg-gray-100 dark:bg-[#25282c] text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-locked-primary/50 text-base font-medium transition-shadow shadow-sm outline-none" 
              placeholder="Dump an idea here..." 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </header>

        {/* Main Content: Scrollable List */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-48 space-y-3">
          {backlogTasks.map((task) => (
            <BacklogItem 
              key={task.id} 
              task={task} 
              onEdit={(t) => setEditingTaskId(t.id)}
              onMoveToToday={(t) => {
                const { moveToToday, setActiveTab } = useLockedStore.getState();
                moveToToday(t.id);
                toast.success('Task pulled to Today focus!', { duration: 2000 });
              }}
            />
          ))}
        </main>

        {/* Footer / Instructional Panel */}
        <div className="absolute bottom-24 left-0 right-0 z-20 pointer-events-none">
          {/* Gradient Overlay */}
          <div className="h-32 bg-gradient-to-t from-locked-background-light dark:from-locked-background-dark to-transparent"></div>
          
          {/* Informational Pill */}
          <div className="absolute bottom-2 left-6 right-6 pointer-events-auto">
            <div className="bg-[#2C3333]/90 dark:bg-[#1f2626] backdrop-blur-xl border border-locked-primary/20 dark:border-locked-primary/10 rounded-2xl p-4 shadow-lg flex items-start gap-4">
              <div className="flex-shrink-0 bg-locked-primary/10 rounded-full p-2 text-locked-primary">
                <Tent className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-200 mb-0.5">Evening Lock active</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Focus on today. These tasks are safe here from your tomorrow planning.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      <BottomNav />
      
      <EditTaskDrawer 
        taskId={editingTaskId} 
        isOpen={!!editingTaskId} 
        onClose={() => setEditingTaskId(null)} 
      />
    </div>
  );
};
