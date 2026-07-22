import { Badge, buttonVariants, Div, Icon, Label, Skeleton, Typography } from '@/components/ui'
import formatIntlNumber from '@common/utils/format-intl-number'
import { Separator } from '@radix-ui/react-context-menu'
import { useInterval, useResetState, useUnmount } from 'ahooks'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../../contexts/finished-goods-inbound/page-context'

const INTERVAL_TIME = 5 as const

const ScannedEpcCounter: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div
			data-slot='epc-counter'
			className='relative flex flex-col items-center justify-center overflow-clip rounded-lg border px-4 py-10 lg:py-4 @5xl:py-8'>
			<ScanningSkeleton />
			<ScanningCounter />
			<Typography
				variant='small'
				className='xxl:text-sm relative z-10 mb-6 text-center text-xs whitespace-nowrap'
				color='muted'>
				{t('ns_inoutbound:counter_box.caption')}
			</Typography>
			<ScanningTimer />

			<Label
				htmlFor='side-toolbar-sheet-trigger'
				className={buttonVariants({
					variant: 'secondary',
					size: 'sm',
					className: 'absolute top-1 right-1 z-10 @[1366px]/page-container:hidden'
				})}>
				<Icon name='Settings2' />
				<span>{t('ns_common:navigation.settings')}</span>
			</Label>
		</Div>
	)
}

const ScanningSkeleton: React.FC = () => {
	const { scanningStatus } = usePageContext('scanningStatus')
	return (
		<Div
			data-status={scanningStatus}
			data-slot='epc-counter-skeleton'
			className='absolute inset-0 z-0 h-full rounded-[inherit] opacity-0 transition-opacity duration-500 ease-in-out data-[status=connected]:opacity-100'>
			<Skeleton className='inset-0 h-full w-full animate-[pulse_1.25s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-none' />
		</Div>
	)
}

const ScanningCounter: React.FC = () => {
	const { scannedEpc } = usePageContext('scannedEpc')
	const total = scannedEpc?.totalDocs ?? 0
	const { t } = useTranslation()
	const [count, setCount] = useState(total)
	const [interval, setInterval] = useState<number | undefined>(undefined)

	// Counter increment/decrement effect
	useInterval(() => {
		if (total > count) {
			setCount((count) => (count += Math.min(Math.ceil((total - count) / 100), total - count)))
		} else if (total < count) {
			setCount((count) => count - Math.min(Math.ceil((count - total) / 100), count - total))
		}
	}, interval)

	useEffect(() => {
		if (total !== count) setInterval(INTERVAL_TIME)
		else setInterval(undefined)
	}, [total, count])

	return (
		<Div className='relative z-10 mb-1.5 flex items-baseline justify-between gap-x-3 *:text-xl'>
			<Typography className='inline-flex items-center gap-x-2 font-medium'>
				{t('ns_inoutbound:counter_box.label')}
			</Typography>
			<Separator className='bg-foreground h-0.5 w-1.5 self-center' />
			<Typography className='inline-flex gap-x-1 font-bold'>
				{formatIntlNumber(count)}
				<Typography as='small' variant='small' className='text-xs font-medium'>
					prs
				</Typography>
			</Typography>
		</Div>
	)
}

const ScanningTimer: React.FC = () => {
	const { scanningStatus } = usePageContext('scanningStatus')
	const duration = useRef<number>(0)
	const [intervalValue, setIntervalValue, resetInterval] = useResetState(undefined)
	const [scannedTime, setScannedTime, resetScannedTime] = useResetState({
		hours: '00',
		minutes: '00',
		seconds: '00'
	})

	const clearInterval = useInterval(() => {
		duration.current++
		const hours = Math.floor((duration.current / (60 * 60)) % 24)
		const minutes = Math.floor((duration.current / 60) % 60)
		const seconds = Math.floor(duration.current % 60)

		setScannedTime({
			hours: String(hours).length > 1 ? String(hours) : `0${hours}`,
			minutes: String(minutes).length > 1 ? String(minutes) : `0${minutes}`,
			seconds: String(seconds).length > 1 ? String(seconds) : `0${seconds}`
		})
	}, intervalValue)

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') {
			duration.current = 0
			resetInterval()
			resetScannedTime()
		} else if (scanningStatus === 'connected') {
			setIntervalValue(1000)
		} else {
			resetInterval()
		}
	}, [scanningStatus])

	useUnmount(() => {
		clearInterval()
	})

	return (
		<Badge className='relative z-10 min-w-24 place-content-center text-sm'>
			{scannedTime.hours}:{scannedTime.minutes}:{scannedTime.seconds}
		</Badge>
	)
}

export default ScannedEpcCounter
