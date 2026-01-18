import React, { useEffect } from 'react';
import { useLockedStore } from '@/store/useLockedStore';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface EditTaskDrawerProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditTaskDrawer: React.FC<EditTaskDrawerProps> = ({ taskId, isOpen, onClose }) => {
  const { tasks, updateTask, deleteTask } = useLockedStore();
  const task = tasks.find(t => t.id === taskId);
  const [text, setText] = React.useState('');

  useEffect(() => {
    if (task) {
      setText(task.text);
    }
  }, [task]);

  const handleSave = () => {
    if (taskId && text.trim()) {
      updateTask(taskId, { text: text.trim() });
      toast.success('Task updated successfully.');
    }
    onClose();
  };

  const handleDelete = () => {
    if (taskId) {
      deleteTask(taskId);
      toast.success('Task deleted.', { description: 'It has been removed from your list.' });
      onClose();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-white dark:bg-[#1a1c1e] border-t border-gray-200 dark:border-[#2a2d33]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-center text-lg font-bold">Edit Task</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <Input 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="Task name" 
              className="bg-gray-100 dark:bg-[#25282c] border-none text-lg h-12"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </div>
          <DrawerFooter className="pt-6 pb-8 gap-3">
             <div className="flex gap-3">
               <Button onClick={handleDelete} variant="destructive" className="flex-1 h-12 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 hover:text-rose-600 shadow-none border border-rose-500/10">
                 <Trash2 className="h-5 w-5 mr-2" />
                 Delete
               </Button>
               <Button onClick={handleSave} className="flex-[2] h-12 text-lg font-bold bg-locked-primary hover:bg-locked-primary/90 text-white rounded-xl">
                 Save
               </Button>
             </div>
             <DrawerClose asChild>
               <Button variant="ghost" className="w-full h-10">Cancel</Button>
             </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
