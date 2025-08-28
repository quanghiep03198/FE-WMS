import { useGetAgentIPv4 } from '@/app/-hooks/use-agent-ipv4'
import { CommonActions } from '@/common/constants/enums'
import useScrollToFn from '@/common/hooks/use-scroll-fn'
import { cn } from '@/common/utils/cn'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Json } from '@/common/utils/json'
import { Button, Div, Icon, Typography } from '@/components/ui'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useInterval, useMemoizedFn, useRafState, useReactive } from 'ahooks'
import mqtt from 'mqtt'
import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePageContext } from '../../-contexts/page-context'
import ReaderSettingSheet from './reader-setting-sheet'

// type RFIDAgentConnectionState = Record<'signal', 'connecting' | 'disconnecting'>
// type RFIDAgentConnectionAction = Record<'signal', 'connect' | 'disconnect'>
// type RFIDAgentPlaystateState = Record<'signal', 'playing' | 'pausing'>
// type RFIDAgentPlaystateAction = Record<'signal', 'play' | 'pause'>

const VIRTUAL_ITEM_SIZE = 40
const PRERENDERED_ITEMS = 5
const WS_MQTT_PORT = 9001

const mqttSocket = ({ host, port }: { host: string; port: number }): `ws://${string}:${number}` =>
	`ws://${host}:${port}`

const ScannedEpcList: React.FC = () => {
	const [scannedEpcs, setScannedEpcs] = useRafState<Array<string>>([])
	const { data: agent } = useGetAgentIPv4()
	const clientRef = useRef<mqtt.MqttClient>(null)
	const buffer = useRef<Set<string>>(new Set())
	const connectionStatus = useReactive({
		isMQTTConnectionReady: false,
		isReaderConnectionReady: false,
		isReaderPlaying: false
	})
	const isConnectionReady = useMemo(() => {
		return Object.values(connectionStatus).every(Boolean)
	}, [connectionStatus])

	if (!clientRef.current && !!agent) {
		clientRef.current = mqtt.connect(mqttSocket({ host: agent.ip, port: WS_MQTT_PORT }))
	}

	const handleConnectMQTT: mqtt.OnConnectCallback = useCallback((): void => {
		if (!clientRef.current) return
		clientRef.current.publish('rfid/signal', Json.stringify({ act: 'ping' }))
		clientRef.current.subscribeAsync('rfid/data')
		clientRef.current.subscribeAsync('rfid/signal-reply')
	}, [clientRef.current])

	const handleDisconnectMQTT: mqtt.OnDisconnectCallback = useCallback((): void => {
		toast.info('Stopped controlling the RFID reader')
	}, [clientRef.current])

	const handleMessageMQTT: mqtt.OnMessageCallback = useCallback(
		(topic: string, message: Buffer): void => {
			if (!clientRef.current) return

			const rawMessage = message.toString()
			switch (topic) {
				case 'rfid/data':
					buffer.current.add(rawMessage)
					break

				case 'rfid/signal-reply': {
					const data = Json.parse<typeof connectionStatus>(rawMessage)
					console.log(data)
					connectionStatus.isMQTTConnectionReady = data.isMQTTConnectionReady
					connectionStatus.isReaderConnectionReady = data.isReaderConnectionReady
					connectionStatus.isReaderPlaying = data.isReaderPlaying
					break
				}

				default:
					break
			}
		},
		[clientRef.current]
	)

	const handleResetData = useCallback(() => {
		if (!clientRef.current) return
		clientRef.current.publishAsync('rfid/data', Json.stringify({ act: 'reset' }))
		setScannedEpcs([])
	}, [clientRef.current])

	useInterval(
		() => {
			if (buffer.current.size > 0) {
				setScannedEpcs((prev) => [...buffer.current, ...prev])
				buffer.current.clear()
			}
		},
		50,
		{ immediate: isConnectionReady }
	)

	const publishMessage = useMemoizedFn((topic: string, message: string) => {
		if (!clientRef.current) return
		clientRef.current.publish(topic, message)
	})

	const { t } = useTranslation()
	const { event$ } = usePageContext()

	const containerRef = useRef<HTMLDivElement>(null)
	const scrollingRef = useRef<number>(null)

	const scrollToFn = useScrollToFn(containerRef, scrollingRef)
	const estimateSize = useCallback(() => VIRTUAL_ITEM_SIZE, [])
	const getScrollElement = useCallback(() => containerRef.current, [])

	useEffect(() => {
		if (!clientRef.current) return
		clientRef.current.on('connect', handleConnectMQTT)
		clientRef.current.on('disconnect', handleDisconnectMQTT)
		clientRef.current.on('message', handleMessageMQTT)

		return () => {
			clientRef.current.off('connect', handleConnectMQTT)
			clientRef.current.off('disconnect', handleDisconnectMQTT)
			clientRef.current.off('message', handleMessageMQTT)
			clientRef.current.end()
		}
	}, [])

	event$.useSubscription((e: { action: CommonActions; payload: [] }) => {
		if (e.action === CommonActions.SAVE) handleResetData()
	})

	// * Intitialize virtual list to render scanned EPC data
	const virtualizer = useVirtualizer({
		count: scannedEpcs.length,
		overscan: PRERENDERED_ITEMS,
		indexAttribute: 'data-index',
		useScrollendEvent: true,
		getScrollElement,
		scrollToFn,
		estimateSize
	})

	return (
		<Div className='flex h-full flex-col divide-y'>
			<Div className='flex h-[52px] items-center justify-between gap-x-2 px-4 py-2'>
				<Div className='inline-flex items-center gap-x-2 text-base'>
					<Typography className='inline-flex items-center gap-x-2 font-medium'>
						<Icon
							name='Dot'
							className={cn(
								'scale-50 rounded-full ring-8',
								isConnectionReady
									? 'bg-success fill-success stroke-success ring-success/30'
									: 'bg-warning fill-warning stroke-warning ring-warning/30'
							)}
						/>
						{t('ns_inoutbound:counter_box.label')}:
					</Typography>
					<Typography className='inline-flex gap-x-1 text-lg font-semibold'>
						{formatIntlNumber(scannedEpcs.length)}
						<Typography as='small' variant='small' className='text-xs font-medium'>
							prs
						</Typography>
					</Typography>
				</Div>
				<ReaderSettingSheet />
			</Div>

			{!connectionStatus.isMQTTConnectionReady ? (
				<Div className='flex h-full flex-col items-center justify-center gap-2 p-2 text-center *:text-pretty'>
					<Div className='mb-6 size-14 place-content-center place-items-center rounded-md bg-muted'>
						<Icon name='PowerOff' size={28} stroke='hsl(var(--muted-foreground))' />
					</Div>
					<Typography className='font-medium'>
						{t('ns_inoutbound:rfid_agent.not_connected', 'RFID agent is not successfully connected')}
					</Typography>
					<Typography variant='small' color='muted' className='mb-3'>
						{t(
							'ns_inoutbound:rfid_agent.not_connected_description',
							'Please ensure that the RFID agent is running and properly configured.'
						)}
					</Typography>
					<Div className='inline-flex items-center gap-x-1'>
						<Button
							size='sm'
							onClick={() => publishMessage('rfid/signal-request', Json.stringify({ act: 'ping' }))}>
							<Icon name='RotateCcw' />
							{t('ns_common:actions.retry')}
						</Button>
						<Button size='sm' variant='link'>
							Learn more <Icon name='ArrowUpRight' />
						</Button>
					</Div>
				</Div>
			) : scannedEpcs.length > 0 ? (
				<Div
					ref={containerRef}
					className={cn(
						'z-10 flex w-full flex-col items-stretch justify-start divide-y divide-border overflow-y-scroll bg-background p-2 will-change-transform contain-paint scrollbar-track-accent/50',
						'h-[calc(var(--outlet-wrapper-height)-56px)]'
					)}>
					<Div className='relative w-full' style={{ height: virtualizer.getTotalSize() }}>
						{virtualizer.getVirtualItems().map((virtualItem) => {
							const item = scannedEpcs[virtualItem.index]
							return (
								<Div
									key={virtualItem.index}
									data-index={virtualItem.index}
									className='absolute left-auto right-auto top-0 flex h-10 w-full justify-between whitespace-nowrap border-b px-4 py-2 uppercase transition-all duration-75 last:border-none hover:bg-secondary'
									style={{
										height: virtualItem.size,
										transform: `translateY(${virtualItem.start}px)`
									}}>
									<Typography className='font-medium'>{item}</Typography>
								</Div>
							)
						})}
					</Div>
				</Div>
			) : (
				<Div className='z-10 grid h-full flex-1 place-content-center'>
					<Div className='inline-flex items-center gap-x-4'>
						<Icon name='Inbox' stroke='hsl(var(--muted-foreground))' size={32} strokeWidth={1} />
						<Typography color='muted'> {t('ns_common:table.no_data')}</Typography>
					</Div>
				</Div>
			)}
			<Div className='grid h-[52px] grid-cols-3 items-center gap-x-2 p-2'>
				<Button
					size='sm'
					disabled={!isConnectionReady}
					variant={connectionStatus.isReaderConnectionReady ? 'destructive' : 'default'}
					onClick={() =>
						publishMessage(
							'rfid/signal',
							Json.stringify({
								act: connectionStatus.isReaderConnectionReady ? 'disconnect' : 'connect'
							})
						)
					}>
					<Icon name={connectionStatus.isReaderConnectionReady ? 'Unplug' : 'PlugZap'} />
					{connectionStatus.isReaderConnectionReady
						? t('ns_common:actions.disconnect')
						: t('ns_common:actions.connect')}
				</Button>
				<Button
					size='sm'
					variant='secondary'
					disabled={!isConnectionReady}
					onClick={() =>
						publishMessage(
							'rfid/signal',
							Json.stringify({ act: connectionStatus.isReaderPlaying ? 'pause' : 'play' })
						)
					}>
					<Icon name={connectionStatus.isReaderPlaying ? 'Pause' : 'Play'} />
					{connectionStatus.isReaderPlaying ? 'Stop reading' : 'Start reading'}
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={() => {
						handleResetData()
						publishMessage('rfid/data', Json.stringify({ act: 'reset' }))
					}}>
					<Icon name='RotateCw' /> {t('ns_common:actions.reset')}
				</Button>
			</Div>
		</Div>
	)
}

export default memo(ScannedEpcList)
