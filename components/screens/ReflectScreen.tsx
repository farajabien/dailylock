'use client';

import React, { useState } from 'react';
import { BookOpen, Calendar, ChevronRight, Lock, Plus, X } from 'lucide-react';
import { useLockedStore, MonthlyEntry } from '@/store/useLockedStore';
import { BottomNav } from '@/components/ui-custom/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";

// Helper to get current month string
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

// Helper to format month for display
const formatMonth = (monthStr: string) => {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

// Helper to check if it's the last week of the month
const checkIsLastWeek = () => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysRemaining = lastDay.getDate() - now.getDate();
  return daysRemaining <= 7;
};

export const ReflectScreen: React.FC = () => {
  const { monthlyEntries, createOrUpdateMonthlyEntry, addWeeklyNote, lockMonthlyEntry, baseIncome, baseDebt } = useLockedStore();
  const currentMonth = getCurrentMonth();
  const currentEntry = monthlyEntries.find(e => e.month === currentMonth);
  const isLastWeek = checkIsLastWeek();
  
  const [selectedEntry, setSelectedEntry] = useState<MonthlyEntry | null>(null);
  
  // Form state
  // ... (keep state initializers)
  const [income, setIncome] = useState(currentEntry?.income?.toString() || baseIncome?.toString() || '');
  const [incomeNote, setIncomeNote] = useState(currentEntry?.incomeNote || '');
  const [debt, setDebt] = useState(currentEntry?.debt?.toString() || baseDebt?.toString() || '');
  const [letGoOf, setLetGoOf] = useState<string[]>(currentEntry?.letGoOf || []);
  const [moveToward, setMoveToward] = useState<string[]>(currentEntry?.moveToward || []);
  const [oneLiner, setOneLiner] = useState(currentEntry?.oneLiner || '');
  const [weeklyNote, setWeeklyNote] = useState('');
  const [newLetGo, setNewLetGo] = useState('');
  const [newMoveToward, setNewMoveToward] = useState('');

  const isLocked = !!currentEntry?.lockedAt;

  // ... (keep handlers)
  const handleSave = () => {
    createOrUpdateMonthlyEntry(currentMonth, {
      income: income ? parseFloat(income) : undefined,
      incomeNote,
      debt: debt ? parseFloat(debt) : undefined,
      letGoOf,
      moveToward,
      oneLiner,
    });
    toast.success('Monthly snapshot saved');
  };

  const handleAddWeeklyNote = () => {
    if (!weeklyNote.trim()) return;
    addWeeklyNote(currentMonth, weeklyNote);
    setWeeklyNote('');
    toast.success('Weekly note added');
  };

  const handleLock = () => {
    if (confirm('Lock this month\'s entry? It will become read-only.')) {
      handleSave();
      lockMonthlyEntry(currentMonth);
      toast.success('Entry locked');
    }
  };

  const addToList = (list: string[], setList: (l: string[]) => void, item: string, setItem: (s: string) => void) => {
    if (!item.trim()) return;
    setList([...list, item.trim()]);
    setItem('');
  };

  const removeFromList = (list: string[], setList: (l: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-locked-background-light dark:bg-locked-background-dark font-display text-gray-900 dark:text-white antialiased overflow-hidden h-screen flex flex-col items-center">
      <div className="relative flex flex-col w-full max-w-md h-full bg-locked-background-light dark:bg-locked-background-dark shadow-2xl overflow-hidden border-x border-transparent dark:border-[#2a2d33]">
        
        {/* Header */}
        <header className="flex-none px-6 pt-12 pb-4 z-10 bg-locked-background-light/95 dark:bg-locked-background-dark/95 backdrop-blur-md sticky top-0 transition-all border-b border-gray-100 dark:border-white/5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Reflect</h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatMonth(currentMonth)}
                {isLocked && <Lock className="h-3 w-3 text-locked-primary" />}
              </p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-locked-primary/10 text-locked-primary">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-5 pt-6 pb-48">
          <Tabs defaultValue="this-month" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-[#1a1c1e] p-1 h-12 rounded-xl">
              <TabsTrigger value="this-month" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#2C3333] data-[state=active]:text-locked-primary font-medium text-xs">This Month</TabsTrigger>
              <TabsTrigger value="timeline" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#2C3333] data-[state=active]:text-locked-primary font-medium text-xs">Timeline</TabsTrigger>
            </TabsList>

            {/* This Month Tab */}
            <TabsContent value="this-month" className="space-y-6 focus-visible:outline-none">
              
              {/* Weekly Notes Section - Always Visible */}
              <section className="space-y-3">
                <h2 className="text-xs font-bold tracking-wider text-gray-400 uppercase ml-1">Weekly Notes</h2>
                <div className="bg-white dark:bg-[#2A2D33] rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden p-4 space-y-3">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="What's on your mind this week?"
                      value={weeklyNote}
                      onChange={(e) => setWeeklyNote(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddWeeklyNote()}
                      className="flex-1 h-10 text-sm"
                      disabled={isLocked}
                    />
                    <Button size="sm" onClick={handleAddWeeklyNote} disabled={isLocked} className="h-10 w-10 p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {currentEntry?.weeklyNotes && currentEntry.weeklyNotes.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-white/5">
                      {currentEntry.weeklyNotes.map((note) => (
                        <div key={note.id} className="text-sm text-gray-600 dark:text-gray-300 flex gap-2">
                          <span className="text-xs text-gray-400 shrink-0">W{note.weekNumber}</span>
                          <span>{note.note}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Monthly Snapshot Sections - Conditional */}
              {isLastWeek ? (
                <>
                  <div className="flex items-center gap-4 py-2">
                    <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
                    <span className="text-xs font-medium text-locked-primary uppercase tracking-wider">Monthly Snapshot Open</span>
                    <div className="h-px bg-gray-200 dark:bg-white/10 flex-1"></div>
                  </div>

                  {/* Financial State */}
                  <section className="space-y-3">
                    <h2 className="text-xs font-bold tracking-wider text-gray-400 uppercase ml-1">Financial State</h2>
                    <div className="bg-white dark:bg-[#2A2D33] rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden p-4 space-y-4">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Income (Monthly)</label>
                        <div className="flex gap-2">
                          <Input 
                            type="number"
                            placeholder="0"
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                            className="flex-1 h-10"
                            disabled={isLocked}
                          />
                          <Input 
                            placeholder="Note (optional)"
                            value={incomeNote}
                            onChange={(e) => setIncomeNote(e.target.value)}
                            className="flex-1 h-10"
                            disabled={isLocked}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Total Debt</label>
                        <Input 
                          type="number"
                          placeholder="0"
                          value={debt}
                          onChange={(e) => setDebt(e.target.value)}
                          className="h-10"
                          disabled={isLocked}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Let Go Of */}
                  <section className="space-y-3">
                    <h2 className="text-xs font-bold tracking-wider text-gray-400 uppercase ml-1">Let Go Of</h2>
                    <div className="bg-white dark:bg-[#2A2D33] rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden p-4 space-y-3">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add something to release..."
                          value={newLetGo}
                          onChange={(e) => setNewLetGo(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addToList(letGoOf, setLetGoOf, newLetGo, setNewLetGo)}
                          className="flex-1 h-10 text-sm"
                          disabled={isLocked}
                        />
                        <Button size="sm" variant="outline" onClick={() => addToList(letGoOf, setLetGoOf, newLetGo, setNewLetGo)} disabled={isLocked} className="h-10 w-10 p-0">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {letGoOf.map((item, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full text-xs">
                            {item}
                            {!isLocked && <X className="h-3 w-3 cursor-pointer hover:text-rose-800" onClick={() => removeFromList(letGoOf, setLetGoOf, i)} />}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Move Toward */}
                  <section className="space-y-3">
                    <h2 className="text-xs font-bold tracking-wider text-gray-400 uppercase ml-1">Move Toward</h2>
                    <div className="bg-white dark:bg-[#2A2D33] rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden p-4 space-y-3">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add a direction..."
                          value={newMoveToward}
                          onChange={(e) => setNewMoveToward(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addToList(moveToward, setMoveToward, newMoveToward, setNewMoveToward)}
                          className="flex-1 h-10 text-sm"
                          disabled={isLocked}
                        />
                        <Button size="sm" variant="outline" onClick={() => addToList(moveToward, setMoveToward, newMoveToward, setNewMoveToward)} disabled={isLocked} className="h-10 w-10 p-0">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {moveToward.map((item, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs">
                            {item}
                            {!isLocked && <X className="h-3 w-3 cursor-pointer hover:text-emerald-800" onClick={() => removeFromList(moveToward, setMoveToward, i)} />}
                          </span>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* One-Liner */}
                  <section className="space-y-3">
                    <h2 className="text-xs font-bold tracking-wider text-gray-400 uppercase ml-1">Emotional Fingerprint</h2>
                    <div className="bg-white dark:bg-[#2A2D33] rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Right now, life feels like...</p>
                      <Input 
                        placeholder="a calm before the storm"
                        value={oneLiner}
                        onChange={(e) => setOneLiner(e.target.value)}
                        className="h-12 text-base"
                        disabled={isLocked}
                      />
                    </div>
                  </section>

                  {/* Actions */}
                  {!isLocked && (
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleSave} className="flex-1 h-12 bg-locked-primary hover:bg-locked-primary/90">
                        Save Snapshot
                      </Button>
                      <Button onClick={handleLock} variant="outline" className="h-12 px-4">
                        <Lock className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-8 text-center">
                   <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 mb-4">
                      <Lock className="h-5 w-5 text-gray-400" />
                   </div>
                   <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Monthly Snapshot Locked</h3>
                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[200px] mx-auto">
                     The monthly reflection will open during the last week of the month. Focus on the weekly notes for now.
                   </p>
                </div>
              )}
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="space-y-4 focus-visible:outline-none">
              {monthlyEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center opacity-40">
                  <BookOpen className="h-12 w-12 mb-4" />
                  <p className="font-medium">No entries yet.</p>
                  <p className="text-sm">Start recording your monthly snapshots.</p>
                </div>
              ) : (
                monthlyEntries.map((entry) => (
                  <div 
                    key={entry.id}
                    className="bg-white dark:bg-[#2A2D33] rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden p-4 hover:border-locked-primary/20 transition-all cursor-pointer"
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          {formatMonth(entry.month)}
                          {entry.lockedAt && <Lock className="h-3 w-3 text-locked-primary" />}
                        </h3>
                        {entry.oneLiner && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">"{entry.oneLiner}"</p>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                      {entry.income && <span>Income: ${entry.income.toLocaleString()}</span>}
                      {entry.debt !== undefined && <span>Debt: ${entry.debt.toLocaleString()}</span>}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </main>

        <Drawer open={!!selectedEntry} onOpenChange={(open) => !open && setSelectedEntry(null)}>
          <DrawerContent className="h-[90vh]">
            <div className="mx-auto w-full max-w-md h-full flex flex-col">
              <DrawerHeader>
                <DrawerTitle>{selectedEntry && formatMonth(selectedEntry.month)}</DrawerTitle>
                <DrawerDescription>Monthly Reflection</DrawerDescription>
              </DrawerHeader>
              
              <div className="flex-1 overflow-y-auto px-4 pb-12 space-y-6">
                {/* One Liner */}
                {selectedEntry?.oneLiner && (
                  <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl italic text-gray-700 dark:text-gray-200 text-lg text-center border border-gray-200 dark:border-white/10">
                    "{selectedEntry.oneLiner}"
                  </div>
                )}

                {/* Financials */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-[#2A2D33] rounded-xl border border-gray-100 dark:border-white/5">
                        <p className="text-xs text-gray-500 uppercase">Income</p>
                        <p className="text-xl font-bold dark:text-white">
                          ${selectedEntry?.income?.toLocaleString() || '0'}
                        </p>
                        {selectedEntry?.incomeNote && (
                          <p className="text-xs text-gray-400 mt-1">{selectedEntry.incomeNote}</p>
                        )}
                    </div>
                    <div className="p-4 bg-white dark:bg-[#2A2D33] rounded-xl border border-gray-100 dark:border-white/5">
                        <p className="text-xs text-gray-500 uppercase">Debt</p>
                        <p className="text-xl font-bold dark:text-white">
                          ${selectedEntry?.debt?.toLocaleString() || '0'}
                        </p>
                    </div>
                </div>

                {/* Lists */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-rose-500">Let Go Of</h3>
                    <ul className="space-y-1">
                      {selectedEntry?.letGoOf.length === 0 && <li className="text-sm text-gray-400 italic">Nothing recorded</li>}
                      {selectedEntry?.letGoOf.map((item, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-300">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-emerald-500">Move Toward</h3>
                    <ul className="space-y-1">
                      {selectedEntry?.moveToward.length === 0 && <li className="text-sm text-gray-400 italic">Nothing recorded</li>}
                      {selectedEntry?.moveToward.map((item, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-300">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Weekly Notes */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase text-gray-500">Weekly Notes</h3>
                  <div className="space-y-2">
                    {selectedEntry?.weeklyNotes.length === 0 && <p className="text-sm text-gray-400 italic">No weekly notes this month.</p>}
                    {selectedEntry?.weeklyNotes.map((note) => (
                      <div key={note.id} className="p-3 bg-white dark:bg-[#2A2D33] rounded-lg border border-gray-100 dark:border-white/5 text-sm">
                        <span className="text-xs font-bold text-locked-primary block mb-1">Week {note.weekNumber}</span>
                        <span className="dark:text-gray-200">{note.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DrawerFooter className="pt-2">
                <Button variant="outline" onClick={() => setSelectedEntry(null)}>Close</Button>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Content Fade */}
        <div className="absolute bottom-20 left-0 right-0 h-24 bg-gradient-to-t from-locked-background-light dark:from-locked-background-dark to-transparent pointer-events-none"></div>
      </div>
      <BottomNav />
    </div>
  );
};
