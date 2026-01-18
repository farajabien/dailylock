import React from 'react';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useLockedStore } from '@/store/useLockedStore';
import { TaskItem } from '@/components/ui-custom/TaskItem';
import { BottomNav } from '@/components/ui-custom/BottomNav';
import { QuickCaptureSheet } from '@/components/ui-custom/QuickCaptureSheet';
import { EditTaskDrawer } from '@/components/ui-custom/EditTaskDrawer';

export const LockedTodayScreen: React.FC = () => {
  const { tasks, toggleTask, setHasNote } = useLockedStore();
  const [editingTaskId, setEditingTaskId] = React.useState<string | null>(null);
  
  const todayTasks = tasks.filter(t => !t.isBacklog && !t.isTomorrow);
  
  const completedCount = todayTasks.filter(t => t.completed).length;
  const progressPercentage = todayTasks.length > 0 ? Math.round((completedCount / todayTasks.length) * 100) : 0;
  
  // Format current date
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="bg-locked-background-light dark:bg-locked-background-dark font-display text-gray-800 dark:text-locked-text-muted antialiased min-h-screen flex flex-col overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative pb-32 w-full max-w-md mx-auto border-x border-gray-200 dark:border-[#2a2d33] bg-locked-background-light dark:bg-locked-background-dark shadow-2xl">
        
        {/* Top App Bar / Header */}
        <header className="sticky top-0 z-10 bg-locked-background-light/95 dark:bg-locked-background-dark/95 backdrop-blur-sm pt-8 px-6 pb-2 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-locked-primary uppercase opacity-90">{dateString}</h2>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-locked-primary-dim border border-locked-primary/30">
              <Lock className="h-4 w-4 text-locked-primary dark:text-[#7baaaaa]" />
              <span className="text-xs font-bold text-locked-primary dark:text-white tracking-wider">LOCKED</span>
            </div>
          </div>
          
          {/* Headline */}
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-locked-text-heading tracking-tight mb-6">Today's Focus</h1>
          
          {/* Daily Progress */}
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-between items-end">
              <p className="text-xs font-medium uppercase tracking-wider opacity-60">Completion</p>
              <p className="text-xs font-bold text-locked-success-muted">{progressPercentage}%</p>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-[#2c3035] overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-locked-primary to-[#4da8a8] transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </header>
        
        <div className="h-4"></div>
        
        {/* Task List */}
        <div className="px-5 flex flex-col gap-3">
          {todayTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={toggleTask}
              onMoveToBacklog={(id) => {
                 const { moveToBacklog } = useLockedStore.getState();
                 moveToBacklog(id);
                 toast.success('Task moved to Backlog');
              }}
              onEdit={() => {
                 setEditingTaskId(task.id); 
              }}
            />
          ))}
        </div>
        
        {/* Spacer for FAB overlap */}
        <div className="h-24"></div>
      </main>

      <QuickCaptureSheet />
      <BottomNav />
      {/* Edit Drawer Integration */}
      <EditTaskDrawer 
        taskId={editingTaskId} 
        isOpen={!!editingTaskId} 
        onClose={() => setEditingTaskId(null)} 
      />
      
      {/* Overlay Gradients for Depth (Subtle) */}
      <div className="pointer-events-none fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-locked-background-light/10 dark:from-locked-background-dark/20 to-transparent z-0"></div>
      <div className="pointer-events-none fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-locked-background-light dark:from-locked-background-dark to-transparent z-10"></div>
    </div>
  );
};
