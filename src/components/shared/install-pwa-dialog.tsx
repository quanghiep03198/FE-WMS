// components/install-pwa-dialog.tsx
import { Button, Dialog, DialogContent } from '@components/ui'
import { usePwaInstall } from '@hooks/use-pwa-install'

import { useState } from 'react'

const FEATURES = ['Realtime RFID tracking', 'Low latency sync', 'Fast', 'Cross platform']

export function InstallPwaDialog() {
	const { isInstallable, isInstalled, promptInstall } = usePwaInstall()
	const [open, setOpen] = useState(false)

	if (!isInstallable || isInstalled) return null

	const handleInstall = async () => {
		const outcome = await promptInstall()
		if (outcome === 'accepted') setOpen(false)
	}

	return (
		<>
			<Button
				variant='link'
				className='text-muted-foreground text-sm transition-[colors,opacity] duration-500 hover:text-(--primary-alt) hover:no-underline hover:opacity-80'
				onClick={() => setOpen(true)}>
				Install
			</Button>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className='max-w-2xl overflow-hidden p-0'>
					<div className='p-8'>
						<div className='flex items-start gap-4'>
							<img src='/pwa-192x192.png' alt='logo' className='size-16' />
							<div>
								<h1 className='text-xl font-bold'>Warehouse Management System</h1>
								<p className='text-muted-foreground text-sm'>Production warehouse management system</p>
							</div>
						</div>

						<div className='mt-6 grid grid-cols-2 gap-6'>
							<div>
								<h3 className='mb-2 font-semibold'>Key Features</h3>
								<ul className='text-muted-foreground list-inside list-disc space-y-1 text-sm'>
									{FEATURES.map((f) => (
										<li key={f}>{f}</li>
									))}
								</ul>
							</div>
							<img src='/screenshot.png' className='rounded-lg border' />
						</div>

						<div className='mt-6'>
							<h3 className='mb-2 font-semibold'>Description</h3>
							<p className='text-muted-foreground text-sm'>
								Warehouse Management System (WMS) is a comprehensive software solution designed to optimize and
								streamline warehouse operations. It provides real-time tracking of inventory, efficient order
								processing, and seamless integration with RFID technology for accurate asset management. With
								low latency synchronization and cross-platform compatibility, WMS enhances productivity and
								ensures smooth workflow in warehouse environments.
							</p>
						</div>
					</div>

					<div className='bg-muted flex justify-end px-8 py-4'>
						<Button className='rounded-full' onClick={handleInstall}>
							Install pwa
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}
