import { useAuthStore } from '@/stores/auth.store'
import { useCallback, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { RequestHeaders } from '../constants/enums'
import env from '../utils/env'
import { Json } from '../utils/json'

type UseWebSocketOptions<TResponse> = {
	event: string
	initialData?: TResponse
	room?: string
}

const { user, token } = useAuthStore.getState()

const socket = io(env('VITE_WEBSOCKET_URL'), {
	extraHeaders: {
		[RequestHeaders.AUTHORIZATION]: `Bearer ${token}`,
		[RequestHeaders.USER_COMPANY]: user?.company_code
	},
	timeout: 10000
})

export function useSocketIo<TResponse, TPayload>({ event }: UseWebSocketOptions<TResponse>) {
	const [isConnected, setIsConnected] = useState(socket.connected)
	const [data, setData] = useState<TResponse | null>(null)

	useEffect(() => {
		const handleConnect = () => setIsConnected(true)
		const handleDisconnect = () => setIsConnected(false)
		const handleEvent = (payload: TResponse) => {
			setData(payload)
		}
		socket.on('connect', handleConnect)
		socket.on('disconnect', handleDisconnect)
		socket.on(event, (data) => {
			setData(Json.parse<TResponse>(data))
		})

		// if (room) socket.emit('join', room)

		return () => {
			socket.off('connect', handleConnect)
			socket.off('disconnect', handleDisconnect)
			socket.off(event, handleEvent)
		}
	}, [])

	const emit = useCallback((payload: TPayload) => {
		socket.emit(event, payload)
	}, [])

	const disconnect = useCallback(() => {
		socket.disconnect()
	}, [])

	return { socket, isConnected, data, emit, disconnect }
}
