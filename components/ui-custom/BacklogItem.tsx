import React from 'react';
import { GripVertical, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task, Category } from '@/store/useLockedStore';

interface BacklogItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onMoveToToday?: (task: Task) => void;
}

const categoryColors: Record<Category, string> = {
  Client: 'bg-teal-500',
  Personal: 'bg-amber-500',
  Ops: 'bg-purple-500',
  Urgent: 'bg-rose-500',
};

const categoryTextColors: Record<Category, string> = {
  Client: 'text-teal-600 dark:text-teal-400',
  Personal: 'text-amber-600 dark:text-amber-400',
  Ops: 'text-purple-600 dark:text-purple-400',
  Urgent: 'text-rose-600 dark:text-rose-400',
};

export const BacklogItem: React.FC<BacklogItemProps> = ({ task, onEdit, onMoveToToday }) => {
  const category = task.category || 'Personal'; // Default fallback
  const stripColor = categoryColors[category];
  const textColor = categoryTextColors[category];

  return (
    <div 
      onClick={() => onEdit?.(task)}
      className="group relative bg-white dark:bg-locked-surface-dark rounded-xl p-4 border border-gray-100 dark:border-locked-surface-border shadow-sm hover:border-locked-primary/30 transition-all duration-200 active:scale-[0.99] flex items-center justify-between gap-3 cursor-pointer"
    >
      {/* Tag Indicator Line */}
      <div className={cn("absolute left-0 top-3 bottom-3 w-1 rounded-r-md opacity-80", stripColor)}></div>
      
      <div className="flex-1 pl-3 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn("text-[10px] uppercase tracking-wider font-bold opacity-90", textColor)}>
            {category}
          </span>
        </div>
        <p className="text-base font-medium text-gray-800 dark:text-gray-200 truncate leading-snug">
          {task.text}
        </p>
      </div>
      
      <div className="flex items-center gap-1">
        {onMoveToToday && (
          <button 
           onClick={(e) => {
             e.stopPropagation();
             onMoveToToday(task);
           }}
           className="p-2 -mr-1 text-gray-300 dark:text-gray-600 hover:text-locked-primary transition-colors hover:bg-locked-primary/5 rounded-full"
           title="Move to Focus (Today)"
          >
            <Zap className="h-5 w-5" />
          </button>
        )}
        <div className="flex-none text-gray-300 dark:text-gray-600 cursor-grab active:cursor-grabbing hover:text-locked-primary transition-colors">
          <GripVertical className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};
