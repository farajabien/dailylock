import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Category = 'Client' | 'Personal' | 'Ops' | 'Urgent';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  hasNote?: boolean;
  isBacklog?: boolean;
  isTomorrow?: boolean;
  category?: Category;
  createdAt: number;
  completedAt?: number;
}

interface LockedState {
  tasks: Task[];
  isLocked: boolean;
  activeTab: 'today' | 'backlog' | 'settings' | 'evening-ritual' | 'completed';
  
  // Actions
  addTask: (text: string, isBacklog?: boolean) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  setHasNote: (id: string, hasNote: boolean) => void;
  
  // Flow Actions
  moveToTomorrow: (id: string) => void;
  moveToBacklog: (id: string) => void;
  moveToToday: (id: string) => void; // "Pull to Focus"
  lockTomorrow: () => void; // Confirms tomorrow's list as today's new active list
  
  setLocked: (isLocked: boolean) => void;
  setActiveTab: (tab: 'today' | 'backlog' | 'settings' | 'evening-ritual' | 'completed') => void;
  clearAllTasks: () => void;
}

export const useLockedStore = create<LockedState>()(
  persist(
    (set) => ({
      tasks: [
        // Today's Tasks
        { id: '1', text: 'Draft Q4 Project Proposal', completed: false, hasNote: false, createdAt: Date.now() - 100000 },
        { id: '2', text: '30 Minute Run', completed: true, hasNote: true, createdAt: Date.now() - 90000, completedAt: Date.now() - 5000 },
        { id: '3', text: 'Review Pull Requests', completed: false, hasNote: false, createdAt: Date.now() - 80000 },
        { id: '4', text: 'Prepare Slides for All-Hands', completed: false, hasNote: false, createdAt: Date.now() - 70000 },
        { id: '5', text: 'Inbox Zero', completed: false, hasNote: false, createdAt: Date.now() - 60000 },
        
        // Backlog Tasks
        { id: '6', text: 'Draft Q3 Report for Nexus', completed: false, isBacklog: true, category: 'Client', createdAt: Date.now() - 50000 },
        { id: '7', text: 'Call Insurance Company', completed: false, isBacklog: true, category: 'Personal', createdAt: Date.now() - 40000 },
        { id: '8', text: 'Update server configs', completed: false, isBacklog: true, category: 'Ops', createdAt: Date.now() - 30000 },
        { id: '9', text: 'Buy groceries for weekend', completed: false, isBacklog: true, category: 'Personal', createdAt: Date.now() - 20000 },
        { id: '10', text: 'Renew domain name', completed: false, isBacklog: true, category: 'Urgent', createdAt: Date.now() - 10000 },
        { id: '11', text: 'Feedback on design mockups', completed: false, isBacklog: true, category: 'Client', createdAt: Date.now() - 5000 },
        { id: '12', text: 'Quarterly tax prep', completed: false, isBacklog: true, category: 'Ops', createdAt: Date.now() },
      ],
      isLocked: true,
      activeTab: 'today',

      addTask: (text, isBacklog = true) => set((state) => ({
        tasks: [
          { id: crypto.randomUUID(), text, completed: false, isBacklog, createdAt: Date.now() },
          ...state.tasks,
        ]
      })),
      
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((t) => 
          t.id === id ? { ...t, ...updates } : t
        )
      })),

      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map((t) => {
          if (t.id === id) {
            const newCompleted = !t.completed;
            return { 
              ...t, 
              completed: newCompleted,
              completedAt: newCompleted ? Date.now() : undefined
            };
          }
          return t;
        })
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id)
      })),

      setHasNote: (id, hasNote) => set((state) => ({
        tasks: state.tasks.map((t) => 
          t.id === id ? { ...t, hasNote } : t
        )
      })),

      moveToTomorrow: (id) => set((state) => ({
        tasks: state.tasks.map((t) => 
          t.id === id ? { ...t, isBacklog: false, isTomorrow: true } : t
        )
      })),

      moveToBacklog: (id) => set((state) => ({
        tasks: state.tasks.map((t) => 
          t.id === id ? { ...t, isBacklog: true, isTomorrow: false } : t
        )
      })),

      moveToToday: (id) => set((state) => ({
        tasks: state.tasks.map((t) => 
          t.id === id ? { ...t, isBacklog: false, isTomorrow: false } : t
        )
      })),

      lockTomorrow: () => set((state) => {
        // 1. Archive or clear current "Today" tasks (completed or not)
        // For this version: We keep them but maybe move unfinished to backlog?
        // User request: "one thy dont finish auto move to backlog and/or tomorrow"
        // Let's implement auto-move unfinished to backlog for now.
        
        const currentTodayTasks = state.tasks.filter(t => !t.isBacklog && !t.isTomorrow);
        const unfinished = currentTodayTasks.filter(t => !t.completed);
        
        const updatedTasks = state.tasks.map(t => {
          // If it was unfinished today, move to backlog
          if (!t.isBacklog && !t.isTomorrow && !t.completed) {
            return { ...t, isBacklog: true };
          }
           // If it was completed today, keep it? or remove it? 
           // Usually a fresh day starts clean. Let's remove completed for now or mark them archived (not implemented yet).
           // Simplest: Remove completed today tasks.
           if (!t.isBacklog && !t.isTomorrow && t.completed) {
             return null; // Will filter out nulls
           }
           
           // Activate tomorrow's tasks
           if (t.isTomorrow) {
             return { ...t, isTomorrow: false, isBacklog: false };
           }
           
           return t;
        }).filter(Boolean) as Task[]; // Remove nulls

        return {
          tasks: updatedTasks,
          activeTab: 'today',
          isLocked: true
        };
      }),

      setLocked: (isLocked) => set({ isLocked }),
      
      setActiveTab: (activeTab) => set({ activeTab }),

      clearAllTasks: () => set({ tasks: [] }),
    }),
    {
      name: 'daily-lock-storage',
    }
  )
);
