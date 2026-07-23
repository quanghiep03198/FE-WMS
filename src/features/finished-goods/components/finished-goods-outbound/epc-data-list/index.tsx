'use no memo'

import { AuthService } from '@/features/auth/services/auth.service'
import UploadDataFileDialog from '@/features/finished-goods/components/upload-data-dialog'
import { StockFlow } from '@/features/finished-goods/constants/enums'
import type { IElectronicProductCode } from '@/features/finished-goods/types'
import { type RFIDStreamEventData } from '@/features/finished-goods/types'
import { RequestHeaders, RequestMethod } from '@common/constants/enums'
import { FatalError, RetriableError } from '@common/errors'
import { cn } from '@common/utils/cn'
import { Json } from '@common/utils/json'
import { Button, buttonVariants, Div, Icon, Label, Typography } from '@components/ui'
import { AppConfigs } from '@configs/app.config'
import useAuth from '@hooks/use-auth'
import { useEffectOnce } from '@hooks/use-effect-once'
import useQuerySelector from '@hooks/use-query-selector'
import useScrollToFn from '@hooks/use-scroll-fn'
import type { EventSourceMessage } from '@microsoft/fetch-event-source'
import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
	useAsyncEffect,
	useDeepCompareEffect,
	useMemoizedFn,
	usePrevious,
	useSessionStorageState,
	useSize,
	useUnmount,
	useUpdate,
	useUpdateEffect
} from 'ahooks'
import { HttpStatusCode } from 'axios'
import { isEqualWith, uniqBy } from 'lodash-es'
import { Fragment, useLayoutEffect, useRef, useState, useTransition } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { DEFAULT_PROPS, usePageContext } from '../../../contexts/finished-goods-outbound/page-context'
import { useGetScanningOutboundEpcQuery } from '../../../hooks/use-outbound-request'
import DataRestorationSheet from '../../data-restoration'
import OrderDetailTableDialog from '../manufacture-order-detail/order-detail-dialog'
import ConnectionInsight from './connection-insight'

const VIRTUAL_ITEM_SIZE = 40
const DEFAULT_NEXT_CURSOR = 2
const SSE_TOAST_ID = 'FETCH_SSE'

const ScannedEpcList: React.FC = () => {
	const { t } = useTranslation()
	const abortControllerRef = useRef<AbortController | null>(null)
	const [isPending, startTransition] = useTransition()
	const { user } = useAuth()
	const outletWrapper = useQuerySelector('#outlet-wrapper')
	const outletWrapperSize = useSize(outletWrapper)

	const [isExpanded, setIsExpanded] = useSessionStorageState('rfid:outbound:epc_list_expanded', {
		defaultValue: true,
		listenStorageChange: true
	})

	const hasMounted = useRef(false)
	useLayoutEffect(() => {
		if (outletWrapperSize?.width > 920 && outletWrapperSize?.width < 1280) setIsExpanded(true)
	}, [outletWrapperSize])

	useLayoutEffect(() => {
		hasMounted.current = true
	}, [])

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
	const { data: retrievedEpcData, refetch: manualFetchEpc, isFetching } = useGetScanningOutboundEpcQuery()

	// * Virtual list refs
	const containerRef = useRef<HTMLDivElement>(null)

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

	const update = useUpdate()

	// * Fetch server-sent event
	const fetchServerEvent = async () => {
		setScanningState('pending')
		if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
			abortControllerRef.current.abort()
		}
		abortControllerRef.current = new AbortController()
		toast.loading(t('ns_common:notification.establish_connection'), { id: SSE_TOAST_ID })
		try {
			await fetchEventSource(AppConfigs.BASE_API_URL + '/rfid/outbound/sse', {
				method: RequestMethod.GET,
				credentials: 'include',
				headers: {
					[RequestHeaders.USER_REQUEST]: user?.username,
					[RequestHeaders.FACTORY_CODE]: user?.current_factory_code
				},
				signal: abortControllerRef.current.signal,
				openWhenHidden: true,
				async onopen(response) {
					if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
						setScanningState('success')
						toast.success(t('ns_common:status.connected'), { id: SSE_TOAST_ID })
					} else if (response.status === HttpStatusCode.Unauthorized) {
						await AuthService.refreshToken(abortControllerRef.current?.signal).catch((error) => {
							throw new FatalError(error)
						})
						throw new RetriableError('JWT expired, retrying connection with new token...	')
					} else if (
						response.status >= HttpStatusCode.BadRequest &&
						response.status !== HttpStatusCode.Unauthorized
					) {
						throw new FatalError()
					} else {
						throw new RetriableError()
					}
				},
				onmessage(event: EventSourceMessage) {
					try {
						if (!event.data || !Json.isValid(event.data)) return
						const data = JSON.parse(event.data) as RFIDStreamEventData
						startTransition(() => setIncommingEpc(data?.epcs))
						startTransition(() => setScannedOrders(data?.orders))
						setScanningState(isPending ? 'pending' : 'success')
					} catch (error) {
						throw new FatalError(error)
					}
				},
				onclose() {
					throw new RetriableError()
				},
				onerror(error) {
					// * Depend on error type, retry or not
					const isRetriable = error instanceof RetriableError
					if (!isRetriable) {
						abortControllerRef.current.abort()
						setScanningState('error')
						toast.error(t('ns_common:notification.error'), { id: SSE_TOAST_ID })
						throw error
					}
					update() // * Force re-render to reset the SSE connection
				}
			})
		} catch (e) {
			toast('Failed to connect', { id: SSE_TOAST_ID, description: e.message })
		} finally {
			toast.info(t('ns_common:status.disconnected'), { id: SSE_TOAST_ID })
		}
	}

	const releaseAbortController = () => {
		if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
			abortControllerRef.current.abort()
		}
	}

	useUnmount(releaseAbortController)

	useEffectOnce(() => {
		fetchServerEvent()
		return () => releaseAbortController()
	})

	const scrollToFn = useScrollToFn(containerRef)
	const estimateSize = useMemoizedFn(() => VIRTUAL_ITEM_SIZE)
	const getScrollElement = useMemoizedFn(() => containerRef.current)
	const overscan = containerRef.current?.getBoundingClientRect().height > 400 ? 5 : 0

	// * Intitialize virtual list to render scanned EPC data
	const virtualizer = useVirtualizer({
		count: scannedEpc.data.length,
		indexAttribute: 'data-index',
		overscan,
		useAnimationFrameWithResizeObserver: false,
		getScrollElement,
		scrollToFn,
		estimateSize
	})

	return (
		<Div className='relative flex flex-col items-stretch justify-between overflow-clip rounded-md rounded-t-none border border-t-0 @4xl:sticky @4xl:top-(--header-height) @4xl:h-(--outlet-wrapper-height) @4xl/playground:rounded-md @4xl/playground:border @7xl/layout-wrapper:rounded-t-none @7xl/layout-wrapper:border-t-0'>
			{/* Datalist header */}
			<Div className='@container/toolbar grid w-full auto-cols-auto grid-flow-col items-center border-b [&>*[role=button]]:rounded-none [&>button]:rounded-none'>
				<ConnectionInsight />
				<Button
					variant='ghost'
					className='flex h-full w-full flex-col flex-wrap py-2 font-normal @xl/toolbar:flex-row'
					onClick={() => fetchServerEvent()}>
					<Icon name='RefreshCcw' />
					<Typography variant='small' className='text-muted-foreground text-xs @xl/toolbar:text-sm'>
						{t('ns_common:actions.reload')}
					</Typography>
				</Button>
				<Label
					role='button'
					className={buttonVariants({
						variant: 'ghost',
						className: 'flex h-full w-full flex-col py-1 font-normal @xl/toolbar:flex-row'
					})}
					htmlFor='data-restoration-sheet-trigger'>
					<Icon name='Archive' size={18} />
					<Typography variant='small' className='text-muted-foreground text-xs @xl/toolbar:text-sm'>
						{t('ns_common:actions.archived')}
					</Typography>
				</Label>
				<DataRestorationSheet dataType={StockFlow.OUTBOUND} />
				<Label
					role='button'
					className={buttonVariants({
						variant: 'ghost',
						className: 'flex h-full w-full flex-col py-1 font-normal @xl/toolbar:flex-row'
					})}
					htmlFor='epc-data-upload-dialog-trigger'>
					<Icon name='Upload' size={18} />
					<Typography variant='small' className='text-muted-foreground text-xs @xl/toolbar:text-sm'>
						{t('ns_common:actions.upload')}
					</Typography>
				</Label>
				<Label
					role='button'
					className={buttonVariants({
						variant: 'ghost',
						className:
							'flex h-full w-full flex-col flex-wrap font-normal @xl/toolbar:flex-row @4xl/playground:hidden @7xl/layout-wrapper:hidden'
					})}
					htmlFor='order-detail-dialog-trigger'>
					<Icon name='ArrowUpRight' size={18} />
					<Typography variant='small' className='text-muted-foreground text-xs @xl/toolbar:text-sm'>
						{t('ns_common:actions.detail')}
					</Typography>
				</Label>
			</Div>
			{/* Datalist body */}
			{Array.isArray(scannedEpc.data) && scannedEpc.totalDocs > 0 ? (
				<Div
					ref={containerRef}
					aria-expanded={isExpanded}
					data-mounted={hasMounted.current}
					className={cn(
						'linear bg-background scroll-fade-y transition-height relative z-10 h-0 divide-y p-0 will-change-transform contain-size',
						'data-[mounted=true]:duration-100',
						'aria-expanded:h-64 aria-expanded:p-2 @4xl/playground:aria-expanded:h-(--outlet-wrapper-height)'
					)}>
					{virtualizer.getVirtualItems().map((virtualItem) => {
						const item = scannedEpc.data[virtualItem.index]
						return (
							<Div
								key={virtualItem.index}
								className='hover:bg-secondary absolute inset-x-0 top-0 flex h-10 w-full justify-between px-4 py-2 whitespace-nowrap uppercase transition-all duration-75 last:border-none'
								style={{
									height: virtualItem.size,
									transform: `translateY(${virtualItem.start}px)`
								}}>
								<Typography variant='small' className='font-medium sm:text-sm'>
									{item.epc}
								</Typography>
								<Typography variant='small' className='text-foreground capitalize'>
									{item.mo_no}
								</Typography>
							</Div>
						)
					})}
					{scannedEpc.hasNextPage && (
						<Button
							variant='link'
							className='absolute inset-x-0'
							style={{
								height: VIRTUAL_ITEM_SIZE,
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
			) : (
				<Div
					aria-expanded={isExpanded}
					data-mounted={hasMounted.current}
					className={cn(
						'linear grid h-0 place-items-center',
						'data-[mounted=true]:transition-height data-[mounted=true]:duration-200',
						'aria-expanded:h-64 @4xl/playground:aria-expanded:h-(--outlet-wrapper-height)'
					)}>
					<Div className='inline-flex items-center gap-x-4'>
						<Icon name='Inbox' stroke='var(--muted-foreground)' size={32} strokeWidth={1} />
						<Typography color='muted'> {t('ns_common:table.no_data')}</Typography>
					</Div>
				</Div>
			)}
			{/* Datalist footer */}
			<Div aria-expanded={isExpanded} className='bg-background basis-auto p-1.5 aria-expanded:border-t'>
				<Div className='[&>button[aria-haspopup=dialog]]:hidden [&>button[aria-haspopup=dialog]]:w-full md:[&>button[aria-haspopup=dialog]]:hidden @4xl/playground:[&>button[aria-haspopup=dialog]]:flex! @7xl/layout-wrapper:[&>button[aria-haspopup=dialog]]:hidden'>
					<OrderDetailTableDialog />
				</Div>
				<Button
					variant='secondary'
					className='flex w-full @[1440px]/playground:flex @4xl/playground:hidden'
					onClick={() => setIsExpanded(!isExpanded)}>
					<Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} />{' '}
					{isExpanded ? t('ns_common:actions.fold') : t('ns_common:actions.unfold')}
				</Button>
				<Div className='[&>button[aria-haspopup=dialog]]:hidden'>
					<UploadDataFileDialog station='WH103' maxFiles={500} />
				</Div>
			</Div>
		</Div>
	)
}

export default ScannedEpcList
