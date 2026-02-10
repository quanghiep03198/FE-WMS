import UploadDataFileDialog from '@/app/(features)/-components/shared/upload-dialog'
import { type RFIDStreamEventData } from '@/app/(features)/_layout.(rfid)'
import { PresetBreakPoints, RequestHeaders, RequestMethod } from '@/common/constants/enums'
import { FatalError, RetriableError } from '@/common/errors'
import useAuth from '@/common/hooks/use-auth'
import { useEffectOnce } from '@/common/hooks/use-effect-once'
import useMediaQuery from '@/common/hooks/use-media-query'
import useScrollToFn from '@/common/hooks/use-scroll-fn'
import { IElectronicProductCode } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import { Json } from '@/common/utils/json'
import { Button, buttonVariants, Div, Icon, Label, Separator, Typography } from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { AppConfigs } from '@/configs/app.config'
import { AuthService } from '@/services/auth.service'
import { EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
	useAsyncEffect,
	useDeepCompareEffect,
	useMemoizedFn,
	usePrevious,
	useUnmount,
	useUpdate,
	useUpdateEffect
} from 'ahooks'
import { HttpStatusCode } from 'axios'
import { isEqualWith, uniqBy } from 'lodash-es'
import { Fragment, useLayoutEffect, useRef, useState, useTransition } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { DEFAULT_PROPS, usePageContext } from '../../-contexts/page-context'
import { useGetOutboundEpcQuery } from '../../-hooks/use-rfid-outbound-asm'
import DataRestorationSheet from '../../../-components/shared'
import { RFIDDataType } from '../../../-constants'
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
	const isExtraLargeScreen = useMediaQuery(PresetBreakPoints.ULTIMATE_LARGE)
	const [open, setOpen] = useState(true)
	const hasMounted = useRef(false)

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
	const { data: retrievedEpcData, refetch: manualFetchEpc, isFetching } = useGetOutboundEpcQuery()

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
					if (error instanceof FatalError) {
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

	useUnmount(() => {
		if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
			abortControllerRef.current?.abort()
		}
	})

	useEffectOnce(() => {
		fetchServerEvent()
	})

	useLayoutEffect(() => {
		if (!isExtraLargeScreen) setOpen(true)
	}, [isExtraLargeScreen])

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
		<Div className='relative flex flex-col items-stretch justify-between overflow-clip rounded-md border @4xl:sticky @4xl:top-[var(--header-height)] @4xl:h-[var(--outlet-wrapper-height)] xxl:rounded-t-none xxl:border-t-0'>
			{/* Datalist header */}
			<Div className='flex w-full items-center justify-between gap-x-1 border-b p-1.5 *:text-sm xxl:justify-around'>
				<ConnectionInsight />
				<Separator orientation='vertical' className='hidden h-4 w-0.5 xxl:block' />
				<Button variant='ghost' size='sm' className='ml-auto xxl:ml-0' onClick={() => fetchServerEvent()}>
					<Icon name='RefreshCcw' /> {t('ns_common:actions.reload')}
				</Button>
				<Separator orientation='vertical' className='hidden h-4 w-0.5 xxl:block' />
				<Label
					role='button'
					className={buttonVariants({ variant: 'ghost', size: 'sm' })}
					htmlFor='data-restoration-sheet-trigger'>
					<Icon name='Archive' size={18} /> {t('ns_common:actions.archived')}
				</Label>
				<Separator orientation='vertical' className='hidden h-4 w-0.5 xxl:block' />
				<Label
					role='button'
					className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'hidden xxl:inline-flex' })}
					htmlFor='epc-data-upload-dialog-trigger'>
					<Icon name='Upload' size={18} /> {t('ns_common:actions.upload')}
				</Label>
				<DataRestorationSheet dataType={RFIDDataType.OUTBOUND} />
			</Div>
			{/* Datalist body */}
			{Array.isArray(scannedEpc.data) && scannedEpc.totalDocs > 0 ? (
				<ScrollShadow
					ref={containerRef}
					className={cn(
						'linear z-10 divide-y bg-background contain-size',
						hasMounted.current && 'duration-100 will-change-transform',
						open ? 'h-[30vh] p-2 @4xl:h-[var(--outlet-wrapper-height)]' : 'h-0 p-0'
					)}>
					<Div
						className={cn(
							'relative w-full contain-paint',
							hasMounted.current && 'duration-300 ease-in will-change-contents',
							{
								'animate-in fade-in-0': open && hasMounted.current,
								'animate-out fade-out-0': !open && hasMounted.current
							}
						)}
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
									height: VIRTUAL_ITEM_SIZE,
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
									<Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' />
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
					className={cn(
						'linear grid place-items-center',
						hasMounted.current && 'transition-height duration-200',
						open ? 'h-[33.33vh] @4xl:h-[calc(var(--outlet-wrapper-height)-8rem)]' : 'h-0'
					)}>
					<Div className='inline-flex items-center gap-x-4'>
						<Icon name='Inbox' stroke='hsl(var(--muted-foreground))' size={32} strokeWidth={1} />
						<Typography color='muted'> {t('ns_common:table.no_data')}</Typography>
					</Div>
				</Div>
			)}

			{open && <Separator aria-hidden={!open} className='aria-hidden:hidden' />}
			{/* Datalist footer */}
			<Div className='grid basis-auto grid-cols-2 gap-1.5 bg-background p-1.5'>
				<Div className='hidden @2xl:block'>
					<OrderDetailTableDialog />
				</Div>
				<Div className='col-span-full @2xl:col-span-1 xxl:[&>button[aria-haspopup=dialog]]:hidden'>
					<Button variant='secondary' className='hidden w-full xxl:flex' onClick={() => setOpen(!open)}>
						<Icon name={open ? 'ChevronUp' : 'ChevronDown'} />{' '}
						{open ? t('ns_common:actions.fold') : t('ns_common:actions.unfold')}
					</Button>
					<UploadDataFileDialog station='WH103' maxFiles={500} />
				</Div>
			</Div>
		</Div>
	)
}

export default ScannedEpcList
