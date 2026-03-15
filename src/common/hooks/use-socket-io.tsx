import { AppConfigs } from '@/configs/app.config'
import { AuthService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { useRafState } from 'ahooks'
import { throttle } from 'lodash-es'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { v4 as uuid } from 'uuid'
import { RequestHeaders } from '../constants/enums'
import { Json } from '../utils/json'

export type UseWebSocketOptions<TResponse> = {
	client?: Socket
	event: string
	initialData?: TResponse
	room?: string
	rateLimit?: false | number
}

const { user } = useAuthStore.getState()

const socket = io(AppConfigs.BASE_WEBSOCKET_URL, {
	withCredentials: true,
	extraHeaders: {
		[RequestHeaders.FACTORY_CODE]: user?.current_factory_code,
		[RequestHeaders.USER_REQUEST]: user?.username
	},
	timeout: 10000,
	retries: 3,
	reconnectionAttempts: 3
})

export function destroySharedSocket() {
	socket.offAny()
	socket.disconnect()
}

export function useSocketIo<TResponse, TPayload>({ client, event, rateLimit = false }: UseWebSocketOptions<TResponse>) {
	const instanceIO = useMemo<Socket>(() => (client instanceof Socket ? client : socket), [client])
	const [isConnected, setIsConnected] = useState(instanceIO.connected)
	const [data, setData] = useRafState<TResponse | null>(null)
	const lastEvent = useRef<{ id: string; data: TPayload }>(null)

	const handleEvent = useCallback((data: TPayload) => setData(Json.parse<TResponse>(data)), [])
	const handleConnect = useCallback(() => setIsConnected(true), [])
	const handleDisconnect = useCallback(() => setIsConnected(false), [])
	const handleRefreshToken = useCallback(() => {
		const abortController = new AbortController()
		AuthService.refreshToken(abortController.signal).then((response) => {
			instanceIO.disconnect()
			const newAccessToken = response.metadata.newAccessToken
			instanceIO.io.opts.extraHeaders = {
				...instanceIO.io.opts.extraHeaders,
				[RequestHeaders.AUTHORIZATION]: `Bearer ${newAccessToken}`
			}
			instanceIO.connect()
			if (lastEvent.current) {
				emit(lastEvent.current.data)
				lastEvent.current = null
			}
		})
	}, [])

	useEffect(() => {
		instanceIO.on('connect', handleConnect)
		instanceIO.on('disconnect', handleDisconnect)
		instanceIO.on('jwt_expired', handleRefreshToken)
		instanceIO.on(
			event,
			typeof rateLimit === 'number'
				? throttle(handleEvent, rateLimit, { leading: true, trailing: true })
				: handleEvent
		)

		return () => {
			instanceIO.off('connect', handleConnect)
			instanceIO.off('disconnect', handleDisconnect)
			instanceIO.off('jwt_expired', handleRefreshToken)
			instanceIO.off(event, handleEvent)
		}
	}, [])

	const emit = useCallback((payload: TPayload) => {
		lastEvent.current = { id: uuid(), data: payload }
		instanceIO.emit(event, payload)
	}, [])

	const disconnect = useCallback(() => {
		instanceIO.disconnect()
	}, [])

	const connect = useCallback(() => {
		if (isConnected) instanceIO.disconnect()
		instanceIO.connect()
	}, [])

	return { socket: instanceIO, isConnected, data, setData, emit, connect, disconnect }
}
