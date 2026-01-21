'use client'

import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch' 
import { Bell, BellOff, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [testMessage, setTestMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
        })
        const sub = await registration.pushManager.getSubscription()
        setSubscription(sub)
    } catch (e) {
        console.error('SW registration failed', e);
    }
  }

  async function subscribeToPush() {
    setLoading(true)
    try {
        const registration = await navigator.serviceWorker.ready
        const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
        })
        setSubscription(sub)
        const serializedSub = JSON.parse(JSON.stringify(sub))
        await subscribeUser(serializedSub)
        toast.success('Subscribed to notifications!')
    } catch(e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : String(e);
        
        if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
            toast.error('Config Error: Missing VAPID Public Key');
        } else {
            toast.error(`Subscription failed: ${errorMessage}`);
        }
    } finally {
        setLoading(false)
    }
  }

  async function unsubscribeFromPush() {
    setLoading(true)
    await subscription?.unsubscribe()
    if (subscription) {
      // Pass endpoint as ID
      await unsubscribeUser(subscription.endpoint) 
    }
    setSubscription(null)
    toast.success('Unsubscribed.')
    setLoading(false)
  }

  async function sendTest() {
    if(!testMessage) return;
    const res = await sendNotification(testMessage)
    if(res.success) {
        toast.success(`Sent! (Delivered: ${res.sent})`)
        setTestMessage('')
    } else {
        toast.error(res.error || 'Failed to send')
    }
  }

  if (!isSupported) {
    return <p className="text-sm text-gray-400">Push notifications not supported on this device.</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {subscription ? <Bell className="w-5 h-5 text-locked-primary" /> : <BellOff className="w-5 h-5 text-gray-400" />}
            <span className="text-sm font-medium dark:text-gray-200">
                {subscription ? 'Notifications Enabled' : 'Enable Notifications'}
            </span>
          </div>
          <Switch 
            checked={!!subscription}
            onCheckedChange={(checked: boolean) => checked ? subscribeToPush() : unsubscribeFromPush()}
            disabled={loading}
          />
      </div>

      {subscription && (
        <div className="flex gap-2 mt-2">
            <Input 
                placeholder="Send test alert..." 
                value={testMessage} 
                onChange={e => setTestMessage(e.target.value)}
                className="h-8 text-xs bg-gray-50 dark:bg-black/20"
            />
            <Button size="sm" variant="outline" className="h-8 w-12 p-0" onClick={sendTest}>
                <Send className="w-3 h-3" />
            </Button>
        </div>
      )}
    </div>
  )
}
