import { useGetAgentIPv4 } from '@/app/-hooks/use-agent-ipv4'
import { useEffectOnce } from '@/common/hooks/use-effect-once'
import { createStoreSelector } from '@/common/hooks/use-store-selector'
import env from '@/common/utils/env'
import { Json } from '@/common/utils/json'
import { useInterval } from 'ahooks'
import mqtt from 'mqtt'
import { createContext, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { create, StoreApi, useStore } from 'zustand'
import { ReaderAntenna } from '../-constants'
import { readerSettingsFormSchema, ReaderSettingsFormValues } from '../-schemas/reader-settings.schema'

type RFIDPlaygroundActions = 'connect' | 'disconnect' | 'start' | 'stop' | 'ping' | 'reset' | 'get' | 'update'
type PlaygroundConnectionStatus = Record<
	'isMQTTConnectionReady' | 'isReaderConnectionReady' | 'isReaderPlaying',
	boolean
>

type ReaderPlaygroundContextStore = {
	pingCount: number
	setPingCount: (value: number) => void
	scannedEpcs: string[]
	setScannedEpcs: (value: string[]) => void
	resetScannedEpcs: () => void
	connectionStatus: PlaygroundConnectionStatus
	readerSettings: ReaderSettingsFormValues
	setReaderSettings: (value: ReaderSettingsFormValues) => void
	setConnectionStatus: (
		value: Record<'isMQTTConnectionReady' | 'isReaderConnectionReady' | 'isReaderPlaying', boolean>
	) => void
	publishMessage: <TPayload = any>(
		topic: PublishedTopics,
		message: {
			action: RFIDPlaygroundActions
			payload?: TPayload
		}
	) => void
}

export enum SubscribedTopics {
	REPLY_DATA = 'reply/data',
	REPLY_SIGNAL = 'reply/signal',
	REPLY_SETTINGS = 'reply/settings'
}

export enum PublishedTopics {
	REQUEST_DATA = 'request/data',
	REQUEST_SIGNAL = 'request/signal',
	REQUEST_SETTINGS = 'request/settings'
}

const ReaderPlaygroundContext = createContext<StoreApi<ReaderPlaygroundContextStore>>(null)

const FPS = 60 // (fps) Frame per second to refresh the scanned EPC list
const DURATION = 1000 // (ms) Duration to refresh the scanned EPC list
const BUFFER_RATE = DURATION / FPS // (ms) Refresh rate to update the scanned EPC list
const DEFAULT_PROPS: Pick<
	ReaderPlaygroundContextStore,
	'pingCount' | 'scannedEpcs' | 'connectionStatus' | 'readerSettings'
> = {
	pingCount: 0,
	scannedEpcs: [],
	connectionStatus: {
		isMQTTConnectionReady: false,
		isReaderConnectionReady: false,
		isReaderPlaying: false
	},
	readerSettings: {
		readerIP: '',
		readerAnt: ReaderAntenna.ANT_1,
		readerPower: 10
	}
}

const mqttSocket = ({ host, port }: { host: string; readonly port: number }): `ws://${string}:${number}` =>
	`ws://${host}:${port}`

const MAX_RETRY = 3

export const ReaderPlaygroundProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { t } = useTranslation()
	const { data: agent } = useGetAgentIPv4()
	const clientRef = useRef<mqtt.MqttClient>(null)
	const bufferDataRef = useRef<Set<string>>(new Set())
	// const pingCountRef = useReactiveRef<number>(0)

	if (!clientRef.current && !!agent) {
		clientRef.current = mqtt.connect(mqttSocket({ host: agent.ip, port: 9001 }))
	}

	const store = useRef<StoreApi<ReaderPlaygroundContextStore>>(null)
	if (!store.current)
		store.current = create<ReaderPlaygroundContextStore>((set) => ({
			...DEFAULT_PROPS,
			setPingCount: (value) => {
				set((state) => {
					return { ...state, pingCount: value }
				})
			},
			setScannedEpcs: (value) => {
				set((state) => {
					return { ...state, scannedEpcs: value }
				})
			},
			resetScannedEpcs: () => {
				set((state) => {
					state?.publishMessage?.(PublishedTopics.REQUEST_DATA, { action: 'reset' })
					return { ...state, scannedEpcs: [] }
				})
			},
			setConnectionStatus: (value) => {
				set((state) => {
					return { ...state, connectionStatus: { ...state.connectionStatus, ...value } }
				})
			},
			setReaderSettings: (value) => {
				set((state) => {
					return { ...state, readerSettings: value }
				})
			},
			async publishMessage(topic: PublishedTopics, message: Record<'action', RFIDPlaygroundActions>) {
				if (!clientRef.current) return
				clientRef.current.publishAsync(topic, Json.stringify(message))
			}
		}))

	const { pingCount, scannedEpcs, setScannedEpcs, setConnectionStatus, setReaderSettings, setPingCount } = useStore(
		store.current
	)

	/**
	 * Buffer incoming EPC data and update the scanned EPC list at a fixed interval
	 */
	useInterval(
		() => {
			if (bufferDataRef.current.size > 0) {
				const newEpcs = Array.from(bufferDataRef.current)
				setScannedEpcs([...new Set([...scannedEpcs, ...newEpcs])])
				bufferDataRef.current.clear()
			}
		},
		BUFFER_RATE,
		{ immediate: false }
	)

	// const stopPingInterval = useInterval(
	// 	() => {
	// 		if (!clientRef.current) return
	// 		clientRef.current.publish(PublishedTopics.REQUEST_SIGNAL, Json.stringify({ action: 'ping' }))
	// 		setPingCount(pingCount + 1)
	// 		// pingCountRef.current++
	// 	},
	// 	1000,
	// 	{ immediate: clientRef?.current?.connected && pingCount > 0 }
	// )

	const handleConnectMQTT: mqtt.OnConnectCallback = useCallback(async (): Promise<void> => {
		if (!clientRef.current) return
		await Promise.all([
			clientRef.current.publishAsync(PublishedTopics.REQUEST_SIGNAL, Json.stringify({ action: 'ping' })),
			clientRef.current.publishAsync(PublishedTopics.REQUEST_SETTINGS, Json.stringify({ action: 'get' }))
		])
		clientRef.current.subscribeAsync(SubscribedTopics.REPLY_DATA)
		clientRef.current.subscribeAsync(SubscribedTopics.REPLY_SIGNAL)
		clientRef.current.subscribeAsync(SubscribedTopics.REPLY_SETTINGS)
	}, [clientRef.current])

	const handleDisconnectMQTT: mqtt.OnDisconnectCallback = useCallback((): void => {
		toast.info('Stopped controlling the RFID reader')
	}, [])

	const handleMessageMQTT: mqtt.OnMessageCallback = useCallback(
		(topic: string, message: Buffer): void => {
			if (!clientRef.current) return

			const rawMessage = message.toString()
			switch (topic) {
				case SubscribedTopics.REPLY_DATA: {
					bufferDataRef.current.add(rawMessage)
					break
				}
				case SubscribedTopics.REPLY_SIGNAL: {
					setPingCount(0)
					// pingCountRef.current = 0 // * Always reset ping count on every reply from RFID Agent
					const data = Json.parse<PlaygroundConnectionStatus>(rawMessage)
					setConnectionStatus(data)
					break
				}
				case SubscribedTopics.REPLY_SETTINGS: {
					const data = Json.parse<{ metadata: ReaderSettingsFormValues; message: string; error: any }>(rawMessage)
					if (data.error) toast.error(t('ns_common:notification.error'), { id: 'rfid-settings-change' })
					if (data.message && !data.error) toast.success(data.message, { id: 'rfid-settings-change' })
					const parsed = readerSettingsFormSchema.safeParse(data.metadata)
					if (parsed.success) setReaderSettings(parsed.data)
					else console.error('[MQTT] Invalid reader settings from server:', parsed.error)
					break
				}
				default: {
					if (env<RuntimeEnvironment>('VITE_NODE_ENV') === 'development')
						console.warn('Unknown topic:', topic, rawMessage)
					break
				}
			}
		},
		[clientRef.current]
	)

	useEffectOnce(() => {
		if (!clientRef.current) return

		clientRef.current.on('connect', handleConnectMQTT)
		clientRef.current.on('disconnect', handleDisconnectMQTT)
		clientRef.current.on('message', handleMessageMQTT)

		return () => {
			clientRef.current.off('connect', handleConnectMQTT)
			clientRef.current.off('disconnect', handleDisconnectMQTT)
			clientRef.current.off('message', handleMessageMQTT)
			clientRef.current.removeListener('connect', handleConnectMQTT)
			clientRef.current.removeListener('disconnect', handleDisconnectMQTT)
			clientRef.current.removeListener('message', handleMessageMQTT)
		}
	})

	return <ReaderPlaygroundContext.Provider value={store.current}>{children}</ReaderPlaygroundContext.Provider>
}

export const useReaderPlaygroundStore = createStoreSelector(ReaderPlaygroundContext)
