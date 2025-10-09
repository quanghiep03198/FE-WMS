import { useAuthStore } from '@/stores/auth.store'
import { useMemoizedFn, useRafState } from 'ahooks'
import { throttle } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { RequestHeaders } from '../constants/enums'
import env from '../utils/env'
import { Json } from '../utils/json'

export type UseWebSocketOptions<TResponse> = {
	client?: Socket
	event: string
	initialData?: TResponse
	room?: string
	rateLimit?: false | number
}

const { user, token } = useAuthStore.getState()

const socket = io(env('VITE_WEBSOCKET_URL'), {
	extraHeaders: {
		[RequestHeaders.AUTHORIZATION]: `Bearer ${token}`,
		[RequestHeaders.USER_COMPANY]: user?.company_code
	},
	timeout: 10000,
	reconnection: true,
	reconnectionAttempts: 5,
	reconnectionDelay: 1000
})

export function useSocketIo<TResponse, TPayload>({ client, event, rateLimit = false }: UseWebSocketOptions<TResponse>) {
	const instanceIO = useRef<Socket>(client ?? socket)
	const [isConnected, setIsConnected] = useState(instanceIO.current.connected)
	const [data, setData] = useRafState<TResponse | null>(null)

	const handleEvent = useMemoizedFn((data: string) => setData(Json.parse<TResponse>(data)))
	const handleConnect = useMemoizedFn(() => setIsConnected(true))
	const handleDisconnect = useMemoizedFn(() => setIsConnected(false))

	useEffect(() => {
		instanceIO.current.on('connect', handleConnect)
		instanceIO.current.on('disconnect', handleDisconnect)
		instanceIO.current.on(
			event,
			typeof rateLimit === 'number'
				? throttle(handleEvent, rateLimit, { leading: true, trailing: true })
				: handleEvent
		)

		return () => {
			instanceIO.current.off('connect', handleConnect)
			instanceIO.current.off('disconnect', handleDisconnect)
			instanceIO.current.off(event, handleEvent)
		}
	}, [])

	const emit = useCallback((payload: TPayload) => {
		instanceIO.current.emit(event, payload)
	}, [])

	const disconnect = useCallback(() => {
		instanceIO.current.disconnect()
	}, [])

	const connect = useCallback(() => {
		if (isConnected) instanceIO.current.disconnect()
		instanceIO.current.connect()
	}, [])

	return { socket: instanceIO.current, isConnected, data, setData, emit, connect, disconnect }
}
