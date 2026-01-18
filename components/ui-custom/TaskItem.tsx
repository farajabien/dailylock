import React from 'react';
import { Check, Edit3, StickyNote, Archive } from 'lucide-react'; // Using Lucide icons as replacement for Material Symbols
import { cn } from '@/lib/utils';
import { Task } from '@/store/useLockedStore';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit?: (id: string) => void;
  onMoveToBacklog?: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onEdit, onMoveToBacklog }) => {
  return (
    <div 
      className={cn(
        "group relative flex items-center justify-between p-4 border rounded-xl transition-all select-none",
        task.completed 
          ? "bg-gray-50 dark:bg-[#1c1f24] border-transparent dark:border-[#2a2d33] opacity-75 hover:opacity-100" 
          : "bg-white dark:bg-locked-surface-dark border-gray-200 dark:border-locked-surface-border active:scale-[0.99] hover:border-locked-primary/50"
      )}
      onClick={() => onToggle(task.id)}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative flex items-center justify-center shrink-0">
          <input 
            type="checkbox"
            checked={task.completed}
            readOnly
            className={cn(
              "peer h-6 w-6 rounded-md border-2 cursor-pointer transition-colors focus:ring-0 focus:ring-offset-0 appearance-none",
              task.completed
                ? "bg-locked-success-muted border-locked-success-muted"
                : "border-gray-300 dark:border-locked-surface-border bg-transparent"
            )}
          />
          <Check 
            className={cn(
              "absolute text-white h-[18px] w-[18px] pointer-events-none transition-opacity",
              task.completed ? "opacity-100" : "opacity-0"
            )}
            strokeWidth={3}
          />
        </div>
        
        <label className={cn(
          "text-base font-medium truncate cursor-pointer transition-colors",
          task.completed
            ? "text-gray-500 dark:text-gray-500 line-through"
            : "text-gray-900 dark:text-gray-200 group-hover:text-locked-primary"
        )}>
          {task.text}
        </label>
      </div>

      <div className="flex items-center gap-1 shrink-0">
         {onMoveToBacklog && (
           <button
             onClick={(e) => {
               e.stopPropagation();
               onMoveToBacklog(task.id);
             }}
             className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-[#334A4A] text-gray-400 dark:text-gray-500 hover:text-locked-primary"
             title="Move to Backlog"
           >
             <Archive className="h-5 w-5" />
           </button>
         )}

        <button 
          aria-label={task.hasNote ? "View reflection" : "Add reflection"}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
            task.hasNote
              ? "bg-locked-primary/10 text-locked-primary"
              : "hover:bg-gray-100 dark:hover:bg-[#334A4A] text-gray-400 dark:text-gray-500 hover:text-locked-primary"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(task.id);
          }}
        >
          {task.hasNote ? (
            <StickyNote className="h-5 w-5 fill-current" />
          ) : (
            <Edit3 className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
};
