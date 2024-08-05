import { IElectronicProductCode } from '@/common/types/entities'
import { Badge, Div, Typography } from '@/components/ui'
import Skeleton from '@/components/ui/@custom/skeleton'
import { Separator } from '@radix-ui/react-context-menu'
import { useInterval, useReactive, useResetState } from 'ahooks'
import { isEqual } from 'lodash'
import React, { memo, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScanningStatus, usePageContext } from '../_contexts/-page-context'

const INTERVAL_TIME = 5 as const

const ScannedEPCsCounter: React.FC = () => {
	const { scannedEPCs, scanningStatus } = usePageContext()
	const { t } = useTranslation()

	return (
		<Div className='relative flex flex-col justify-center items-center h-full gap-y-4 rounded-lg overflow-clip border p-4'>
			<Div
				data-status={scanningStatus}
				className='absolute inset-0 z-0 h-full transition-opacity ease-in-out duration-500 data-[status=scanning]:opacity-100 opacity-0'>
				<Skeleton className='h-full w-full inset-0' />
			</Div>
			<ScanningCounter scannedEPCs={scannedEPCs} />
			<ScanningTimer scanningStatus={scanningStatus} />
			<Typography variant='small' className='relative z-10' color='muted'>
				{t('ns_inoutbound:counter_box.caption', { value: 5, defaultValue: null })}
			</Typography>
		</Div>
	)
}

const ScanningCounter: React.FC<{ scannedEPCs: IElectronicProductCode[] }> = memo(
	({ scannedEPCs }) => {
		const scannedCount = scannedEPCs?.length
		const { t } = useTranslation()
		const count = useReactive({ value: scannedEPCs?.length, duration: undefined })

		// Counter increment/decrement effect
		useInterval(() => {
			if (scannedCount > count.value) {
				count.value += Math.min(10, scannedCount - count.value)
			} else if (scannedCount < count.value) {
				count.value -= Math.min(10, count.value - scannedCount)
			}
		}, count.duration)

		useEffect(() => {
			count.duration = scannedCount !== count.value ? INTERVAL_TIME : undefined
		}, [scannedCount, count.value])

		return (
			<Div className='flex items-center justify-between relative z-10 gap-x-3'>
				<Typography variant='h6' className='inline-flex items-center gap-x-2'>
					{t('ns_inoutbound:counter_box.label')}
				</Typography>
				<Separator className='w-1.5 h-0.5 bg-foreground' />
				<Typography variant='h6' className='inline-flex text-2xl gap-x-1 font-bold'>
					{count.value}
					<Typography variant='small' className='font-medium text-xs'>
						pcs
					</Typography>
				</Typography>
			</Div>
		)
	},
	(prev, next) => isEqual(prev.scannedEPCs, next.scannedEPCs)
)

const ScanningTimer: React.FC<{ scanningStatus: ScanningStatus }> = memo(
	({ scanningStatus }) => {
		const duration = useRef<number>(0)
		const [intervalValue, setIntervalValue] = useState(undefined)
		const [scannedTime, setScannedTime, resetScannedTime] = useResetState({
			hours: '00',
			minutes: '00',
			seconds: '00'
		})

		const clear = useInterval(() => {
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
				setIntervalValue(undefined)
				resetScannedTime()
			} else if (scanningStatus === 'finished') {
				clear()
			} else {
				setIntervalValue(1000)
			}
		}, [scanningStatus])

		return (
			<Badge className='relative text-sm z-10'>
				{scannedTime.hours}:{scannedTime.minutes}:{scannedTime.seconds}
			</Badge>
		)
	},
	(prev, next) => prev.scanningStatus === next.scanningStatus
)

export default ScannedEPCsCounter
