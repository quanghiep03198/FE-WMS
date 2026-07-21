import { NestedCell, NestedColumn, NestedTable } from '@/components/shared/horizontal-nested-table'
import {
	Div,
	Icon,
	Separator,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Typography
} from '@/components/ui'

import axiosInstance from '@/configs/axios.config'
import { FALLBACK_VALUE } from '@common/constants/constants'
import { CommonActions } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import formatIntlNumber from '@common/utils/format-intl-number'
import { useMemoizedFn, useResetState, useThrottleFn, useUpdateEffect } from 'ahooks'
import { useMemo, useRef } from 'react'
import isEqual from 'react-fast-compare'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../../contexts/page-context'

type DetailTableItem = {
	factory_shoes_style: string
	color_sn: string
	sizes: Array<{ size_code: string; qty: number }>
}

const EpcDetailTable: React.FC = () => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const [data, setData, resetData] = useResetState<DetailTableItem[]>([])
	const [isFetching, setIsFetching, resetIsFetching] = useResetState<boolean>(false)
	const [scannedEpcs, setScannedEpcs, resetScannedEpcs] = useResetState<string[]>([])
	const abortControllerRef = useRef<AbortController | null>(new AbortController())

	const { run: captureDataChangeHandler, cancel: cancelCaptureDataChange } = useThrottleFn(
		(e: { action: CommonActions; payload: string[] }) => {
			if (e.action !== CommonActions.IMPORT || !Array.isArray(e.payload)) return
			if (isEqual(scannedEpcs, e.payload)) {
				cancelCaptureDataChange()
				return
			}
			// If payload is empty, reset data and abort ongoing requests, else set scanned EPCs
			if (!e.payload.length) {
				resetData()
				resetScannedEpcs()
				// Always abort ongoing fetch requests on reset scanned EPCs
				if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
					abortControllerRef.current?.abort()
					abortControllerRef.current = null
				}
				return
			}
			setScannedEpcs(e.payload)
		},
		{ wait: 100 }
	)

	const inoutboundFormSubmissionHandler = useMemoizedFn((e: { action: CommonActions; payload: [] }) => {
		if (e.action === CommonActions.SAVE) {
			resetData()
			resetScannedEpcs()
		}
	})

	event$.useSubscription(captureDataChangeHandler)
	event$.useSubscription(inoutboundFormSubmissionHandler)

	const terminateFetchRequests = () => {
		if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
			abortControllerRef.current?.abort()
			abortControllerRef.current = null
		}
		cancelCaptureDataChange()
	}

	useUpdateEffect(() => {
		if (scannedEpcs.length === 0) return terminateFetchRequests

		// Ensure AbortController is initialized, avoid race condition when aborting previous requests
		if (!abortControllerRef.current || abortControllerRef.current.signal.aborted) {
			abortControllerRef.current = new AbortController()
		}
		setIsFetching(true)
		axiosInstance
			.post<string[], ResponseBody<DetailTableItem[]>>('/defective-goods/retrieve-size-qty', scannedEpcs, {
				signal: abortControllerRef.current?.signal
			})
			.then((response) => setData(response.metadata))
			.finally(() => resetIsFetching())
		return terminateFetchRequests
	}, [scannedEpcs])

	const totalQty = useMemo(() => {
		if (!Array.isArray(data)) return 0
		return data.reduce((acc, curr) => {
			return acc + curr.sizes.reduce((sizeAcc, sizeCurr) => sizeAcc + sizeCurr.qty, 0)
		}, 0)
	}, [data])

	return (
		<Div className='grid grid-rows-[auto_var(--bar-height)] divide-y divide-border overflow-hidden'>
			<Div
				className='relative! h-[calc(var(--detail-table-panel-height)-var(--bar-height))] w-full overflow-scroll scrollbar-track-accent/50 @container/1'
				style={
					{
						'--col-width': '160px'
					} as React.CSSProperties
				}>
				<Table
					className={cn(
						'w-full table-auto [&_span]:line-clamp-1 [&_th]:bg-table-head [&_th]:text-table-head-foreground'
					)}>
					<colgroup>
						<col style={{ minWidth: 'var(--col-width)', maxWidth: 'var(--col-width)' }} />
						<col style={{ minWidth: 'var(--col-width)', maxWidth: 'var(--col-width)' }} />
						<col style={{ minWidth: 'calc(100cqw - 2 * var(--col-width))' }} />
					</colgroup>
					<TableHeader className='sticky top-0 z-20 h-[calc(var(--bar-height)+1px)] [&_th]:border-b [&_th]:bg-table-head'>
						<TableRow>
							<TableHead align='left' className='sticky left-0 z-20'>
								<span>{t('ns_erp:fields.factory_shoes_style')}</span>
							</TableHead>
							<TableHead
								align='left'
								className='sticky left-(--col-width) z-20 border-r-0 shadow-[1px_0px_0px_var(--border)]'>
								<span>{t('ns_erp:fields.color_sn')}</span>
							</TableHead>
							<TableHead align='left' className='px-0'>
								<span className='sticky left-[calc(2*var(--col-width))] z-10 block h-max max-w-[calc(100cqw-2*var(--col-width))] px-4 text-center align-middle'>
									Size
								</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{!Array.isArray(data) || data.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={4}
									align='center'
									className='z-0 h-[calc(var(--detail-table-panel-height)-2*var(--bar-height)-2*var(--scrollbar-thickness))]'>
									<Typography color='muted' className='inline-flex items-center gap-x-2'>
										<Icon name='Inbox' size={32} strokeWidth={1} />
										{t('ns_common:table.no_data')}
									</Typography>
								</TableCell>
							</TableRow>
						) : (
							data.map((item) => (
								<TableRow
									key={item.factory_shoes_style + item.color_sn}
									className={cn(
										'[&_td]:transition-opacity [&_td]:duration-200 [&_td]:ease-in-out',
										isFetching && '[&_td]:opacity-50'
									)}>
									<TableCell align='left' className='sticky left-0 z-20'>
										{item.factory_shoes_style === FALLBACK_VALUE
											? t('ns_common:titles.unknown')
											: item.factory_shoes_style}
									</TableCell>
									<TableCell
										align='left'
										className='sticky left-(--col-width) z-20 border-r-0 shadow-[1px_0px_0px_var(--border)]'>
										{item.color_sn === FALLBACK_VALUE ? t('ns_common:titles.unknown') : item.color_sn}
									</TableCell>
									<TableCell align='left' className='p-0'>
										<NestedTable>
											{item.sizes.map((size) => (
												<NestedColumn key={size.size_code} className='min-w-24 basis-24'>
													<NestedCell>
														{size.size_code === FALLBACK_VALUE
															? t('ns_common:titles.unknown')
															: size.size_code}
													</NestedCell>
													<NestedCell>{size.qty}</NestedCell>
												</NestedColumn>
											))}
										</NestedTable>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Div>
			<Div className='bg-table-header flex h-(--bar-height) basis-(--bar-height) items-center justify-between p-4 text-table-head-foreground'>
				<Typography variant='small'>{t('ns_inoutbound:description.inoutbound_table_caption')}</Typography>
				<Typography className='inline-flex items-center gap-x-1.5 font-medium text-foreground'>
					<span>{t('ns_common:common_fields.total')}</span>
					<Separator className='h-px basis-1.5 bg-foreground' />
					<span>{formatIntlNumber(totalQty)}</span>
					<small className='place-self-start self-start text-xs'>prs</small>
				</Typography>
			</Div>
		</Div>
	)
}

export default EpcDetailTable
