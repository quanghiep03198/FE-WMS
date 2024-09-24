import { RequestMethod } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import { IElectronicProductCode } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import env from '@/common/utils/env'
import { Json } from '@/common/utils/json'
import { Button, Div, Icon, Typography } from '@/components/ui'
import axiosInstance from '@/configs/axios.config'
import { AuthService } from '@/services/auth.service'
import { EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source'
import { useAsyncEffect, useDeepCompareEffect, usePrevious, useRequest, useVirtualList } from 'ahooks'
import { HttpStatusCode } from 'axios'
import { isNil, omitBy, pick, uniqBy } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useListBoxContext } from '../../_contexts/-list-box.context'
import { DEFAULT_PROPS, OrderItem, OrderSize, usePageContext } from '../../_contexts/-page-context'

type StreamEventData = {
	epcs: Pagination<IElectronicProductCode>
	orders: OrderItem[]
	sizes: OrderSize[]
}

class RetriableError extends Error {}
class FatalError extends Error {}

//

const VIRTUAL_ITEM_SIZE = 40
const PRERENDERED_ITEMS = 5
const DEFAULT_NEXT_CURSOR = 2

const EpcDataList: React.FC = () => {
	const { t } = useTranslation()
	const { user } = useAuth()
	const {
		scannedEpc,
		connection,
		scanningStatus,
		selectedOrder,
		scannedOrders,
		pollingDuration,
		writeLog,
		setScannedEpc,
		setScanningStatus,
		setScannedOrders,
		setScannedSizes,
		setSelectedOrder
	} = usePageContext((state) =>
		pick(state, [
			'scannedEpc',
			'connection',
			'scanningStatus',
			'scannedOrders',
			'selectedOrder',
			'pollingDuration',
			'writeLog',
			'setScanningStatus',
			'setScannedEpc',
			'setScannedOrders',
			'setScannedSizes',
			'setSelectedOrder'
		])
	)
	const { page, setPage, setLoading } = useListBoxContext()
	const ctrlRef = useRef<AbortController>(new AbortController())
	const streamedDataRef = useRef<string>('')
	const containerRef = useRef<HTMLDivElement>(null)
	const wrapperRef = useRef<HTMLDivElement>(null)
	const [incommingEpc, setIncommingEpc] = useState<Pagination<IElectronicProductCode>>(scannedEpc)
	const previousEpc = usePrevious(incommingEpc)
	const isTooManyOrderFoundIgnoredRef = useRef<boolean>(false)
	const [currentTime, setCurrentTime] = useState<number>(performance.now())
	const previousTime = usePrevious(currentTime)

	const { runAsync, loading } = useRequest(
		async (): Promise<ResponseBody<StreamEventData>> => {
			return await axiosInstance.get('/rfid/fetch-next-epc', {
				headers: { ['X-Database-Host']: connection },
				params: omitBy({ page: page, filter: selectedOrder }, (value) => !value || value === 'all')
			})
		},
		{
			onBefore: () => setLoading(true),
			onFinally: () => setLoading(false),
			manual: true,
			ready: !!page || (selectedOrder !== 'all' && typeof selectedOrder !== 'undefined')
		}
	)

	// Sync scanned result with fetched data from server while scanning is on and previous data is staled
	useEffect(() => {
		switch (scanningStatus) {
			case undefined: {
				setIncommingEpc(DEFAULT_PROPS.scannedEpc)
				window.dispatchEvent(new CustomEvent('RETRIEVE_TRANSFERRED_DATA', { detail: Json.getContentSize('') }))
				return
			}
			case 'disconnected': {
				writeLog({ message: 'Disconnected', type: 'info' })
				ctrlRef.current.abort()
				return
			}
			case 'connecting': {
				ctrlRef.current = new AbortController()
				fetchEventSource(env('VITE_API_BASE_URL') + '/rfid/fetch-epc', {
					method: RequestMethod.GET,
					openWhenHidden: true,
					headers: {
						['X-Database-Host']: connection,
						['X-Polling-duration']: pollingDuration.toString(),
						['Authorization']: AuthService.getAccessToken()
					},
					signal: ctrlRef.current.signal,
					async onopen(response) {
						if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
							setScanningStatus('connected')
							writeLog({ message: 'Connected', type: 'info' })
							toast.success('Connected', { id: 'FETCH_SSE' })
							return
						} else if (response.status === HttpStatusCode.Unauthorized) {
							AuthService.refreshToken(user.id)
						} else if (
							response.status >= HttpStatusCode.BadRequest &&
							response.status < HttpStatusCode.InternalServerError &&
							response.status !== HttpStatusCode.TooManyRequests
						) {
							throw new FatalError('Server Error') // client-side errors are usually non-retriable:
						} else {
							throw new RetriableError()
						}
					},
					onclose() {
						throw new RetriableError()
					},
					onmessage(e: EventSourceMessage) {
						try {
							if (!e.data) return
							streamedDataRef.current += e.data
							const data = JSON.parse(e.data) as StreamEventData
							setIncommingEpc(data.epcs)
							setCurrentTime(performance.now())
							setScannedOrders(Array.isArray(data?.orders) ? data?.orders : [])
							setScannedSizes(Array.isArray(data?.sizes) ? data?.sizes : [])
							writeLog({
								type: 'info',
								message: /* template */ `
									GET /rfid/read-epc <span class='text-success font-medium'>200</span> ~ ${Json.getContentSize(data)} kB
								`
							})

							window.dispatchEvent(
								new CustomEvent('RETRIEVE_TRANSFERRED_DATA', {
									detail: Json.getContentSize(streamedDataRef.current)
								})
							)
						} catch (error) {
							console.log(error.message)
							return
						}
					},
					onerror(e) {
						toast.error(t('ns_common:notification.error'), { id: 'FETCH_SSE' })
						writeLog({
							message: /* template */ `GET /rfid/read-epc <span class='text-destructive font-medium'>500</span> ~ ${Json.getContentSize(e.message)} kB`,
							type: 'error'
						})
					}
				})
					.then(() => true)
					.catch(() => toast('Failed to connect', { id: 'FETCH_SSE' }))
					.finally(() => {
						window.removeEventListener('RETRIEVE_TRANSFERRED_DATA', null)
						toast.info('Disconnected', { id: 'FETCH_SSE' })
					})
				return
			}
		}

		return () => {
			ctrlRef.current.abort()
		}
	}, [scanningStatus, connection, pollingDuration])

	// * Triggered when incomming message comes
	useDeepCompareEffect(() => {
		if (isEqual(previousEpc, incommingEpc)) {
			setScannedEpc({
				...scannedEpc,
				...incommingEpc,
				data: uniqBy([...incommingEpc.data, ...scannedEpc.data], 'epc')
			})
		} else {
			setSelectedOrder('all')
			setScannedEpc(incommingEpc)
		}

		window.dispatchEvent(
			new CustomEvent('RETRIEVE_LATENCY', {
				detail: performance.now() - previousTime - 1000
			})
		)
	}, [incommingEpc, previousEpc, currentTime])

	// * Triggered when page changes
	useAsyncEffect(async () => {
		try {
			if (page === null) return
			const { metadata } = await runAsync()
			setScannedEpc({
				...metadata.epcs,
				data: uniqBy([...scannedEpc.data, ...metadata.epcs.data], 'epc')
			})
		} catch {
			toast.error(t('ns_common:notification.error'))
		}
	}, [page])

	// * Triggered when selected order changes
	useAsyncEffect(async () => {
		try {
			const { metadata } = await runAsync()
			const previousFilteredEpc = scannedEpc.data.filter((e) => e.mo_no === selectedOrder)
			setScannedEpc({
				...metadata.epcs,
				data: uniqBy([...previousFilteredEpc, ...metadata.epcs.data], 'epc')
			})
		} catch {
			toast.error(t('ns_common:notification.error'))
		}
	}, [selectedOrder])

	// Only trigger
	useDeepCompareEffect(() => {
		if (scanningStatus === 'connected' && scannedOrders?.length > 3 && !isTooManyOrderFoundIgnoredRef.current)
			toast.warning('Oops !!!', {
				description: t('ns_inoutbound:notification.too_many_mono'),
				icon: <Icon name='TriangleAlert' className='stroke-destructive' />,
				closeButton: true,
				duration: Infinity,
				id: 'TOO_MANY_ORDERS',
				onDismiss: () => {
					isTooManyOrderFoundIgnoredRef.current = true
				},
				action: {
					label: 'Dismiss',
					onClick: () => toast.dismiss('TOO_MANY_ORDERS')
				}
			})
		else toast.dismiss('TOO_MANY_ORDERS')
	}, [scannedOrders, scanningStatus])

	const [virtualItems] = useVirtualList(scannedEpc.data, {
		containerTarget: containerRef,
		wrapperTarget: wrapperRef,
		itemHeight: VIRTUAL_ITEM_SIZE,
		overscan: PRERENDERED_ITEMS
	})

	return Array.isArray(scannedEpc.data) && scannedEpc.totalDocs > 0 ? (
		<List ref={containerRef}>
			<Div ref={wrapperRef}>
				{Array.isArray(virtualItems) &&
					virtualItems.map((virtualItem) => {
						return (
							<ListItem
								key={virtualItem.index}
								className={cn('hover:bg-secondary')}
								style={{ height: VIRTUAL_ITEM_SIZE }}>
								<Typography className='font-medium'>{virtualItem?.data?.epc}</Typography>
								<Typography variant='small' className='capitalize text-foreground'>
									{virtualItem?.data?.mo_no}
								</Typography>
							</ListItem>
						)
					})}
			</Div>
			{scannedEpc.hasNextPage && (
				<Button
					variant='link'
					className='w-full'
					onClick={() => setPage((prev) => (isNil(prev) ? DEFAULT_NEXT_CURSOR : prev + 1))}
					disabled={loading}>
					{loading ? 'Loading more ...' : 'Load more'}
				</Button>
			)}
		</List>
	) : (
		<Div className='z-10 grid h-full max-h-full min-h-[50dvh] place-content-center lg:max-h-[70dvh] xl:max-h-[70dvh] xxl:max-h-[65dvh]'>
			<Div className='inline-flex items-center gap-x-4'>
				<Icon name='Inbox' stroke='hsl(var(--muted-foreground))' size={32} strokeWidth={1} />
				<Typography color='muted'>Empty</Typography>
			</Div>
		</Div>
	)
}

const List = tw.div`flex z-10 h-full flex-col items-stretch divide-y divide-border overflow-y-scroll p-2 scrollbar lg:max-h-[70dvh] xl:max-h-[70dvh] xxl:max-h-[65dvh] max-h-[50dvh]`
const ListItem = tw.div`px-4 py-2 h-10 flex justify-between uppercase transition-all duration-75 rounded border-b last:border-none whitespace-nowrap`

export default EpcDataList
