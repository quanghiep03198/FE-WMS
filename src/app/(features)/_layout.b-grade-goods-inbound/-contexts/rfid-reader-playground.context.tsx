import { useGetAgentIPv4 } from '@/app/-hooks/use-agent-ipv4'
import env from '@/common/utils/env'
import { Json } from '@/common/utils/json'
import { pick, throttle, uniq } from 'lodash'
import mqtt from 'mqtt'
import { createContext, use, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { gunzipSync } from 'zlib'
import { create, StoreApi, useStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

type RFIDPlaygroundActions = 'connect' | 'disconnect' | 'start' | 'stop' | 'ping' | 'reset' | 'get' | 'update'
type PlaygroundConnectionStatus = Record<
	'isMQTTConnectionReady' | 'isReaderConnectionReady' | 'isReaderPlaying',
	boolean
>
type RFIDReaderSettings = {
	readerIP: string
	readerAnt: '1' | '2' | '3' | '4'
	readerPower: number
}

type ReaderPlaygroundContextStore = {
	scannedEpcs: string[]
	setScannedEpcs: (value: string[]) => void
	resetScannedEpcs: () => void
	connectionStatus: PlaygroundConnectionStatus
	readerSettings: RFIDReaderSettings
	setReaderSettings: (value: RFIDReaderSettings) => void
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
const DEFAULT_PROPS: Pick<ReaderPlaygroundContextStore, 'scannedEpcs' | 'connectionStatus' | 'readerSettings'> = {
	scannedEpcs: [],
	connectionStatus: {
		isMQTTConnectionReady: false,
		isReaderConnectionReady: false,
		isReaderPlaying: false
	},
	readerSettings: {
		readerIP: '',
		readerAnt: '1',
		readerPower: 10
	}
}

const mqttSocket = ({ host, port }: { host: string; readonly port: number }): `ws://${string}:${number}` =>
	`ws://${host}:${port}`

export const ReaderPlaygroundProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { t } = useTranslation()
	const { data: agent } = useGetAgentIPv4()
	const clientRef = useRef<mqtt.MqttClient>(null)

	if (!clientRef.current && !!agent) {
		clientRef.current = mqtt.connect(mqttSocket({ host: agent?.ip ?? env<string>('VITE_APP_HOST'), port: 9001 }))
	}

	const store = useRef<StoreApi<ReaderPlaygroundContextStore>>(null)
	if (!store.current)
		store.current = create<ReaderPlaygroundContextStore>((set) => ({
			...DEFAULT_PROPS,
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

	const { scannedEpcs, setScannedEpcs, setConnectionStatus, setReaderSettings } = useStore(store.current)

	const handleConnectMQTT: mqtt.OnConnectCallback = useCallback(async (): Promise<void> => {
		if (!clientRef.current) return
		await Promise.all([
			clientRef.current.publishAsync(PublishedTopics.REQUEST_SIGNAL, Json.stringify({ act: 'ping' })),
			clientRef.current.publishAsync(PublishedTopics.REQUEST_SETTINGS, Json.stringify({ act: 'get' }))
		])
		clientRef.current.subscribeAsync(SubscribedTopics.REPLY_DATA)
		clientRef.current.subscribeAsync(SubscribedTopics.REPLY_SIGNAL)
		clientRef.current.subscribeAsync(SubscribedTopics.REPLY_SETTINGS)
	}, [clientRef.current])

	const handleDisconnectMQTT: mqtt.OnDisconnectCallback = useCallback((): void => {
		toast.info('Stopped controlling the RFID reader')
	}, [clientRef.current])

	const handleMessageMQTT: mqtt.OnMessageCallback = useCallback(
		(topic: string, message: Buffer): void => {
			if (!clientRef.current) return

			const rawMessage = message.toString()
			switch (topic) {
				case SubscribedTopics.REPLY_DATA: {
					const decodedMessage = gunzipSync(Buffer.from(rawMessage, 'base64')).toString()
					const parsedMessage = Json.parse<string[]>(decodedMessage)
					throttle(() => setScannedEpcs(uniq([...scannedEpcs, ...parsedMessage])), BUFFER_RATE, {
						leading: true,
						trailing: false
					})()
					break
				}
				case SubscribedTopics.REPLY_SIGNAL: {
					const data = Json.parse<PlaygroundConnectionStatus>(rawMessage)
					setConnectionStatus(data)
					break
				}
				case SubscribedTopics.REPLY_SETTINGS: {
					const data = Json.parse<{ metadata: RFIDReaderSettings; message: string; error: any }>(rawMessage)
					if (data.error) toast.error(t('ns_common:notification.error'))

					if (data.message && !data.error) toast.success(data.message)
					setReaderSettings(data.metadata)
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

	useEffect(() => {
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
	}, [clientRef.current])

	return <ReaderPlaygroundContext.Provider value={store.current}>{children}</ReaderPlaygroundContext.Provider>
}

export const useReaderPlaygroundStore = <
	T extends ReaderPlaygroundContextStore,
	K extends keyof ReaderPlaygroundContextStore
>(
	...selectors: K[]
) => {
	const store = use(ReaderPlaygroundContext)
	if (!store) throw new Error('Missing store provider')
	if (!selectors) return useStore(store)
	return useStore(
		store,
		useShallow((state) => pick(state, selectors))
	) as Pick<T, K>
}
