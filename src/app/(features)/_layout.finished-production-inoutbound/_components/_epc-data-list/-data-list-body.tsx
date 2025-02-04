'use no memo'

import { INCOMING_DATA_CHANGE } from '@/app/(features)/_constants/event.const'
import { RequestHeaders, RequestMethod } from '@/common/constants/enums'
import { FatalError, RetriableError } from '@/common/errors'
import { useAuth } from '@/common/hooks/use-auth'
import { useScrollToFn } from '@/common/hooks/use-scroll-fn'
import { IElectronicProductCode } from '@/common/types/entities'
import env from '@/common/utils/env'
import { Button, Div, Icon, Typography } from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { AppConfigs } from '@/configs/app.config'
import { AuthService } from '@/services/auth.service'
import { EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useAsyncEffect, useDeepCompareEffect, useLocalStorageState, usePrevious, useUpdateEffect } from 'ahooks'
import { HttpStatusCode } from 'axios'
import { uniqBy } from 'lodash'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import isEqual from 'react-fast-compare'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useGetEpcQuery } from '../../_apis/rfid.api'
import { FP_RFID_SETTINGS_KEY } from '../../_constants/rfid.const'
import { DEFAULT_PROPS, usePageContext } from '../../_contexts/-page-context'
import { RFIDStreamEventData } from '../../_types'
import createLogger from '../../_utils/log.util'
import { DEFAULT_FP_RFID_SETTINGS, RFIDSettings } from '../../index.lazy'

const VIRTUAL_ITEM_SIZE = 40
const PRERENDERED_ITEMS = 20
const DEFAULT_NEXT_CURSOR = 2
const SSE_TOAST_ID = 'FETCH_SSE'
const POLLING_DATA_TOAST_ID = 'POLLING_DATA'

const EpcDataList: React.FC = () => {
	const { t } = useTranslation()
	const { user, token, setAccessToken } = useAuth()

	const {
		currentPage,
		selectedOrder,
		connection,
		scannedEpc,
		scanningStatus,
		setCurrentPage,
		setScanningStatus,
		setScannedEpc,
		setScannedOrders,
		setSelectedOrder,
		writeLog,
		reset
	} = usePageContext(
		'currentPage',
		'selectedOrder',
		'connection',
		'scannedEpc',
		'scanningStatus',
		'setCurrentPage',
		'setScanningStatus',
		'setScannedEpc',
		'setScannedOrders',
		'setSelectedOrder',
		'writeLog',
		'reset'
	)

	// * Abort controller to control fetch event source
	const abortControllerRef = useRef<AbortController>(new AbortController())

	// * Previous time reference
	const previousTimeRef = useRef<number>(performance.now())

	// * Polling duration for SSE
	const [settings] = useLocalStorageState<RFIDSettings>(FP_RFID_SETTINGS_KEY, { listenStorageChange: true })

	// * Alert for invalid EPCs
	const [hasInvalidEpcAlert, setHasInvalidEpcAlert] = useState<boolean>(false)

	// * Incomming EPCs data from server-sent event
	const [incommingEpc, setIncommingEpc] = useState<Pagination<IElectronicProductCode>>(scannedEpc)
	// * Previous scanned EPCs
	const previousEpc = usePrevious(incommingEpc)

	// * Virtual list refs
	const containerRef = useRef<HTMLDivElement>(null)
	const scrollingRef = useRef<number>(null)

	const isInvalidEpcDismissedRef = useRef<boolean>(false)
	const incommingMessageCountRef = useRef<number>(0)

	// * Manual fetch EPC
	const { data: retrievedEpcData, refetch: manualFetchEpc, isFetching } = useGetEpcQuery()

	const pollingDuration = settings?.pollingDuration ?? DEFAULT_FP_RFID_SETTINGS.pollingDuration

	// * Fetch server-sent event
	const fetchServerEvent = async () => {
		abortControllerRef.current = new AbortController()
		toast.loading(t('ns_common:notification.establish_connection'), { id: SSE_TOAST_ID })
		try {
			await fetchEventSource(env('VITE_API_BASE_URL') + '/rfid/sse', {
				method: RequestMethod.GET,
				headers: {
					[RequestHeaders.AUTHORIZATION]: `Bearer ${token}`,
					[RequestHeaders.TENANT_ID]: connection,
					[RequestHeaders.USER_COMPANY]: user.company_code,
					[RequestHeaders.POLLING_DURATION]: String(pollingDuration)
				},
				signal: abortControllerRef.current.signal,
				openWhenHidden: true,
				async onopen(response) {
					if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
						if (scanningStatus === 'connecting') {
							setScanningStatus('connected')
							toast.success(t('ns_common:status.connected'), { id: SSE_TOAST_ID })
							writeLog({ message: 'Connected', type: 'info' })
							toast.loading(t('ns_common:notification.receiving_data'), { id: POLLING_DATA_TOAST_ID })
						}
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
						if (!event.data) {
							incommingMessageCountRef.current = 0
							return
						}
						incommingMessageCountRef.current++
						if (incommingMessageCountRef.current === 1) {
							toast.success(t('ns_common:notification.success'), { id: POLLING_DATA_TOAST_ID })
						}
						const data = JSON.parse(event.data) as RFIDStreamEventData
						setIncommingEpc(data?.epcs)
						setScannedOrders(data?.orders)

						writeLog({
							type: 'info',
							message: createLogger({
								status: 200,
								duration: performance.now() - previousTimeRef.current,
								data: event.data
							})
						})
						previousTimeRef.current = performance.now()
						window.dispatchEvent(new CustomEvent(INCOMING_DATA_CHANGE, { detail: event.data }))
					} catch (error) {
						throw new FatalError(error)
					}
				},
				onclose() {
					throw new RetriableError()
				},
				onerror(error) {
					setScanningStatus('disconnected')
					toast.error(t('ns_common:notification.error'), { id: SSE_TOAST_ID })
					writeLog({
						type: 'error',
						message: createLogger({
							status: error.status ?? HttpStatusCode.InternalServerError,
							duration: performance.now() - previousTimeRef.current,
							data: error.message
						})
					})
					// * Depend on error type, retry or not
					if (error instanceof FatalError) throw error
					else throw new RetriableError()
				}
			})
		} catch (e) {
			toast('Failed to connect', { id: SSE_TOAST_ID, description: e.message })
		} finally {
			toast.info(t('ns_common:status.disconnected'), { id: SSE_TOAST_ID })
			window.removeEventListener(INCOMING_DATA_CHANGE, null)
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
	}, [scanningStatus, token])

	useUpdateEffect(() => {
		setScanningStatus(DEFAULT_PROPS.scanningStatus)
	}, [user?.company_code])

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
			setHasInvalidEpcAlert(
				Array.isArray(incommingEpc?.data) && incommingEpc.data.some((item) => item.epc.includes('E28'))
			)
			setSelectedOrder(DEFAULT_PROPS.selectedOrder)
			setScannedEpc(incommingEpc)
		}
	}, [incommingEpc, previousEpc])

	// * On current page changes with value greater than default (1 or null)
	useAsyncEffect(async () => {
		if (!connection || !scanningStatus || currentPage === DEFAULT_PROPS.currentPage || currentPage === null) return
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

	useEffect(() => {
		if (Array.isArray(retrievedEpcData) && typeof scanningStatus !== 'undefined')
			setScannedEpc({ ...retrievedEpcData, data: uniqBy([...scannedEpc.data, ...retrievedEpcData.data], 'epc') })
	}, [retrievedEpcData])

	const scrollToFn = useScrollToFn(containerRef, scrollingRef)

	// * Intitialize virtual list to render scanned EPC data
	const virtualizer = useVirtualizer({
		count: scannedEpc.data.length,
		getScrollElement: () => containerRef.current,
		scrollToFn: (...args) => scrollToFn(...args),
		estimateSize: useCallback(() => VIRTUAL_ITEM_SIZE, []),
		measureElement:
			typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
				? (element) => element?.getBoundingClientRect().height
				: undefined,
		overscan: PRERENDERED_ITEMS
	})

	return (
		<Fragment>
			{hasInvalidEpcAlert &&
				createPortal(
					<Alert>
						<Icon name='TriangleAlert' size={36} className='stroke-destructive-foreground' />
						<AlertContent>
							<AlertTitle>{t('ns_common:titles.caution')}</AlertTitle>
							<AlertDescription>{t('ns_inoutbound:notification.invalid_epc_deteted')}</AlertDescription>
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
				<ScrollShadow
					ref={containerRef}
					className='z-10 flex h-[400px] w-full flex-col items-stretch justify-start divide-y divide-border bg-background p-2 @[1000px]:h-[475px] @[1400px]:h-[500px] @[1500px]:h-[625px]'>
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
									className='absolute left-auto right-auto top-0 flex h-10 w-full justify-between whitespace-nowrap rounded border-b px-4 py-2 uppercase transition-all duration-75 last:border-none hover:bg-secondary'
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
								{isFetching ? 'Loading more ...' : 'Load more'}
							</Button>
						)}
					</Div>
				</ScrollShadow>
			) : (
				<Div className='z-10 grid h-[500px] place-content-center group-has-[#toggle-fullscreen[data-state=checked]]:xl:max-h-[625px] xxl:h-[625px]'>
					<Div className='inline-flex items-center gap-x-4'>
						<Icon name='Inbox' stroke='hsl(var(--muted-foreground))' size={32} strokeWidth={1} />
						<Typography color='muted'> {t('ns_common:table.no_data')}</Typography>
					</Div>
				</Div>
			)}
		</Fragment>
	)
}

const Alert = tw.div`fixed top-0 left-0 right-auto flex items-center w-full bg-destructive text-destructive-foreground px-4 py-3 z-50 gap-3`
const AlertContent = tw.div`inline-flex flex-col`
const AlertTitle = tw.h5`font-medium`
const AlertDescription = tw.p`text-sm`
const AlertClose = tw.button`ml-auto self-start`

export default EpcDataList
