'use server'

import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:support@dailylock.app', // Placeholder email, valid format required
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

// In-memory storage for MVP/Demo purposes. 
// REAL WORLD: This resets on server restart. Ideally use a database (Postgres/Redis).
// Since this is a "local-storage first" app, real push persistence is tricky without a real backend.
// This will work for the demo session.
let subscriptions: PushSubscription[] = []

export async function subscribeUser(sub: PushSubscription) {
  // Check if exists
  const exists = subscriptions.find(s => s.endpoint === sub.endpoint)
  if (!exists) {
    subscriptions.push(sub)
  }
  return { success: true }
}

export async function unsubscribeUser(endpoint: string) {
  subscriptions = subscriptions.filter(s => s.endpoint !== endpoint)
  return { success: true }
}

export async function sendNotification(message: string) {
  if (subscriptions.length === 0) {
    // throw new Error('No subscriptions available') 
    // Return graceful error
    return { success: false, error: 'No devices subscribed.' }
  }

  let successCount = 0;
  let failureCount = 0;

  const notifications = subscriptions.map(sub => {
    return webpush.sendNotification(
      sub as any,
      JSON.stringify({
        title: 'Daily Lock',
        body: message,
        icon: '/icon-192x192.png',
      })
    )
    .then(() => { successCount++ })
    .catch((err) => {
      console.error('Error sending push:', err)
      failureCount++
       // If 410 Gone, remove subscription
       if (err.statusCode === 410) {
         subscriptions = subscriptions.filter(s => s.endpoint !== sub.endpoint)
       }
    })
  })

  await Promise.all(notifications)
  
  return { success: true, sent: successCount, failed: failureCount }
}
