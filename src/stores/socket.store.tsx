import { RequestHeaders } from '@/common/constants/enums'
import useAuth from '@/common/hooks/use-auth'
import { createStoreSelector } from '@/common/hooks/use-store-selector'
import { AppConfigs } from '@/configs/app.config'
import { useUpdateEffect } from 'ahooks'
import React, { createContext, useEffect, useRef } from 'react'
import { io, type Socket } from 'socket.io-client'
import { create, type StoreApi } from 'zustand'

type TSocketContextStore = {
	isConnected: boolean
	setIsConnected: (connected: boolean) => void
	io: Socket
}

export const SocketContext = createContext<StoreApi<TSocketContextStore>>(null)

const DEFAULT_STATES = {
	isConnected: false
}

export const SocketProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const storeRef = useRef<StoreApi<TSocketContextStore>>(null)
	const { user, isAuthenticated, accessToken } = useAuth()

	console.log('[SocketProvider] accessToken :>> ', accessToken)

	if (!storeRef.current)
		storeRef.current = create<TSocketContextStore>((set) => {
			return {
				...DEFAULT_STATES,
				setIsConnected: (isConnected) => {
					set((state) => ({ ...state, isConnected }))
				},
				io: io(AppConfigs.BASE_WEBSOCKET_URL, {
					autoConnect: false,
					extraHeaders: {
						[RequestHeaders.FACTORY_CODE]: user.current_factory_code,
						...(accessToken && { [RequestHeaders.AUTHORIZATION]: `Bearer ${accessToken}` })
					},
					timeout: 10_000
				})
			}
		})

	const socket = storeRef.current.getState().io

	const handleConnect = () => storeRef.current.getState().setIsConnected(true)
	const handleDisconnect = () => storeRef.current.getState().setIsConnected(false)

	useUpdateEffect(() => {
		if (!accessToken) return
		socket.disconnect()
		socket.io.opts.extraHeaders = {
			...socket.io.opts.extraHeaders,
			[RequestHeaders.AUTHORIZATION]: `Bearer ${accessToken}`
		}
		socket.connect()
	}, [accessToken])

	useEffect(() => {
		if (!isAuthenticated) return
		socket.connect()

		socket.on('connect', handleConnect)
		socket.on('disconnect', handleDisconnect)
		// socket.on('jwt_expired', handleRefreshToken)

		return () => {
			socket.off('connect', handleConnect)
			socket.off('disconnect', handleDisconnect)
			// socket.off('jwt_expired', handleRefreshToken)

			socket.removeAllListeners()
			socket.disconnect()
		}
	}, [isAuthenticated])

	console.log('socket', socket)

	return <SocketContext.Provider value={storeRef.current}>{children}</SocketContext.Provider>
}

export const useSocketContext = createStoreSelector(SocketContext)

// Hook để lấy socket object
