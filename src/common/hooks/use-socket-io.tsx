import { useAuthStore } from '@/stores/auth.store'
import { useCallback, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { RequestHeaders } from '../constants/enums'
import env from '../utils/env'

type UseWebSocketOptions<T> = {
	event: string
	defaultData?: T
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

export function useSocketIo<T>({ event }: UseWebSocketOptions<T>) {
	const [isConnected, setIsConnected] = useState(socket.connected)
	const [data, setData] = useState<T | null>(null)

	useEffect(() => {
		const handleConnect = () => setIsConnected(true)
		const handleDisconnect = () => setIsConnected(false)
		const handleEvent = (payload: T) => {
			setData(payload)
		}
		socket.on('connect', handleConnect)
		socket.on('disconnect', handleDisconnect)
		socket.on(event, (data) => setData(data))

		// if (room) socket.emit('join', room)

		return () => {
			socket.off('connect', handleConnect)
			socket.off('disconnect', handleDisconnect)
			socket.off(event, handleEvent)
		}
	}, [])

	const emit = useCallback((payload: any) => {
		socket.emit(event, payload)
	}, [])

	const disconnect = useCallback(() => {
		socket.disconnect()
	}, [])

	return { socket, isConnected, data, emit, disconnect }
}
