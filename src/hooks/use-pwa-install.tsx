// hooks/use-pwa-install.ts
import { useCallback, useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[]
	readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
	prompt(): Promise<void>
}

export function usePwaInstall() {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
	const [isInstallable, setIsInstallable] = useState(false)
	const [isInstalled, setIsInstalled] = useState(false)

	useEffect(() => {
		const standalone =
			window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true
		setIsInstalled(standalone)

		const onBeforeInstall = (e: Event) => {
			e.preventDefault() // chặn mini-infobar mặc định
			setDeferredPrompt(e as BeforeInstallPromptEvent)
			setIsInstallable(true)
		}

		const onInstalled = () => {
			setIsInstalled(true)
			setIsInstallable(false)
			setDeferredPrompt(null)
		}

		window.addEventListener('beforeinstallprompt', onBeforeInstall)
		window.addEventListener('appinstalled', onInstalled)
		return () => {
			window.removeEventListener('beforeinstallprompt', onBeforeInstall)
			window.removeEventListener('appinstalled', onInstalled)
		}
	}, [])

	const promptInstall = useCallback(async () => {
		if (!deferredPrompt) return 'unavailable' as const
		await deferredPrompt.prompt()
		const { outcome } = await deferredPrompt.userChoice
		setDeferredPrompt(null)
		setIsInstallable(false)
		return outcome
	}, [deferredPrompt])

	return { isInstallable, isInstalled, promptInstall }
}
