'use no memo'

import UploadDataFileDialog from '@/app/(features)/-components/shared/upload-dialog'
import { type RFIDStreamEventData } from '@/app/(features)/_layout.(rfid)'
import { PresetBreakPoints, RequestHeaders, RequestMethod } from '@/common/constants/enums'
import { FatalError, RetriableError } from '@/common/errors'
import useAuth from '@/common/hooks/use-auth'
import { useEffectOnce } from '@/common/hooks/use-effect-once'
import useMediaQuery from '@/common/hooks/use-media-query'
import useQuerySelector from '@/common/hooks/use-query-selector'
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
	useSize,
	useUnmount,
	useUpdate,
	useUpdateEffect
} from 'ahooks'
import { HttpStatusCode } from 'axios'
import { isEqualWith, uniqBy } from 'lodash-es'
import { Fragment, useEffect, useLayoutEffect, useRef, useState, useTransition } from 'react'
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
	const outletWrapper = useQuerySelector('#outlet-wrapper')
	const outletWrapperSize = useSize(outletWrapper)

	const [open, setOpen] = useState(true)

	useEffect(() => {
		if (outletWrapperSize?.width < 1200) setOpen(true)
	}, [outletWrapperSize])

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
		<Div className='relative flex flex-col items-stretch justify-between overflow-clip rounded-md border @4xl:sticky @4xl:top-[var(--header-height)] @4xl:h-[var(--outlet-wrapper-height)] @[1500px]/layout-wrapper:rounded-t-none @[1500px]/layout-wrapper:border-t-0'>
			{/* Datalist header */}
			<Div className='grid w-full auto-cols-fr grid-flow-col items-center border-b @container/toolbar [&>*[role=button]]:rounded-none [&>button]:rounded-none'>
				<ConnectionInsight />
				<Button
					variant='ghost'
					className='flex h-full w-full flex-col flex-wrap py-2 font-normal @lg/toolbar:flex-row @lg/toolbar:font-medium'
					onClick={() => fetchServerEvent()}>
					<Icon name='RefreshCcw' />
					<Typography
						variant='small'
						className='text-xs text-muted-foreground @lg/toolbar:text-sm @lg/toolbar:text-inherit'>
						{t('ns_common:actions.reload')}
					</Typography>
				</Button>
				<Label
					role='button'
					className={buttonVariants({
						variant: 'ghost',
						className: 'flex h-full w-full flex-col py-1 font-normal @lg/toolbar:flex-row @lg/toolbar:font-medium'
					})}
					htmlFor='data-restoration-sheet-trigger'>
					<Icon name='Archive' size={18} />
					<Typography
						variant='small'
						className='text-xs text-muted-foreground @lg/toolbar:text-sm @lg/toolbar:text-inherit'>
						{t('ns_common:actions.archived')}
					</Typography>
				</Label>
				<DataRestorationSheet dataType={RFIDDataType.OUTBOUND} />
				<Label
					role='button'
					className={buttonVariants({
						variant: 'ghost',
						className: 'flex h-full w-full flex-col py-1 font-normal @lg/toolbar:flex-row @lg/toolbar:font-medium'
					})}
					htmlFor='epc-data-upload-dialog-trigger'>
					<Icon name='Upload' size={18} />
					<Typography
						variant='small'
						className='text-xs text-muted-foreground @lg/toolbar:text-sm @lg/toolbar:text-inherit'>
						{t('ns_common:actions.upload')}
					</Typography>
				</Label>
				<Label
					role='button'
					className={buttonVariants({
						variant: 'ghost',
						className:
							'flex h-full w-full flex-col flex-wrap font-normal @lg/toolbar:flex-row @lg/toolbar:font-medium @4xl/layout-wrapper:!hidden md:flex lg:hidden xl:hidden'
					})}
					htmlFor='order-detail-dialog-trigger'>
					<Icon name='ArrowUpRight' size={18} />
					<Typography
						variant='small'
						className='text-xs text-muted-foreground @lg/toolbar:text-sm @lg/toolbar:text-inherit'>
						{t('ns_common:actions.detail')}
					</Typography>
				</Label>
			</Div>
			{/* Datalist body */}
			{Array.isArray(scannedEpc.data) && scannedEpc.totalDocs > 0 ? (
				<ScrollShadow
					ref={containerRef}
					className={cn(
						'linear relative z-10 divide-y bg-background contain-size',
						hasMounted.current && 'duration-100 will-change-transform',
						open ? 'h-[30vh] p-2 @4xl:h-[var(--outlet-wrapper-height)]' : 'h-0 p-0'
					)}>
					{virtualizer.getVirtualItems().map((virtualItem) => {
						const item = scannedEpc.data[virtualItem.index]
						return (
							<Div
								key={virtualItem.index}
								className='absolute inset-x-0 top-0 flex h-10 w-full justify-between whitespace-nowrap px-4 py-2 uppercase transition-all duration-75 last:border-none hover:bg-secondary'
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
						<Typography> {t('ns_common:table.no_data')}</Typography>
					</Div>
				</Div>
			)}

			{open && <Separator aria-hidden={!open} className='aria-hidden:hidden' />}
			{/* Datalist footer */}
			<Div className='basis-auto bg-background p-1.5'>
				<Div className='[&>button[aria-haspopup=dialog]]:hidden [&>button[aria-haspopup=dialog]]:w-full @4xl/playground:[&>button[aria-haspopup=dialog]]:!flex @[1500px]/layout-wrapper:[&>button[aria-haspopup=dialog]]:hidden md:[&>button[aria-haspopup=dialog]]:hidden'>
					<OrderDetailTableDialog />
				</Div>
				<Button
					variant='secondary'
					className='hidden w-full @[900px]/layout-wrapper:!hidden @[1500px]/layout-wrapper:!flex md:flex lg:hidden'
					onClick={() => setOpen(!open)}>
					<Icon name={open ? 'ChevronUp' : 'ChevronDown'} />{' '}
					{open ? t('ns_common:actions.fold') : t('ns_common:actions.unfold')}
				</Button>
				<Div className='[&>button[aria-haspopup=dialog]]:hidden'>
					<UploadDataFileDialog station='WH103' maxFiles={500} />
				</Div>
			</Div>
		</Div>
	)
}

export default ScannedEpcList
