import { INCOMING_DATA_CHANGE } from '@/app/(features)/_constants/event.const'
import { RequestMethod } from '@/common/constants/enums'
import { FatalError, RetriableError } from '@/common/errors'
import { useAuth } from '@/common/hooks/use-auth'
import useQueryParams from '@/common/hooks/use-query-params'
import { IElectronicProductCode } from '@/common/types/entities'
import env from '@/common/utils/env'
import { Button, Div, Icon, Typography } from '@/components/ui'
import { AuthService } from '@/services/auth.service'
import { type EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source'
import { useAsyncEffect, useDeepCompareEffect, useLocalStorageState, usePrevious, useVirtualList } from 'ahooks'
import { HttpStatusCode } from 'axios'
import { omit, uniqBy } from 'lodash'
import qs from 'qs'
import { useEffect, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { DEFAULT_PM_RFID_SETTINGS, RFIDSettings } from '../..'
import { FALLBACK_ORDER_VALUE, useGetEpcQuery } from '../../_apis/rfid.api'
import { PM_RFID_SETTINGS_KEY } from '../../_constants/index.const'
import { DEFAULT_PROPS, usePageContext } from '../../_contexts/-page-context'

const VIRTUAL_ITEM_SIZE = 40
const PRERENDERED_ITEMS = 5
const DEFAULT_NEXT_CURSOR = 2
const SSE_TOAST_ID = 'FETCH_SSE'

const DataListBody: React.FC = () => {
	const { t } = useTranslation()
	const {
		currentPage,
		scannedEpc,
		scanningStatus,
		selectedOrder,
		connection,
		setScanningStatus,
		setScannedEpc,
		setCurrentPage,
		setScannedOrders
	} = usePageContext(
		'currentPage',
		'scannedEpc',
		'scannedOrders',
		'scanningStatus',
		'selectedOrder',
		'connection',
		'setScanningStatus',
		'setScannedEpc',
		'setScannedOrders',
		'setCurrentPage'
	)
	const { searchParams } = useQueryParams()

	// * Fetch EPC query
	const { refetch: manualFetchEpc, isFetching } = useGetEpcQuery(searchParams.process)

	const { user, setAccessToken } = useAuth()
	// * Incomming EPCs data from server-sent event
	const [incommingEpc, setIncommingEpc] = useState<Pagination<IElectronicProductCode>>(scannedEpc)
	// * Previous scanned EPCs
	const previousEpc = usePrevious(incommingEpc)

	// * Abort controller ref
	const abortControllerRef = useRef<AbortController>(new AbortController())

	const [settings] = useLocalStorageState<RFIDSettings>(PM_RFID_SETTINGS_KEY, {
		listenStorageChange: true
	})
	const pollingDuration = settings?.pollingDuration ?? DEFAULT_PM_RFID_SETTINGS.pollingDuration

	const fetchServerEvent = async () => {
		abortControllerRef.current = new AbortController()
		toast.loading(t('ns_common:notification.establish_connection'), { id: SSE_TOAST_ID })
		try {
			await fetchEventSource(
				env('VITE_API_BASE_URL') + '/rfid/pm-inventory/sse' + qs.stringify(searchParams, { addQueryPrefix: true }),
				{
					method: RequestMethod.GET,
					headers: {
						['Authorization']: AuthService.getAccessToken(),
						['X-Tenant-Id']: connection,
						['X-User-Company']: user.company_code,
						['X-Polling-Duration']: String(pollingDuration)
					},
					signal: abortControllerRef.current.signal,
					openWhenHidden: true,
					async onopen(response) {
						if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
							setScanningStatus('connected')
							toast.success('Connected', { id: SSE_TOAST_ID })
							return
						} else if (response.status === HttpStatusCode.Unauthorized) {
							const response = await AuthService.refreshToken(user.id)
							const refreshToken = response.metadata
							if (!refreshToken) throw new FatalError('Failed to refresh token')
							// * If refresh token is success, set new access token and retry to trigger fetch server-sent event with the new one
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
							const data = JSON.parse(event.data)
							setIncommingEpc(data?.epcs)
							setScannedOrders(data?.orders)
							window.dispatchEvent(new CustomEvent(INCOMING_DATA_CHANGE, { detail: event.data }))
						} catch (error) {
							console.error(error.message)
							return
						}
					},
					onclose() {
						throw new RetriableError()
					},
					onerror(error) {
						toast.error(t('ns_common:notification.error'), { id: SSE_TOAST_ID })

						// * Depend on error type, retry or not
						if (error instanceof FatalError) throw error
						else throw new RetriableError()
					}
				}
			)
		} catch (e) {
			toast('Failed to connect', { id: 'FETCH_SSE', description: e.message })
		} finally {
			setScanningStatus('disconnected')
			toast.info('Disconnected', { id: 'FETCH_SSE' })
			window.removeEventListener(INCOMING_DATA_CHANGE, null)
		}
	}

	// * Triggered when scanning status changes
	useEffect(() => {
		switch (scanningStatus) {
			case undefined: {
				setIncommingEpc(DEFAULT_PROPS.scannedEpc)
				setCurrentPage(null)
				break
			}
			case 'disconnected': {
				abortControllerRef.current.abort()
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
	}, [scanningStatus])

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
			setScannedEpc(incommingEpc)
		}
	}, [incommingEpc, previousEpc])

	// * On page changes and manual fetch epc query is not running
	useAsyncEffect(async () => {
		if (!connection || !scanningStatus) return
		try {
			const { data: metadata } = await manualFetchEpc()
			const previousPageData = scannedEpc?.data ?? []
			const nextPageData = metadata?.epcs?.data ?? []

			setScannedEpc({
				...metadata?.epcs,
				data: uniqBy([...previousPageData, ...nextPageData], 'epc')
			})
		} catch {
			throw new RetriableError()
		}
	}, [currentPage])

	// * On selected order changes and manual fetch epc query is not running
	useAsyncEffect(async () => {
		if (!connection || !scanningStatus) return
		try {
			const { data: metadata } = await manualFetchEpc()
			const previousFilteredEpc = scannedEpc?.data.filter((e) => e.mo_no === selectedOrder)
			const nextFilteredEpc = metadata?.epcs?.data ?? []
			setScannedEpc({
				...omit(metadata?.epcs, 'data'),
				data: uniqBy([...previousFilteredEpc, ...nextFilteredEpc], 'epc')
			})
		} catch {
			throw new RetriableError()
		}
	}, [selectedOrder])

	// * Virtual list refs
	const containerRef = useRef<HTMLDivElement>(null)
	const wrapperRef = useRef<HTMLDivElement>(null)
	const [virtualItems] = useVirtualList(scannedEpc?.data, {
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
							<ListItem key={virtualItem.index} style={{ height: VIRTUAL_ITEM_SIZE }}>
								<Typography className='font-medium'>{virtualItem?.data?.epc}</Typography>
								<Typography variant='small' className='capitalize text-foreground'>
									{virtualItem?.data?.mo_no ?? FALLBACK_ORDER_VALUE}
								</Typography>
							</ListItem>
						)
					})}
			</Div>
			{scannedEpc.hasNextPage && (
				<Button
					variant='link'
					className='w-full'
					onClick={() => {
						if (!currentPage) setCurrentPage(DEFAULT_NEXT_CURSOR)
						else setCurrentPage(currentPage + 1)
					}}
					disabled={isFetching}>
					{isFetching ? 'Loading more ...' : 'Load more'}
				</Button>
			)}
		</List>
	) : (
		<Div className='z-10 grid h-[40vh] place-content-center xxl:h-[45vh]'>
			<Div className='inline-flex items-center gap-x-4'>
				<Icon name='Inbox' stroke='hsl(var(--muted-foreground))' size={32} strokeWidth={1} />
				<Typography color='muted'> {t('ns_common:table.no_data')}</Typography>
			</Div>
		</Div>
	)
}

const List = tw.div`bg-background flex w-full z-10 flex-col items-stretch divide-y divide-border overflow-y-scroll p-2 scrollbar xxl:h-[45vh] h-[40vh] min-h-full`
const ListItem = tw.div`px-4 py-2 h-10 flex justify-between uppercase transition-all duration-75 rounded border-b last:border-none whitespace-nowrap hover:bg-accent/50`

export default DataListBody
