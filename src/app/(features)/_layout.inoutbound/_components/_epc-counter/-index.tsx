import { Badge, Div, Typography } from '@/components/ui'
import Skeleton from '@/components/ui/@custom/skeleton'
import { Separator } from '@radix-ui/react-context-menu'
import { useInterval, useReactive, useResetState } from 'ahooks'
import { pick } from 'lodash'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../_contexts/-page-context'

const INTERVAL_TIME = 5 as const

const ScannedEPCsCounter: React.FC = () => {
	return (
		<Div className='relative flex h-full flex-col items-center justify-center overflow-clip rounded-lg border px-4 py-10'>
			<ScanningSkeleton />
			<ScanningCounter />
			<Typography variant='small' className='relative z-10 mb-6' color='muted'>
				EPC data is streamed continuously from server.
			</Typography>
			<ScanningTimer />
		</Div>
	)
}

const ScanningSkeleton: React.FC = () => {
	const { scanningStatus } = usePageContext((state) => pick(state, 'scanningStatus'))
	return (
		<Div
			data-status={scanningStatus}
			className='absolute inset-0 z-0 h-full opacity-0 transition-opacity duration-500 ease-in-out data-[status=connected]:opacity-100'>
			<Skeleton className='inset-0 h-full w-full' />
		</Div>
	)
}

const ScanningCounter: React.FC = () => {
	const { scannedEpc } = usePageContext((state) => pick(state, 'scannedEpc'))
	const total = scannedEpc?.totalDocs ?? 0
	const { t } = useTranslation()
	const count = useReactive({ value: total, duration: undefined })

	// Counter increment/decrement effect
	useInterval(() => {
		if (total > count.value) {
			count.value += Math.min(Math.ceil((total - count.value) / 100), total - count.value)
		} else if (total < count.value) {
			count.value -= Math.min(Math.ceil((count.value - total) / 100), count.value - total)
		}
	}, count.duration)

	useEffect(() => {
		count.duration = total !== count.value ? INTERVAL_TIME : undefined
	}, [total, count.value])

	return (
		<Div className='relative z-10 mb-1.5 flex items-baseline justify-between gap-x-3'>
			<Typography variant='h6' className='inline-flex items-center gap-x-2'>
				{t('ns_inoutbound:counter_box.label')}
			</Typography>
			<Separator className='h-0.5 w-1.5 self-center bg-foreground' />
			<Typography variant='h6' className='inline-flex gap-x-1 text-xl font-bold'>
				{count.value}
				<Typography variant='small' className='text-xs font-medium'>
					pcs
				</Typography>
			</Typography>
		</Div>
	)
}

const ScanningTimer: React.FC = () => {
	const { scanningStatus } = usePageContext((state) => pick(state, 'scanningStatus'))
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

	return (
		<Badge className='relative z-10 text-sm'>
			{scannedTime.hours}:{scannedTime.minutes}:{scannedTime.seconds}
		</Badge>
	)
}

export default ScannedEPCsCounter
