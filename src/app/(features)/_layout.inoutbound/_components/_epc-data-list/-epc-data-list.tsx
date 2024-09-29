import { RequestMethod } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import { IElectronicProductCode } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import env from '@/common/utils/env'
import { Button, Div, Icon, Typography } from '@/components/ui'
import axiosInstance from '@/configs/axios.config'
import { AuthService } from '@/services/auth.service'
import { EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source'
import { FetchQueryOptions, useQueryClient } from '@tanstack/react-query'
import { useAsyncEffect, useDeepCompareEffect, usePrevious, useVirtualList } from 'ahooks'
import { AxiosError, HttpStatusCode } from 'axios'
import { isNil, omitBy, pick, uniqBy } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { INCOMING_DATA_CHANGE } from '../../_constants/event.const'
import { useListBoxContext } from '../../_contexts/-list-box.context'
import { DEFAULT_PROPS, OrderItem, OrderSize, usePageContext } from '../../_contexts/-page-context'

type StreamEventData = {
	epcs: Pagination<IElectronicProductCode>
	orders: OrderItem[]
	sizes: OrderSize[]
}

type FetchEpcQueryKey = ['EPC_DATA_LIST', number, string]

class RetriableError extends Error {}
class FatalError extends Error {}

const VIRTUAL_ITEM_SIZE = 40
const PRERENDERED_ITEMS = 5
const DEFAULT_NEXT_CURSOR = 2

const EpcDataList: React.FC = () => {
	const queryClient = useQueryClient()
	const { t } = useTranslation()
	const { user, token, setAccessToken } = useAuth()
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
	const previousSelectedOrder = usePrevious(selectedOrder)
	const { page, setPage, loading, setLoading } = useListBoxContext()
	const ctrlRef = useRef<AbortController>(new AbortController())
	const containerRef = useRef<HTMLDivElement>(null)
	const wrapperRef = useRef<HTMLDivElement>(null)
	const isTooManyOrderFoundIgnoredRef = useRef<boolean>(false)
	const [incommingEpc, setIncommingEpc] = useState<Pagination<IElectronicProductCode>>(scannedEpc)
	const previousEpc = usePrevious(incommingEpc)

	const fetchNextEpcQueryOptions: FetchQueryOptions<
		unknown,
		AxiosError<unknown, any>,
		ResponseBody<Pagination<IElectronicProductCode>>,
		FetchEpcQueryKey,
		unknown
	> = {
		queryKey: ['EPC_DATA_LIST', page, selectedOrder],
		queryFn: async () => {
			return await axiosInstance.get('/rfid/fetch-next-epc', {
				headers: { ['X-Database-Host']: connection },
				params: omitBy({ page: page, filter: selectedOrder }, (value) => !value || value === 'all')
			})
		},
		retry(failureCount) {
			return failureCount < 3
		}
	}

	const fetchServerEvent = async () => {
		ctrlRef.current = new AbortController()
		toast.loading('Establishing connection ...', { id: 'FETCH_SSE' })
		try {
			await fetchEventSource(env('VITE_API_BASE_URL') + '/rfid/fetch-epc', {
				method: RequestMethod.GET,
				headers: {
					['X-Database-Host']: connection,
					['X-Polling-Duration']: pollingDuration.toString(),
					['Authorization']: AuthService.getAccessToken()
				},
				signal: ctrlRef.current.signal,
				openWhenHidden: true,
				async onopen(response) {
					if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
						setScanningStatus('connected')
						writeLog({ message: 'Connected', type: 'info' })
						toast.success('Connected', { id: 'FETCH_SSE' })
						return
					} else if (response.status === HttpStatusCode.Unauthorized) {
						const response = await AuthService.refreshToken(user.id)
						const refreshToken = response.metadata
						if (!refreshToken) throw new FatalError('Failed to refresh token')
						setAccessToken(refreshToken)
						fetchServerEvent()
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
						if (!event.data) return
						const data = JSON.parse(event.data) as StreamEventData
						setIncommingEpc(data?.epcs)
						setScannedOrders(data?.orders)
						setScannedSizes(data?.sizes)
						writeLog({ type: 'info', message: 'Ok' })
						window.dispatchEvent(new CustomEvent(INCOMING_DATA_CHANGE, { detail: event.data }))
					} catch (error) {
						console.log(error.message)
						return
					}
				},
				onclose() {
					throw new RetriableError()
				},
				onerror(error) {
					toast.error(t('ns_common:notification.error'), { id: 'FETCH_SSE' })
					writeLog({ message: error.message, type: 'error' })
					if (error instanceof FatalError) throw error
					else throw new RetriableError()
				}
			})
		} catch (e) {
			toast('Failed to connect', { id: 'FETCH_SSE', description: e.message })
		} finally {
			toast.info('Disconnected', { id: 'FETCH_SSE' })
			window.removeEventListener(INCOMING_DATA_CHANGE, null)
		}
	}

	// Sync scanned result with fetched data from server while scanning is on and previous data is staled
	useEffect(() => {
		switch (scanningStatus) {
			case undefined: {
				setIncommingEpc(DEFAULT_PROPS.scannedEpc)
				queryClient.removeQueries({ queryKey: ['EPC_DATA_LIST'] })
				setPage(null)
				break
			}
			case 'disconnected': {
				ctrlRef.current.abort()
				writeLog({ message: 'Disconnected', type: 'info' })
				window.removeEventListener(INCOMING_DATA_CHANGE, null)
				break
			}
			case 'connecting': {
				fetchServerEvent()
				break
			}
			default: {
				break
			}
		}
	}, [scanningStatus, connection, pollingDuration])

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
			setSelectedOrder('all')
			setScannedEpc(incommingEpc)
		}
	}, [incommingEpc, previousEpc])

	const fetchNextPage = async (page) => {
		if (!page || !connection) return
		try {
			setLoading(true)
			const { metadata } = await queryClient.fetchQuery(fetchNextEpcQueryOptions)
			const previousData = scannedEpc?.data ?? []
			const newData = metadata?.data ?? []

			setScannedEpc({
				...metadata,
				data: uniqBy([...previousData, ...newData], 'epc')
			})
		} finally {
			setLoading(false)
		}
	}

	const fetchBySelectedOrder = async (selectedOrder: string) => {
		if (!connection || typeof previousSelectedOrder === 'undefined' || typeof selectedOrder === 'undefined') return
		try {
			setLoading(true)
			const { metadata } = await queryClient.fetchQuery(fetchNextEpcQueryOptions)
			const previousFilteredEpc = scannedEpc?.data.filter((e) => e.mo_no === selectedOrder)
			const nextFilteredEpc = metadata?.data ?? []
			setScannedEpc({
				...metadata,
				data: uniqBy([...previousFilteredEpc, ...nextFilteredEpc], 'epc')
			})
		} finally {
			setLoading(false)
		}
	}

	// * On page changes
	useAsyncEffect(async () => await fetchNextPage(page), [page, connection, token])

	// * On selected order changes
	useAsyncEffect(async () => await fetchBySelectedOrder(selectedOrder), [selectedOrder, connection, token])

	// * On too many order found
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

	const [virtualItems] = useVirtualList(scannedEpc?.data, {
		containerTarget: containerRef,
		wrapperTarget: wrapperRef,
		itemHeight: VIRTUAL_ITEM_SIZE,
		overscan: PRERENDERED_ITEMS
	})

	return (
		<Div className='flex flex-1 basis-full items-center justify-center'>
			{Array.isArray(scannedEpc.data) && scannedEpc.totalDocs > 0 ? (
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
				<Div className='z-10 grid h-full max-h-[65dvh] place-content-center sm:max-h-[50dvh] md:max-h-[50dvh] group-has-[#toggle-fullscreen[data-state=checked]]:xxl:max-h-[75dvh]'>
					<Div className='inline-flex items-center gap-x-4'>
						<Icon name='Inbox' stroke='hsl(var(--muted-foreground))' size={32} strokeWidth={1} />
						<Typography color='muted'>Empty</Typography>
					</Div>
				</Div>
			)}
		</Div>
	)
}

const List = tw.div`bg-background flex w-full z-10 h-full flex-col items-stretch divide-y divide-border overflow-y-scroll p-2 scrollbar max-h-[65dvh] group-has-[#toggle-fullscreen[data-state=checked]]:xxl:max-h-[75dvh] md:max-h-[50dvh] sm:max-h-[50dvh]`
const ListItem = tw.div`px-4 py-2 h-10 flex justify-between uppercase transition-all duration-75 rounded border-b last:border-none whitespace-nowrap`

export default EpcDataList
