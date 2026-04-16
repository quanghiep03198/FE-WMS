import { AppConfigs } from '@/configs/app.config'
import { AuthService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { useRafState } from 'ahooks'
import { throttle, type DebouncedFunc } from 'lodash-es'
import { useCallback, useEffect, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import { RequestHeaders } from '../constants/enums'
import { Json } from '../utils/json'

export type UseWebSocketOptions<TResponse> = {
	client?: Socket
	event: string
	initialData?: TResponse
	room?: string
	rateLimit?: false | number
}

// ─── Shared singleton socket ───────────────────────────────────────────────────
let sharedSocket: Socket | null = null
/** Track how many hook instances are using the shared socket */
let consumerCount = 0

function getSharedSocket(): Socket {
	if (!sharedSocket) {
		sharedSocket = io(AppConfigs.BASE_WEBSOCKET_URL, {
			withCredentials: true,
			autoConnect: false,
			extraHeaders: {
				[RequestHeaders.FACTORY_CODE]: useAuthStore.getState().user?.current_factory_code,
				[RequestHeaders.USER_REQUEST]: useAuthStore.getState().user?.username
			},
			timeout: 10_000,
			retries: 3,
			reconnectionAttempts: 3
		})
	}
	return sharedSocket
}

/** Call on logout to fully destroy the shared socket */
export function destroySharedSocket(): void {
	if (sharedSocket) {
		sharedSocket.removeAllListeners()
		sharedSocket.disconnect()
		sharedSocket = null
	}
	consumerCount = 0
}

// ─── Shared auth-refresh dedup (across all hook instances) ─────────────────────
let isRefreshingSocketAuth = false

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useSocketIo<TResponse, TPayload>({ client, event, rateLimit = false }: UseWebSocketOptions<TResponse>) {
	const instanceIO = client ?? getSharedSocket()
	const isShared = !client // true = using shared singleton

	const [isConnected, setIsConnected] = useState(instanceIO.connected)
	const [data, setData] = useRafState<TResponse | null>(null)
	const lastEmitRef = useRef<{ event: string; payload: TPayload } | null>(null)

	// Store the ACTUAL registered handler so cleanup removes the correct reference
	const registeredHandlerRef = useRef<DebouncedFunc<(data: TPayload) => void> | ((data: TPayload) => void) | null>(
		null
	)

	const handleEvent = useCallback((raw: TPayload) => setData(Json.parse<TResponse>(raw)), [])

	const handleConnect = useCallback(() => setIsConnected(true), [])
	const handleDisconnect = useCallback(() => setIsConnected(false), [])

	const handleRefreshToken = useCallback(() => {
		// Dedup: if another hook instance is already refreshing, skip
		if (isRefreshingSocketAuth) return
		isRefreshingSocketAuth = true

		const abortController = new AbortController()
		AuthService.refreshToken(abortController.signal)
			.then((response) => {
				if (!response?.metadata?.newAccessToken) return

				instanceIO.disconnect()
				instanceIO.io.opts.extraHeaders = {
					...instanceIO.io.opts.extraHeaders,
					[RequestHeaders.AUTHORIZATION]: `Bearer ${response.metadata.newAccessToken}`
				}
				instanceIO.connect()
			})
			.catch(() => {
				// refreshToken already calls logout on failure
			})
			.finally(() => {
				isRefreshingSocketAuth = false
			})
	}, [])

	// ─── Emit with retry support ───────────────────────────────────────────────
	const emit = useCallback(
		(payload: TPayload) => {
			lastEmitRef.current = { event, payload }

			if (isRefreshingSocketAuth) {
				// Will be retried in handleConnect after reconnect
				return
			}

			instanceIO.emit(event, payload)
		},
		[event]
	)

	// ─── Lifecycle ─────────────────────────────────────────────────────────────
	useEffect(() => {
		// Connect shared socket on first consumer
		if (isShared) {
			consumerCount++
			if (!instanceIO.connected) {
				instanceIO.connect()
			}
		}

		// 1. Register connection lifecycle listeners
		instanceIO.on('connect', handleConnect)
		instanceIO.on('disconnect', handleDisconnect)
		instanceIO.on('jwt_expired', handleRefreshToken)

		// 2. Register THIS hook's event listener (only its OWN event)
		const eventHandler =
			typeof rateLimit === 'number'
				? throttle(handleEvent, rateLimit, { leading: true, trailing: true })
				: handleEvent

		registeredHandlerRef.current = eventHandler
		instanceIO.on(event, eventHandler)

		// 3. Retry last emit on reconnect (after token refresh)
		const handleReconnect = () => {
			if (lastEmitRef.current?.event === event && lastEmitRef.current?.payload) {
				instanceIO.emit(event, lastEmitRef.current.payload)
				lastEmitRef.current = null
			}
		}
		instanceIO.on('connect', handleReconnect)

		return () => {
			// Remove ONLY this hook's listeners (not other hooks')
			instanceIO.off('connect', handleConnect)
			instanceIO.off('connect', handleReconnect)
			instanceIO.off('disconnect', handleDisconnect)
			instanceIO.off('jwt_expired', handleRefreshToken)

			// Remove the EXACT handler reference that was registered
			if (registeredHandlerRef.current) {
				instanceIO.off(event, registeredHandlerRef.current)
				// Cancel pending throttle invocations (prevent setState after unmount)
				if ('cancel' in registeredHandlerRef.current) {
					registeredHandlerRef.current.cancel()
				}
				registeredHandlerRef.current = null
			}

			// Disconnect shared socket only when NO consumers remain
			if (isShared) {
				consumerCount--
				if (consumerCount === 0) {
					instanceIO.disconnect()
				}
			}
		}
	}, [event, rateLimit])

	const disconnect = useCallback(() => instanceIO.disconnect(), [])
	const connect = useCallback(() => {
		if (instanceIO.connected) instanceIO.disconnect()
		instanceIO.connect()
	}, [])

	return { socket: instanceIO, isConnected, data, setData, emit, connect, disconnect }
}
