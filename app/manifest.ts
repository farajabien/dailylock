import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Daily Lock',
    short_name: 'DailyLock',
    description: 'Focus on what matters today.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a1c1e', // Hex matching the dark theme background
    theme_color: '#375c5c', // Locked primary teal
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
