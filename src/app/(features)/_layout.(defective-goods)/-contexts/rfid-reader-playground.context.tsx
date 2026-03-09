import { useGetAgentIPv4 } from '@/app/-hooks/use-agent-ipv4'
import { createStoreSelector } from '@/common/hooks/use-store-selector'
import env from '@/common/utils/env'
import { Json } from '@/common/utils/json'
import { useMemoizedFn, useUnmount } from 'ahooks'
import mqtt from 'mqtt'
import { createContext, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { create, StoreApi } from 'zustand'
import { ReaderAntenna } from '../-constants'
import { readerSettingsFormSchema, ReaderSettingsFormValues } from '../-schemas/reader-settings.schema'

type RFIDPlaygroundActions = 'connect' | 'disconnect' | 'start' | 'stop' | 'ping' | 'reset' | 'get' | 'update'
type PlaygroundConnectionStatus = Record<
	'isMQTTConnectionReady' | 'isReaderConnectionReady' | 'isReaderPlaying',
	boolean
>

type ReaderPlaygroundContextStore = {
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

const BUFFER_RATE_MS = 1000 / 60 // ~16ms — flush buffer at 60fps
const PING_INTERVAL_MS = 1000
const MAX_PING_RETRY = 3
const MQTT_PORT = 9001

const DEFAULT_PROPS: Pick<ReaderPlaygroundContextStore, 'scannedEpcs' | 'connectionStatus' | 'readerSettings'> = {
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

const buildMqttUrl = (host: string, port: number): `ws://${string}:${number}` => `ws://${host}:${port}`

export const ReaderPlaygroundProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { t } = useTranslation()
	const { data: agent } = useGetAgentIPv4()

	// Refs
	const clientRef = useRef<mqtt.MqttClient | null>(null)
	const dataBufferRef = useRef<Set<string>>(new Set())
	const pingCountRef = useRef<number>(0)
	const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
	const bufferIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

	// Zustand store (created once, never recreated)
	const storeRef = useRef<StoreApi<ReaderPlaygroundContextStore> | null>(null)
	if (!storeRef.current) {
		storeRef.current = create<ReaderPlaygroundContextStore>((set) => ({
			...DEFAULT_PROPS,
			setScannedEpcs: (value) => set({ scannedEpcs: value }),
			resetScannedEpcs: () => {
				// Publish reset command then clear local state
				const client = clientRef.current
				if (client?.connected) {
					client.publish(PublishedTopics.REQUEST_DATA, Json.stringify({ action: 'reset' }))
				}
				set({ scannedEpcs: [] })
			},
			setConnectionStatus: (value) =>
				set((state) => ({ connectionStatus: { ...state.connectionStatus, ...value } })),
			setReaderSettings: (value) => set({ readerSettings: value }),
			publishMessage: async (topic, message) => {
				const client = clientRef.current
				if (!client?.connected) return
				await client.publishAsync(topic, Json.stringify(message))
			}
		}))
	}

	const store = storeRef.current

	// Helpers to read store without stale closures
	const getState = useMemoizedFn(() => store.getState())
	const setConnectionStatus = useMemoizedFn(store.getState().setConnectionStatus)
	const setReaderSettings = useMemoizedFn(store.getState().setReaderSettings)
	const setScannedEpcs = useMemoizedFn(store.getState().setScannedEpcs)

	// Interval management
	const stopPingInterval = useMemoizedFn(() => {
		if (pingIntervalRef.current) {
			clearInterval(pingIntervalRef.current)
			pingIntervalRef.current = null
		}
	})

	const startPingInterval = useMemoizedFn(() => {
		stopPingInterval()
		pingCountRef.current = 0
		pingIntervalRef.current = setInterval(() => {
			const client = clientRef.current
			if (!client?.connected) return

			client.publish(PublishedTopics.REQUEST_SIGNAL, Json.stringify({ action: 'ping' }))
			pingCountRef.current++

			if (pingCountRef.current > MAX_PING_RETRY) {
				stopPingInterval()
				setScannedEpcs([])
				setConnectionStatus({
					isMQTTConnectionReady: false,
					isReaderConnectionReady: false,
					isReaderPlaying: false
				})
			}
		}, PING_INTERVAL_MS)
	})

	const stopBufferInterval = useMemoizedFn(() => {
		if (bufferIntervalRef.current) {
			clearInterval(bufferIntervalRef.current)
			bufferIntervalRef.current = null
		}
	})

	const startBufferInterval = useMemoizedFn(() => {
		stopBufferInterval()
		bufferIntervalRef.current = setInterval(() => {
			const buffer = dataBufferRef.current
			if (buffer.size === 0) return

			const newEpcs = Array.from(buffer)
			buffer.clear()

			// Read latest state directly from store — no stale closure
			const { scannedEpcs: current } = getState()
			setScannedEpcs([...new Set([...current, ...newEpcs])])
		}, BUFFER_RATE_MS)
	})

	// MQTT event handlers (stable identity via useMemoizedFn)
	const handleConnect = useMemoizedFn(async () => {
		const client = clientRef.current
		if (!client) return

		await Promise.all([
			client.publishAsync(PublishedTopics.REQUEST_SIGNAL, Json.stringify({ action: 'ping' })),
			client.publishAsync(PublishedTopics.REQUEST_SETTINGS, Json.stringify({ action: 'get' }))
		])
		await Promise.all([
			client.subscribeAsync(SubscribedTopics.REPLY_DATA),
			client.subscribeAsync(SubscribedTopics.REPLY_SIGNAL),
			client.subscribeAsync(SubscribedTopics.REPLY_SETTINGS)
		])

		startPingInterval()
		startBufferInterval()
	})

	const handleDisconnect = useMemoizedFn(() => {
		stopPingInterval()
		stopBufferInterval()
		toast.info('Stopped controlling the RFID reader')
	})

	const handleMessage = useMemoizedFn((topic: string, message: Buffer) => {
		const client = clientRef.current
		if (!client) return

		const rawMessage = message.toString()

		switch (topic) {
			case SubscribedTopics.REPLY_DATA: {
				dataBufferRef.current.add(rawMessage)
				break
			}
			case SubscribedTopics.REPLY_SIGNAL: {
				pingCountRef.current = 0 // Reset ping count on every reply
				const data = Json.parse<PlaygroundConnectionStatus>(rawMessage)
				setConnectionStatus(data)
				break
			}
			case SubscribedTopics.REPLY_SETTINGS: {
				const data = Json.parse<{ metadata: ReaderSettingsFormValues; message: string; error: any }>(rawMessage)
				if (data.error) {
					toast.error(t('ns_common:notification.error'), { id: 'rfid-settings-change' })
					return
				}
				const validatedReaderSettings = readerSettingsFormSchema.safeParse(data.metadata)
				if (validatedReaderSettings.success) {
					if (data.message) toast.success(data.message, { id: 'rfid-settings-change' })
					setReaderSettings(validatedReaderSettings.data)
				} else {
					console.error('[MQTT] Invalid reader settings from server:', validatedReaderSettings.error)
				}
				break
			}
			default: {
				if (env<RuntimeEnvironment>('VITE_NODE_ENV') === 'development') {
					console.warn('[MQTT] Unknown topic:', topic, rawMessage)
				}
				break
			}
		}
	})

	// ── MQTT lifecycle: connect when agent is available, cleanup on unmount ─
	useEffect(() => {
		if (!agent?.ip) return

		// Create MQTT connection inside effect (not in render phase)
		const client = mqtt.connect(buildMqttUrl(agent.ip, MQTT_PORT))
		clientRef.current = client

		client.on('connect', handleConnect)
		client.on('disconnect', handleDisconnect)
		client.on('message', handleMessage)

		return () => {
			// Remove listeners first
			client.off('connect', handleConnect)
			client.off('disconnect', handleDisconnect)
			client.off('message', handleMessage)

			// Stop all intervals
			stopPingInterval()
			stopBufferInterval()

			// Close MQTT connection — force=true to not wait for in-flight messages
			client.end(true)
			clientRef.current = null

			// Clear data buffer
			dataBufferRef.current.clear()
		}
	}, [agent?.ip])

	// Cleanup safety net on unmount
	useUnmount(() => {
		if (clientRef.current) {
			clientRef.current.end(true)
			clientRef.current = null
		}
		stopPingInterval()
		stopBufferInterval()
	})

	return <ReaderPlaygroundContext.Provider value={store}>{children}</ReaderPlaygroundContext.Provider>
}

export const useReaderPlaygroundStore = createStoreSelector(ReaderPlaygroundContext)
