import formatIntlNumber from '@/common/utils/format-intl-number'
import { Badge, Div, Separator, Typography } from '@/components/ui'
import Skeleton from '@/components/ui/@custom/skeleton'
import { useInterval, useResetState } from 'ahooks'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../_contexts/-page-context'

const INTERVAL_TIME = 5 as const

const ScannedEpcCounter: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='relative flex h-full basis-auto flex-col items-center justify-center overflow-clip rounded-lg border p-4 sm:sticky xl:basis-1/3'>
			<ScanningSkeleton />
			<ScanningCounter />
			<Typography
				variant='small'
				className='relative z-10 mb-6 whitespace-nowrap text-center sm:hidden'
				color='muted'>
				{t('ns_inoutbound:counter_box.caption')}
			</Typography>
			<ScanningTimer />
		</Div>
	)
}

const ScanningSkeleton: React.FC = () => {
	const { scanningState } = usePageContext('scanningState')
	return (
		<Div
			data-status={scanningState}
			className='absolute inset-0 z-0 h-full opacity-0 transition-opacity duration-500 ease-in-out data-[status=success]:opacity-100'>
			<Skeleton className='inset-0 h-full w-full' />
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
		<Div className='relative z-10 mb-2 flex items-center justify-center gap-x-3 sm:mb-4'>
			<Typography variant='h6' className='inline-flex items-center gap-x-2 text-xl @3xl:text-2xl'>
				{t('ns_inoutbound:counter_box.label')}
			</Typography>
			<Separator className='h-0.5 w-1.5 bg-foreground' />
			<Typography variant='h4' className='inline-flex gap-x-1 self-baseline text-xl tracking-wide @3xl:text-2xl'>
				{formatIntlNumber(count)}
				<Typography as='small' variant='small' className='text-xs font-medium'>
					pcs
				</Typography>
			</Typography>
		</Div>
	)
}

const ScanningTimer: React.FC = () => {
	const { scanningState } = usePageContext('scanningState')
	const duration = useRef<number>(0)
	const [intervalValue, setIntervalValue, resetInterval] = useResetState(undefined)
	const [scannedTime, setScannedTime, resetScannedTime] = useResetState({
		hours: '00',
		minutes: '00',
		seconds: '00'
	})

	useInterval(() => {
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
		if (scanningState === 'pending') {
			duration.current = 0
			resetInterval()
			resetScannedTime()
		} else if (scanningState === 'success') {
			setIntervalValue(1000)
		} else {
			resetInterval()
		}
	}, [scanningState])

	return (
		<Badge className='relative z-10 text-sm'>
			{scannedTime.hours}:{scannedTime.minutes}:{scannedTime.seconds}
		</Badge>
	)
}

export default ScannedEpcCounter
