'use no memo'

import { type RFIDStreamEventData } from '@/app/(features)/_layout.(rfid)'
import { RequestHeaders, RequestMethod } from '@/common/constants/enums'
import { FatalError, RetriableError } from '@/common/errors'
import useAuth from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import useScrollToFn from '@/common/hooks/use-scroll-fn'
import { IElectronicProductCode } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import { Json } from '@/common/utils/json'
import { Button, Div, Icon, Tooltip, Typography } from '@/components/ui'
import { Alert, AlertClose, AlertContent, AlertDescription, AlertTitle } from '@/components/ui/@custom/alert'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { AppConfigs } from '@/configs/app.config'
import { AuthService } from '@/services/auth.service'
import { EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
	useAsyncEffect,
	useDeepCompareEffect,
	usePrevious,
	useSessionStorageState,
	useUnmount,
	useUpdateEffect
} from 'ahooks'
import { HttpStatusCode } from 'axios'
import { uniqBy } from 'lodash-es'
import { Fragment, RefObject, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import isEqual from 'react-fast-compare'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { DEFAULT_PROPS, usePageContext } from '../../-contexts/page-context'
import { useGetInboundEpcQuery } from '../../-hooks/use-rfid-inbound-asm'

const VIRTUAL_ITEM_SIZE = 40
const PRERENDERED_ITEMS = 5
const DEFAULT_NEXT_CURSOR = 2
const SSE_TOAST_ID = 'FETCH_SSE'

const EpcDataList: React.FC<{ listBoxFooterRef: RefObject<HTMLDivElement> }> = ({ listBoxFooterRef }) => {
	const { t } = useTranslation()
	const { user } = useAuth()
	const isLargeScreen = useMediaQuery('(min-width: 920px)')
	const [isExpanded, setIsExpanded] = useSessionStorageState<boolean>('rfid:inbound:epc_list_expanded', {
		defaultValue: true,
		listenStorageChange: true
	})

	const {
		currentPage,
		selectedOrder,
		scannedEpc,
		scanningStatus,
		setCurrentPage,
		setScanningStatus,
		setScannedEpc,
		setScannedOrders,
		setSelectedOrder,
		reset
	} = usePageContext(
		'currentPage',
		'selectedOrder',
		'scannedEpc',
		'scanningStatus',
		'setCurrentPage',
		'setScanningStatus',
		'setScannedEpc',
		'setScannedOrders',
		'setSelectedOrder',
		'reset'
	)

	// * Abort controller to control fetch event source
	const abortControllerRef = useRef<AbortController>(new AbortController())

	// * Alert for invalid EPCs
	const [hasInvalidEpcAlert, setHasInvalidEpcAlert] = useState<boolean>(false)

	// * Incomming EPCs data from server-sent event
	const [incommingEpc, setIncommingEpc] = useState<Pagination<IElectronicProductCode>>(scannedEpc)

	// * Previous scanned EPCs
	const previousEpc = usePrevious(incommingEpc)

	// * Virtual list refs
	const containerRef = useRef<HTMLDivElement>(null)

	const isInvalidEpcDismissedRef = useRef<boolean>(false)

	// * Manual fetch EPC
	const { data: retrievedEpcData, refetch: manualFetchEpc, isFetching } = useGetInboundEpcQuery()

	// * Fetch server-sent event
	const fetchServerEvent = async () => {
		abortControllerRef.current = new AbortController()
		toast.loading(t('ns_common:notification.establish_connection'), { id: SSE_TOAST_ID })
		try {
			await fetchEventSource(AppConfigs.BASE_API_URL + '/rfid/inbound/sse', {
				method: RequestMethod.GET,
				credentials: 'include',
				headers: {
					[RequestHeaders.FACTORY_CODE]: user?.current_factory_code
				},
				signal: abortControllerRef.current.signal,
				openWhenHidden: true,
				async onopen(response) {
					if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
						if (scanningStatus === 'connecting') {
							setScanningStatus('connected')
							toast.success(t('ns_common:status.connected'), { id: SSE_TOAST_ID })
						}
						return
					} else if (response.status === HttpStatusCode.Unauthorized) {
						const response = await AuthService.refreshToken(abortControllerRef.current?.signal)
						const refreshToken = response.metadata
						if (!refreshToken) throw new FatalError('Failed to refresh token')
						throw new RetriableError()
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
						setHasInvalidEpcAlert(Boolean(data?.has_invalid) && !isInvalidEpcDismissedRef.current)
					} catch (error) {
						throw new FatalError(error)
					}
				},
				onclose() {
					throw new RetriableError()
				},
				onerror(error) {
					// * Depend on error type, retry or not
					if (!abortControllerRef.current.signal.aborted) abortControllerRef.current.abort()
					if (error instanceof FatalError) {
						setScanningStatus('disconnected')
						toast.error(t('ns_common:notification.error'), { id: SSE_TOAST_ID })
						throw error
					}
					// * Retry on other errors
					setScanningStatus('connecting')
				}
			})
		} catch (e) {
			toast('Failed to connect', { id: SSE_TOAST_ID, description: e.message })
		} finally {
			if (scanningStatus !== 'disconnected') toast.info(t('ns_common:status.disconnected'), { id: SSE_TOAST_ID })
		}
	}

	// * Triggered when scanning status changes
	useUpdateEffect(() => {
		const cancelFetchSSE = () => abortControllerRef.current.abort()

		switch (scanningStatus) {
			case undefined: {
				cancelFetchSSE() // Cancel fetch event source
				setHasInvalidEpcAlert(false) // Hide invalid EPC alert
				isInvalidEpcDismissedRef.current = false // Reset invalid EPC alert dismiss flag
				setIncommingEpc(DEFAULT_PROPS.scannedEpc) // Reset scanned EPC data
				reset()
				break
			}
			case 'disconnected': {
				cancelFetchSSE()
				break
			}
			case 'connecting': {
				fetchServerEvent()
				break
			}
			default: {
				const timeout = setTimeout(() => toast.dismiss(SSE_TOAST_ID), AppConfigs.TOAST_DURATION)
				return () => {
					clearTimeout(timeout)
				}
			}
		}
	}, [scanningStatus])

	useUpdateEffect(() => {
		setScanningStatus(DEFAULT_PROPS.scanningStatus)
	}, [user?.current_factory_code])

	// * Triggered when incomming message comes
	useDeepCompareEffect(() => {
		if (isEqual(previousEpc, incommingEpc)) {
			const previousData = scannedEpc?.data ?? []
			const newData = incommingEpc?.data ?? []
			setScannedEpc({
				...scannedEpc,
				...incommingEpc,
				data: uniqBy([...previousData, ...newData], 'epc')
			})
		} else {
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			setScannedEpc(incommingEpc)
		}
	}, [incommingEpc, previousEpc])

	// * On current page changes with value greater than default (1 or null)
	useAsyncEffect(async () => {
		if (!scanningStatus || currentPage === DEFAULT_PROPS.currentPage || currentPage === null) return
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

	// * On selected order changes
	useAsyncEffect(async () => {
		if (!scanningStatus) return
		try {
			const { data: metadata } = await manualFetchEpc()
			const previousFilteredEpc = scannedEpc?.data.filter((e) => e.mo_no === selectedOrder)
			const nextFilteredEpc = metadata?.data ?? []
			setScannedEpc({
				...metadata,
				data: uniqBy([...previousFilteredEpc, ...nextFilteredEpc], 'epc')
			})
		} catch {
			throw new RetriableError()
		}
	}, [selectedOrder])

	useUpdateEffect(() => {
		if (retrievedEpcData)
			setScannedEpc({ ...retrievedEpcData, data: uniqBy([...scannedEpc.data, ...retrievedEpcData.data], 'epc') })
	}, [retrievedEpcData])

	useLayoutEffect(() => {
		if (isLargeScreen) setIsExpanded(true)
	}, [isLargeScreen])

	useUnmount(() => {
		abortControllerRef.current.abort()
	})

	const scrollToFn = useScrollToFn(containerRef)
	const estimateSize = useCallback(() => VIRTUAL_ITEM_SIZE, [])
	const getScrollElement = useCallback(() => containerRef.current, [])

	// * Intitialize virtual list to render scanned EPC data
	const virtualizer = useVirtualizer({
		count: scannedEpc.data.length,
		overscan: PRERENDERED_ITEMS,
		indexAttribute: 'data-index',
		getScrollElement,
		scrollToFn,
		estimateSize
	})

	return (
		<Fragment>
			{createPortal(
				<Alert data-state={hasInvalidEpcAlert ? 'open' : 'closed'}>
					<Icon name='TriangleAlert' size={36} className='stroke-destructive-foreground' />
					<AlertContent>
						<AlertTitle>{t('ns_common:titles.caution')}</AlertTitle>
						<AlertDescription>{t('ns_inoutbound:notification.invalid_epc_deteted')}</AlertDescription>
					</AlertContent>
					<Tooltip
						message={t('ns_common:actions.dismiss')}
						triggerProps={{ asChild: true }}
						contentProps={{ side: 'left' }}>
						<AlertClose
							onClick={() => {
								isInvalidEpcDismissedRef.current = true
								setHasInvalidEpcAlert(false)
							}}>
							<Icon name='X' />
						</AlertClose>
					</Tooltip>
				</Alert>,
				document.body
			)}
			{Array.isArray(scannedEpc.data) && scannedEpc.totalDocs > 0 ? (
				<ScrollShadow
					ref={containerRef}
					aria-expanded={isExpanded}
					className={cn(
						'group/scrollable z-10 flex h-0 w-full flex-col items-stretch justify-start divide-y divide-border bg-background contain-size',
						'transition-height aria-expanded:p-2 @3xl:aria-expanded:h-[calc(var(--outlet-wrapper-height)-var(--toolbar-height)-var(--list-header-height)-var(--list-footer-height)-var(--outlet-padding))] md:aria-expanded:h-72',
						'group-has-[#toggle-fullscreen[data-state=checked]]:aria-expanded:h-[calc(100dvh-var(--toolbar-height)-var(--list-header-height)-var(--list-footer-height)-4*var(--outlet-padding)-4px)]'
					)}>
					<Div
						className='relative w-full duration-200 ease-in group-aria-expanded/scrollable:animate-in group-aria-expanded/scrollable:fade-in-0 group-aria-[expanded=false]/scrollable:animate-out group-aria-[expanded=false]/scrollable:fade-out-0'
						style={{ height: virtualizer.getTotalSize() }}>
						{virtualizer.getVirtualItems().map((virtualItem) => {
							const item = scannedEpc.data[virtualItem.index]
							return (
								<Div
									key={virtualItem.index}
									className='absolute left-auto right-auto top-0 flex h-10 w-full justify-between whitespace-nowrap border-b px-4 py-2 uppercase transition-all duration-75 last:border-none hover:bg-secondary'
									style={{
										height: virtualItem.size,
										transform: `translateY(${virtualItem.start}px)`
									}}>
									<Typography className='font-medium'>{item.epc}</Typography>
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
								{isFetching ? (
									<Icon name='LoaderCircle' className='animate-spin' />
								) : (
									<Fragment>
										<Icon name='Plus' />
										{t('ns_common:actions.load_more')}
									</Fragment>
								)}
							</Button>
						)}
					</Div>
				</ScrollShadow>
			) : (
				<Div
					aria-expanded={isExpanded}
					className='grid h-0 place-items-center overflow-clip transition-height duration-200 group-has-[#toggle-fullscreen[data-state=checked]]:h-[calc(100dvh-var(--toolbar-height)-var(--list-header-height)-var(--list-footer-height)-4*var(--outlet-padding)-4px)] @3xl:aria-expanded:h-[calc(var(--outlet-wrapper-height)-var(--toolbar-height)-var(--list-header-height)-var(--list-footer-height)-var(--outlet-padding))] md:aria-expanded:h-64'>
					<Div className='inline-flex items-center gap-x-4'>
						<Icon name='Inbox' stroke='hsl(var(--muted-foreground))' size={32} strokeWidth={1} />
						<Typography color='muted'> {t('ns_common:table.no_data')}</Typography>
					</Div>
				</Div>
			)}
			{listBoxFooterRef?.current &&
				createPortal(
					<Button
						variant='ghost'
						size='lg'
						aria-expanded={isExpanded}
						className='order-2 lg:hidden xl:hidden'
						onClick={() => setIsExpanded(!isExpanded)}>
						<Icon name={isExpanded ? 'ChevronsUp' : 'ChevronsDown'} />{' '}
						{isExpanded ? t('ns_common:actions.fold') : t('ns_common:actions.unfold')}
					</Button>,
					listBoxFooterRef.current
				)}
		</Fragment>
	)
}

export default EpcDataList
