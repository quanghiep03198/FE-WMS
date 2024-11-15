import { INCOMING_DATA_CHANGE } from '@/app/(features)/_constants/event.const'
import { RequestMethod } from '@/common/constants/enums'
import { FatalError, RetriableError } from '@/common/errors'
import { useAuth } from '@/common/hooks/use-auth'
import { IElectronicProductCode } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import env from '@/common/utils/env'
import { Json } from '@/common/utils/json'
import { Button, Div, Icon, Typography } from '@/components/ui'
import { AuthService } from '@/services/auth.service'
import { EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source'
import {
	useAsyncEffect,
	useDeepCompareEffect,
	useLocalStorageState,
	useMemoizedFn,
	usePrevious,
	useVirtualList
} from 'ahooks'
import { HttpStatusCode } from 'axios'
import { uniqBy } from 'lodash'
import { Fragment, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import isEqual from 'react-fast-compare'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useGetEpcQuery } from '../../_apis/rfid.api'
// import { RFIDSettings } from '../../_constants/rfid.const'
import { AppConfigs } from '@/configs/app.config'
import { FP_RFID_SETTINGS_KEY } from '../../_constants/rfid.const'
import { DEFAULT_PROPS, usePageContext } from '../../_contexts/-page-context'

import { RFIDStreamEventData } from '@/app/_shared/_types/rfid'
import { DEFAULT_FP_RFID_SETTINGS, RFIDSettings } from '../../index.lazy'

const VIRTUAL_ITEM_SIZE = 40
const PRERENDERED_ITEMS = 5
const DEFAULT_NEXT_CURSOR = 2
const SSE_TOAST_ID = 'FETCH_SSE'
const TOO_MANY_ORDER_TOAST = 'TOO_MANY_ORDERS'

const EpcDataList: React.FC = () => {
	const { t } = useTranslation()
	const { user, setAccessToken } = useAuth()

	const {
		currentPage,
		connection,
		scannedEpc,
		scanningStatus,
		scannedOrders,
		selectedOrder,
		setCurrentPage,
		setScanningStatus,
		setScannedEpc,
		setScannedOrders,
		setSelectedOrder,
		writeLog
	} = usePageContext(
		'currentPage',
		'connection',
		'scannedEpc',
		'scanningStatus',
		'scannedOrders',
		'selectedOrder',
		'setCurrentPage',
		'setScanningStatus',
		'setScannedEpc',
		'setScannedOrders',
		'setSelectedOrder',
		'writeLog'
	)

	// * Abort controller to control fetch event source
	const abortControllerRef = useRef<AbortController>(new AbortController())

	// * Previous time reference
	const previousTimeRef = useRef<number>(performance.now())

	// * Polling duration for SSE
	const [settings] = useLocalStorageState<RFIDSettings>(FP_RFID_SETTINGS_KEY)

	// * Alert for invalid EPCs
	const [hasInvalidEpcAlert, setHasInvalidEpcAlert] = useState<boolean>(false)

	// * Incomming EPCs data from server-sent event
	const [incommingEpc, setIncommingEpc] = useState<Pagination<IElectronicProductCode>>(scannedEpc)
	// * Previous scanned EPCs
	const previousEpc = usePrevious(incommingEpc)

	// * Virtual list refs
	const containerRef = useRef<HTMLDivElement>(null)
	const wrapperRef = useRef<HTMLDivElement>(null)

	// * Ignore too many orders warning
	const isTooManyOrdersDimssiedRef = useRef<boolean>(false)
	const isInvalidEpcDismissedRef = useRef<boolean>(false)

	const { refetch: manualFetchEpc, isFetching } = useGetEpcQuery()

	const pollingDuration = settings?.pollingDuration ?? DEFAULT_FP_RFID_SETTINGS.pollingDuration

	// * Fetch server-sent event
	const fetchServerEvent = useMemoizedFn(async () => {
		abortControllerRef.current = new AbortController()
		toast.loading(t('ns_common:notification.establish_connection'), { id: SSE_TOAST_ID })
		try {
			await fetchEventSource(env('VITE_API_BASE_URL') + '/rfid/fp-inventory/sse', {
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
						toast.success(t('ns_common:status.connected'), { id: SSE_TOAST_ID })
						writeLog({ message: 'Connected', type: 'info' })
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
						const data = JSON.parse(event.data) as RFIDStreamEventData
						setIncommingEpc(data?.epcs)
						setScannedOrders(data?.orders)
						setHasInvalidEpcAlert(data?.has_invalid_epc)
						writeLog({
							type: 'info',
							message: /* template */ `
								<span>[SSE] /api/rfid/fetch-epc/sse</span>  
								<span class='text-success'>200</span> ~ 
								<span>${(performance.now() - previousTimeRef.current).toFixed(2)} ms</span> - 
								<span>${Json.getContentSize(event.data, 'kilobyte')}</span>
								`
						})
						previousTimeRef.current = performance.now()
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
					writeLog({
						message: /* template */ `
							<span>GET /api/rfid/fetch-epc/sse</span>
							<span class='text-destructive'>${error.status}</span>
							<br/>
							<span>${error.message}</span>`,
						type: 'error'
					})
					// * Depend on error type, retry or not
					if (error instanceof FatalError) throw error
					else throw new RetriableError()
				}
			})
		} catch (e) {
			toast('Failed to connect', { id: SSE_TOAST_ID, description: e.message })
		} finally {
			setScanningStatus('disconnected')
			toast.info(t('ns_common:status.disconnected'), { id: SSE_TOAST_ID })
			window.removeEventListener(INCOMING_DATA_CHANGE, null)
		}
	})

	// * Triggered when scanning status changes
	useDeepCompareEffect(() => {
		switch (scanningStatus) {
			case undefined: {
				setIncommingEpc(DEFAULT_PROPS.scannedEpc)
				setCurrentPage(null)
				setHasInvalidEpcAlert(false)
				isInvalidEpcDismissedRef.current = false
				isTooManyOrdersDimssiedRef.current = false
				break
			}
			case 'disconnected': {
				abortControllerRef.current.abort()
				writeLog({ message: 'Disconnected', type: 'info' })
				window.removeEventListener(INCOMING_DATA_CHANGE, null)
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

	// * On page changes and manual fetch epc query is not running
	useAsyncEffect(async () => {
		if (!connection || !scanningStatus) return
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

	// * On selected order changes and manual fetch epc query is not running
	useAsyncEffect(async () => {
		if (!connection || !scanningStatus) return
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

	// * On too many order found
	useEffect(() => {
		if (!isTooManyOrdersDimssiedRef.current && scannedOrders?.length > 3 && scanningStatus === 'connected')
			toast.warning('Oops !!!', {
				id: TOO_MANY_ORDER_TOAST,
				description: t('ns_inoutbound:notification.too_many_mono'),
				icon: <Icon name='TriangleAlert' className='stroke-destructive' />,
				action: {
					label: t('ns_common:actions.dismiss'),
					type: 'button',
					onClick: () => {
						toast.dismiss(TOO_MANY_ORDER_TOAST)
						isTooManyOrdersDimssiedRef.current = true
					}
				}
			})
		else toast.dismiss(TOO_MANY_ORDER_TOAST)
	}, [scannedOrders, isTooManyOrdersDimssiedRef, scanningStatus])

	// * Intitialize virtual list to render scanned EPC data
	const [virtualItems] = useVirtualList(scannedEpc?.data, {
		containerTarget: containerRef,
		wrapperTarget: wrapperRef,
		itemHeight: VIRTUAL_ITEM_SIZE,
		overscan: PRERENDERED_ITEMS
	})

	return (
		<Fragment>
			{hasInvalidEpcAlert &&
				createPortal(
					<Alert>
						<Icon name='TriangleAlert' size={36} className='stroke-destructive-foreground' />
						<AlertContent>
							<AlertTitle>Alert</AlertTitle>
							<AlertDescription>
								Invalid EPC detected. Please contact to shaping department for this issue, then move them to
								recycle
							</AlertDescription>
						</AlertContent>
						{scanningStatus !== 'connected' && (
							<AlertClose
								onClick={() => {
									isInvalidEpcDismissedRef.current = true
									setHasInvalidEpcAlert(false)
								}}>
								<Icon name='X' />
							</AlertClose>
						)}
					</Alert>,
					document.body
				)}
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
				<Div className='z-10 grid h-[50dvh] place-content-center group-has-[#toggle-fullscreen[data-state=checked]]:xl:max-h-[75dvh] xxl:h-[65dvh]'>
					<Div className='inline-flex items-center gap-x-4'>
						<Icon name='Inbox' stroke='hsl(var(--muted-foreground))' size={32} strokeWidth={1} />
						<Typography color='muted'> {t('ns_common:table.no_data')}</Typography>
					</Div>
				</Div>
			)}
		</Fragment>
	)
}

const List = tw.div`bg-background flex w-full z-10 min-h-full flex-col items-stretch divide-y divide-border overflow-y-scroll p-2 scrollbar h-[50dvh] xxl:h-[65dvh] group-has-[#toggle-fullscreen[data-state=checked]]:xxl:h-[75dvh]`
const ListItem = tw.div`px-4 py-2 h-10 flex justify-between uppercase transition-all duration-75 rounded border-b last:border-none whitespace-nowrap`
const Alert = tw.div`fixed top-0 left-0 right-auto flex items-center w-full bg-destructive text-destructive-foreground px-4 py-3 z-50 gap-3`
const AlertContent = tw.div`inline-flex flex-col`
const AlertTitle = tw.h5`font-medium`
const AlertDescription = tw.p`text-sm`
const AlertClose = tw.button`ml-auto self-start`

export default EpcDataList
