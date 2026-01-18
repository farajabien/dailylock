import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useLockedStore } from '@/store/useLockedStore';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const QuickCaptureSheet: React.FC = () => {
  const [text, setText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const addTask = useLockedStore((state) => state.addTask);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;
    
    // Default to backlog (isBacklog = true by default in store now)
    addTask(text);
    toast.success('Task added to Backlog');
    setText('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-24 right-6 z-30 max-w-md mx-auto w-full pointer-events-none flex justify-end pr-6 lg:pr-[calc(50vw-224px+24px)]">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <button className="pointer-events-auto flex items-center justify-center gap-2 h-14 pl-4 pr-5 rounded-2xl bg-locked-primary text-white shadow-[0_0_20px_-5px_rgba(55,92,92,0.5)] hover:bg-[#2d4d4d] active:scale-95 transition-all duration-300 group">
            <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-bold text-sm tracking-wide">Quick Capture</span>
          </button>
        </DrawerTrigger>
        <DrawerContent className="bg-white dark:bg-locked-background-dark border-t border-gray-200 dark:border-[#2a2d33]">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="text-gray-900 dark:text-locked-text-heading">New Task</DrawerTitle>
              <DrawerDescription className="text-gray-500 dark:text-locked-text-muted">
                What do you want to achieve today?
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  autoFocus
                  placeholder="e.g., Draft Q4 report..." 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="bg-gray-50 dark:bg-[#1c1f24] border-gray-200 dark:border-locked-surface-border text-lg"
                />
              </form>
            </div>
            <DrawerFooter>
              <Button onClick={() => handleSubmit()} className="bg-locked-primary hover:bg-[#2d4d4d] text-white">Add Task</Button>
              <DrawerClose asChild>
                <Button variant="outline" className="dark:border-locked-surface-border dark:text-locked-text-muted">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
