'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Share, PlusSquare } from 'lucide-react'

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showPrompt, setShowPrompt] = useState(true)

  useEffect(() => {
    // Simple iOS usage detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])

  if (isStandalone || !showPrompt) {
    return null 
  }

  // Only showing custom instructions for iOS since Chrome/Android handles it automatically
  if (!isIOS) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
        <div className="bg-white/95 dark:bg-[#1a1c1e]/95 backdrop-blur-md border border-gray-200 dark:border-white/10 p-4 rounded-2xl shadow-2xl relative">
            <button 
                onClick={() => setShowPrompt(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
                <X className="w-4 h-4" />
            </button>
            
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">Install App</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Add to your home screen for the full full-screen experience.
            </p>
            <div className="flex items-center gap-2 mt-3 text-xs font-medium text-locked-primary">
                <span>Tap</span>
                <Share className="w-4 h-4" />
                <span>then "Add to Home Screen"</span>
                <PlusSquare className="w-4 h-4" />
            </div>
        </div>
    </div>
  )
}
