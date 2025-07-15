import UploadDataFileDialog from '@/app/(features)/-components/-shared/upload-dialog'
import { type RFIDStreamEventData } from '@/app/(features)/_layout.(rfid)'
import { RequestHeaders, RequestMethod } from '@/common/constants/enums'
import { FatalError, RetriableError } from '@/common/errors'
import useAuth from '@/common/hooks/use-auth'
import useEffectOnce from '@/common/hooks/use-effect-once'
import useMeasureElement from '@/common/hooks/use-measure-element'
import useScrollToFn from '@/common/hooks/use-scroll-fn'
import { IElectronicProductCode } from '@/common/types/entities'
import env from '@/common/utils/env'
import { Json } from '@/common/utils/json'
import { Button, buttonVariants, Div, Icon, Label, Separator, Typography } from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { AuthService } from '@/services/auth.service'
import { EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useAsyncEffect, useDeepCompareEffect, useMemoizedFn, usePrevious, useUpdateEffect } from 'ahooks'
import { HttpStatusCode } from 'axios'
import { isEqualWith, uniqBy } from 'lodash'
import { Fragment, useRef, useState, useTransition } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { DEFAULT_PROPS, usePageContext } from '../../-contexts/page-context'
import { useGetOutboundEpcQuery } from '../../-hooks'
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
	const { user, token, setAccessToken } = useAuth()
	const [isPending, startTransition] = useTransition()
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
		if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
			abortControllerRef.current.abort()
		}
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
					} else if (response.status === HttpStatusCode.Unauthorized) {
						abortControllerRef.current.abort()
						const response = await AuthService.refreshToken(user.id, abortControllerRef.current?.signal)
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
		fetchServerEvent()
	})

	const scrollToFn = useScrollToFn(containerRef, scrollingRef)
	const estimateSize = useMemoizedFn(() => VIRTUAL_ITEM_SIZE)
	const getScrollElement = useMemoizedFn(() => containerRef.current)
	const measureElement = useMeasureElement()
	const overscan = containerRef.current?.getBoundingClientRect().height > 400 ? 5 : 0

	// * Intitialize virtual list to render scanned EPC data
	const virtualizer = useVirtualizer({
		count: scannedEpc.data.length,
		indexAttribute: 'data-index',
		overscan,
		useAnimationFrameWithResizeObserver: false,
		getScrollElement,
		scrollToFn,
		estimateSize,
		measureElement
	})

	return (
		<Div className='relative flex flex-col items-stretch justify-between overflow-clip rounded-md border @6xl:sticky @6xl:top-[var(--header-height)] @6xl:h-[var(--outlet-wrapper-height)]'>
			{/* Datalist header */}
			<Div className='flex items-center justify-between border-b p-1.5'>
				<Div className='ml-2'>
					<ConnectionInsight />
				</Div>
				<Div className='inline-flex items-center gap-x-2'>
					<Button variant='ghost' onClick={() => fetchServerEvent()}>
						<Icon name='RotateCw' /> {t('ns_common:actions.reload')}
					</Button>
					<Separator orientation='vertical' className='h-6' />

					<Label
						role='button'
						className={buttonVariants({ variant: 'ghost' })}
						htmlFor='data-restoration-sheet-trigger'>
						<Icon name='Archive' size={18} /> {t('ns_common:actions.archived')}
					</Label>
					<DataRestorationSheet dataType={RFIDDataType.OUTBOUND} />
				</Div>
			</Div>
			{Array.isArray(scannedEpc.data) && scannedEpc.totalDocs > 0 ? (
				<ScrollShadow
					ref={containerRef}
					className='z-10 flex h-[calc(35vh-0.25rem)] w-full flex-col items-stretch justify-start divide-y bg-background p-2 @6xl:h-[var(--outlet-wrapper-height)] md:h-[50vh]'>
					<Div className='relative w-full' style={{ height: virtualizer.getTotalSize() }}>
						{virtualizer.getVirtualItems().map((virtualItem) => {
							const item = scannedEpc.data[virtualItem.index]
							return (
								<Div
									key={virtualItem.index}
									data-index={virtualItem.index}
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
				<Div className='z-10 grid h-[calc(35vh-0.25rem)] place-content-center @6xl:h-[calc(var(--outlet-wrapper-height)-8rem)] md:h-[50vh]'>
					<Div className='inline-flex items-center gap-x-4'>
						<Icon name='Inbox' stroke='hsl(var(--muted-foreground))' size={32} strokeWidth={1} />
						<Typography color='muted'> {t('ns_common:table.no_data')}</Typography>
					</Div>
				</Div>
			)}
			{/* Datalist footer */}
			<Div className='grid basis-auto grid-cols-2 gap-1.5 border-t p-1.5'>
				<Div className='hidden @2xl:block'>
					<OrderDetailTableDialog />
				</Div>
				<Div className='col-span-full @2xl:col-span-1'>
					<UploadDataFileDialog station='WH103' maxFiles={500} />
				</Div>
			</Div>
		</Div>
	)
}

export default ScannedEpcList
