/// <reference types="vite-plugin-pwa/react" />
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from './ui/button'
import { Card } from './ui/card'

export function PWABadge() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error: Error | any) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setNeedRefresh(false)
  }

  if (!needRefresh) return null

  return (
    <Card className="fixed bottom-4 right-4 z-50 p-4 shadow-lg border bg-card text-card-foreground">
      <div className="flex flex-col gap-3">
        <div className="text-sm">
          <span>New content available, click on reload button to update.</span>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={close}>
            Close
          </Button>
          <Button onClick={() => updateServiceWorker(true)}>
            Reload
          </Button>
        </div>
      </div>
    </Card>
  )
}
