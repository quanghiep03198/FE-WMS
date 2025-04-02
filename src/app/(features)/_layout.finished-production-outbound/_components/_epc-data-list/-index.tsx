import { type RFIDStreamEventData } from '@/app/(features)/_types/rfid'
import { PresetBreakPoints, RequestHeaders, RequestMethod } from '@/common/constants/enums'
import { FatalError, RetriableError } from '@/common/errors'
import useAuth from '@/common/hooks/use-auth'
import useEffectOnce from '@/common/hooks/use-effect-once'
import useMediaQuery from '@/common/hooks/use-media-query'
import useScrollToFn from '@/common/hooks/use-scroll-fn'
import { IElectronicProductCode } from '@/common/types/entities'
import env from '@/common/utils/env'
import { Json } from '@/common/utils/json'
import { Button, Div, Icon, Typography } from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { AuthService } from '@/services/auth.service'
import { EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useAsyncEffect, useDeepCompareEffect, useEventListener, usePrevious, useUpdateEffect } from 'ahooks'
import { HttpStatusCode } from 'axios'
import { isEqualWith, uniqBy } from 'lodash'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGetOutboundEpcQuery } from '../../_apis/outbound-rfid.api'
import { DEFAULT_PROPS, usePageContext } from '../../_contexts/-page-context'
import OrderSizeTableDialog from '../_manufacture-order-detail/-order-size-dialog'

const VIRTUAL_ITEM_SIZE = 40
const PRERENDERED_ITEMS = 0
const DEFAULT_NEXT_CURSOR = 2
const SSE_TOAST_ID = 'FETCH_SSE'

const ScannedEpcList: React.FC = () => {
	const { t } = useTranslation()
	const abortControllerRef = useRef<AbortController | null>(null)
	const { user, token, setAccessToken } = useAuth()
	const isExtraLargeScreen = useMediaQuery(PresetBreakPoints.ULTIMATE_LARGE)
	// * Incomming EPCs data from server-sent event
	const { scannedEpc, currentPage, setScanningState, setScannedEpc, setCurrentPage, setScannedOrders } =
		usePageContext(
			'scanningState',
			'scannedEpc',
			'currentPage',
			'setScanningState',
			'setScannedEpc',
			'setCurrentPage',
			'setScannedOrders'
		)
	const [incommingEpc, setIncommingEpc] = useState<Pagination<IElectronicProductCode>>(scannedEpc)
	const previousEpc = usePrevious(incommingEpc)
	const { data: retrievedEpcData, refetch: manualFetchEpc, isFetching } = useGetOutboundEpcQuery()

	// * Virtual list refs
	const containerRef = useRef<HTMLDivElement>(null)
	const scrollingRef = useRef<number>(null)

	// * Triggered when incomming message comes
	useDeepCompareEffect(() => {
		if (isEqualWith(previousEpc, incommingEpc)) {
			const previousData = scannedEpc?.data ?? []
			const newData = incommingEpc?.data ?? []
			setScannedEpc({
				...scannedEpc,
				...incommingEpc,
				data: uniqBy([...previousData, ...newData], 'epc')
			})
		} else {
			setScannedEpc(incommingEpc)
		}
	}, [incommingEpc, previousEpc])

	// * On current page changes with value greater than default (1 or null)
	useAsyncEffect(async () => {
		if (currentPage === DEFAULT_PROPS.currentPage || currentPage === null) return
		try {
			const { data: metadata } = await manualFetchEpc()
			const previousPageData = scannedEpc?.data ?? []
			const nextPageData = metadata?.data ?? []
			setScannedEpc({
				...metadata,
				data: uniqBy([...previousPageData, ...nextPageData], 'epc')
			})
		} catch {
			throw new RetriableError()
		}
	}, [currentPage])

	useUpdateEffect(() => {
		if (retrievedEpcData)
			setScannedEpc({ ...retrievedEpcData, data: uniqBy([...scannedEpc.data, ...retrievedEpcData.data], 'epc') })
	}, [retrievedEpcData])

	// * Fetch server-sent event
	const fetchServerEvent = async () => {
		setScanningState('pending')
		abortControllerRef.current = new AbortController()
		toast.loading(t('ns_common:notification.establish_connection'), { id: SSE_TOAST_ID })
		try {
			await fetchEventSource(env('VITE_API_BASE_URL') + '/rfid/outbound/sse', {
				method: RequestMethod.GET,
				headers: {
					[RequestHeaders.AUTHORIZATION]: `Bearer ${token}`,
					[RequestHeaders.USER_COMPANY]: user.company_code
				},
				signal: abortControllerRef.current.signal,
				openWhenHidden: true,
				async onopen(response) {
					if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
						setScanningState('success')
						toast.success(t('ns_common:status.connected'), { id: SSE_TOAST_ID })
						return
					} else if (response.status === HttpStatusCode.Unauthorized) {
						abortControllerRef.current.abort()
						const response = await AuthService.refreshToken(user.id)
						const refreshToken = response.metadata
						if (!refreshToken) throw new FatalError('Failed to refresh token')
						// * If refresh token is success, set new access token and retry to trigger fetch server-sent event with the new one
						setAccessToken(refreshToken)
					} else if (
						response.status >= HttpStatusCode.BadRequest &&
						response.status < HttpStatusCode.InternalServerError &&
						response.status !== HttpStatusCode.Unauthorized &&
						response.status !== HttpStatusCode.TooManyRequests
					) {
						throw new FatalError() // client-side errors are usually non-retriable:
					} else {
						throw new RetriableError()
					}
				},
				onmessage(event: EventSourceMessage) {
					try {
						if (!event.data || !Json.isValid(event.data)) return
						const data = JSON.parse(event.data) as RFIDStreamEventData

						setIncommingEpc(data?.epcs)
						setScannedOrders(data?.orders)
					} catch (error) {
						throw new FatalError(error)
					}
				},
				onclose() {
					throw new RetriableError()
				},
				onerror(error) {
					setScanningState('error')
					toast.error(t('ns_common:notification.error'), { id: SSE_TOAST_ID })
					// * Depend on error type, retry or not
					if (error instanceof FatalError) throw error
					else throw new RetriableError()
				}
			})
		} catch (e) {
			toast('Failed to connect', { id: SSE_TOAST_ID, description: e.message })
		} finally {
			toast.info(t('ns_common:status.disconnected'), { id: SSE_TOAST_ID })
		}
	}

	useEffectOnce(() => {
		if (abortControllerRef.current) abortControllerRef.current.abort()
		fetchServerEvent()
	})

	useEventListener('refetchSSE', () => {
		if (abortControllerRef.current) abortControllerRef.current.abort()
		fetchServerEvent()
	})

	const scrollToFn = useScrollToFn(containerRef, scrollingRef)

	// * Intitialize virtual list to render scanned EPC data
	const virtualizer = useVirtualizer({
		count: scannedEpc.data.length,
		getScrollElement: () => containerRef.current,
		scrollToFn,
		estimateSize: useCallback(() => VIRTUAL_ITEM_SIZE, []),
		measureElement:
			typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
				? (element) => element?.getBoundingClientRect().height
				: undefined,
		overscan: PRERENDERED_ITEMS
	})

	return (
		<Div
			className='flex h-full flex-1 flex-col items-stretch justify-between overflow-clip rounded-md border'
			style={
				{
					'--data-list-header-height': '36px'
				} as React.CSSProperties
			}>
			{/* Datalist header */}
			<Div className='hidden items-center justify-between border-b p-3 @6xl:flex'>
				<Typography className='ml-2 inline-flex items-center gap-x-1 text-lg font-medium'>
					<Icon name='Tags' size={24} /> EPC Data
				</Typography>
			</Div>
			{/* Datalist body */}
			{Array.isArray(scannedEpc.data) && scannedEpc.totalDocs > 0 ? (
				<ScrollShadow
					ref={containerRef}
					className='z-10 flex h-[200px] w-full flex-col items-stretch justify-start divide-y bg-background p-2 @6xl:h-[calc(var(--outlet-wrapper-height)-8rem)] md:h-80'>
					<Div
						className='relative w-full'
						style={{
							height: virtualizer.getTotalSize()
						}}>
						{virtualizer.getVirtualItems().map((virtualItem) => {
							const item = scannedEpc.data[virtualItem.index]
							return (
								<Div
									key={virtualItem.index}
									className='absolute left-auto right-auto top-0 mb-1 flex h-10 w-full justify-between whitespace-nowrap border-b p-2 uppercase transition-all duration-75 last:border-none sm:px-2'
									style={{
										height: virtualItem.size,
										transform: `translateY(${virtualItem.start}px)`
									}}>
									<Typography className='font-medium sm:text-sm'>{item.epc}</Typography>
									<Typography variant='small' className='capitalize text-foreground'>
										{item.mo_no}
									</Typography>
								</Div>
							)
						})}
						{scannedEpc.hasNextPage && (
							<Button
								variant='link'
								className='w-full'
								style={{
									position: 'absolute',
									top: 0,
									bottom: 0,
									transform: `translateY(${virtualizer.getTotalSize()}px)`
								}}
								onClick={() => {
									if (!currentPage) setCurrentPage(DEFAULT_NEXT_CURSOR)
									else setCurrentPage(currentPage + 1)
								}}
								disabled={isFetching}>
								{isFetching ? 'Loading more ...' : 'Load more'}
							</Button>
						)}
					</Div>
				</ScrollShadow>
			) : (
				<Div className='z-10 grid h-52 place-content-center @6xl:h-[calc(var(--outlet-wrapper-height)-8rem)] md:h-80'>
					<Div className='inline-flex items-center gap-x-4'>
						<Icon name='Inbox' stroke='hsl(var(--muted-foreground))' size={32} strokeWidth={1} />
						<Typography color='muted'> {t('ns_common:table.no_data')}</Typography>
					</Div>
				</Div>
			)}
			{/* Datalist footer */}
			<Div className='grid basis-auto gap-1.5 border-t p-2 @2xl:grid-cols-2'>
				<Div className='hidden @2xl:block'>
					<OrderSizeTableDialog />
				</Div>
				<Button size={isExtraLargeScreen ? 'default' : 'lg'} variant='secondary'>
					<Icon name='RotateCw' role='img' /> {t('ns_common:actions.reload')}
				</Button>
			</Div>
		</Div>
	)
}

export default ScannedEpcList
