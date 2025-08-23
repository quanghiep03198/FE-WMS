import { CommonActions } from '@/common/constants/enums'
import useScrollToFn from '@/common/hooks/use-scroll-fn'
import { useSocketIo } from '@/common/hooks/use-socket-io'
import { cn } from '@/common/utils/cn'
import { Button, Div, Icon, Separator, Typography } from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'

import formatIntlNumber from '@/common/utils/format-intl-number'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useResetState } from 'ahooks'
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../-contexts/page-context'

const VIRTUAL_ITEM_SIZE = 40
const PRERENDERED_ITEMS = 5

const ScannedEpcList: React.FC = () => {
	const [scannedEpcs, setScanendEpcs, resetScannedEpcs] = useResetState<string[]>([])
	const { data } = useSocketIo<string[], void>({ event: 'def_rfid_data', initialData: [] })
	const { t } = useTranslation()
	const { event$ } = usePageContext()

	const containerRef = useRef<HTMLDivElement>(null)
	const scrollingRef = useRef<number>(null)

	const scrollToFn = useScrollToFn(containerRef, scrollingRef)
	const estimateSize = useCallback(() => VIRTUAL_ITEM_SIZE, [])
	const getScrollElement = useCallback(() => containerRef.current, [])

	useEffect(() => {
		if (!Array.isArray(data)) return
		setScanendEpcs(data)
		event$.emit({ action: CommonActions.IMPORT, payload: data })
	}, [data])

	event$.useSubscription((e: { action: CommonActions; payload: [] }) => {
		if (e.action === CommonActions.SAVE) {
			resetScannedEpcs()
		}
	})

	// * Intitialize virtual list to render scanned EPC data
	const virtualizer = useVirtualizer({
		count: scannedEpcs.length,
		overscan: PRERENDERED_ITEMS,
		indexAttribute: 'data-index',
		getScrollElement,
		scrollToFn,
		estimateSize
	})

	return (
		<Div className='flex flex-col divide-y'>
			<Div className='flex h-14 items-center justify-between p-2'>
				<Div className='*:text- flex items-center justify-between gap-x-2 pl-2'>
					{/* <Icon name='ScanBarcode' size={20} /> */}
					<Typography className='inline-flex items-center gap-x-2 font-medium'>
						{t('ns_inoutbound:counter_box.label')}
					</Typography>
					<Separator className='h-0.5 w-1.5 self-center bg-foreground' />
					<Typography className='inline-flex gap-x-1 font-bold'>
						{formatIntlNumber(scannedEpcs.length)}
						<Typography as='small' variant='small' className='text-xs font-medium'>
							prs
						</Typography>
					</Typography>
				</Div>
				<Button variant='secondary' size='sm' onClick={() => resetScannedEpcs()}>
					<Icon name='RotateCw' /> {t('ns_common:actions.reset')}
				</Button>
			</Div>
			{Array.isArray(data) && data.length > 0 ? (
				<ScrollShadow
					ref={containerRef}
					className={cn(
						'z-10 flex w-full flex-col items-stretch justify-start divide-y divide-border bg-background p-2 will-change-transform contain-paint',
						'h-[calc(var(--outlet-wrapper-height)-56px)]'
					)}>
					<Div className='relative w-full' style={{ height: virtualizer.getTotalSize() }}>
						{virtualizer.getVirtualItems().map((virtualItem) => {
							const item = scannedEpcs[virtualItem.index]
							return (
								<Div
									key={virtualItem.index}
									data-index={virtualItem.index}
									className='absolute left-auto right-auto top-0 flex h-10 w-full justify-between whitespace-nowrap border-b px-4 py-2 uppercase transition-all duration-75 last:border-none hover:bg-secondary'
									style={{
										height: virtualItem.size,
										transform: `translateY(${virtualItem.start}px)`
									}}>
									<Typography className='font-medium'>{item}</Typography>
								</Div>
							)
						})}
					</Div>
				</ScrollShadow>
			) : (
				<Div className='z-10 grid h-[calc(var(--outlet-wrapper-height)-56px)] place-content-center'>
					<Div className='inline-flex items-center gap-x-4'>
						<Icon name='Inbox' stroke='hsl(var(--muted-foreground))' size={32} strokeWidth={1} />
						<Typography color='muted'> {t('ns_common:table.no_data')}</Typography>
					</Div>
				</Div>
			)}
		</Div>
	)
}

export default ScannedEpcList
