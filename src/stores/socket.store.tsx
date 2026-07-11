import { AppConfigs } from '@/configs/app.config'
import useAuth from '@/hooks/use-auth'
import { createStoreSelector } from '@/hooks/use-store-selector'
import { AuthService } from '@/services/auth.service'
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

export const SocketProvider: React.FC<React.PropsWithChildren & { namespace?: string }> = ({
	children,
	namespace = ''
}) => {
	const storeRef = useRef<StoreApi<TSocketContextStore>>(null)
	const { user, accessToken } = useAuth()

	if (!storeRef.current)
		storeRef.current = create<TSocketContextStore>((set) => {
			return {
				isConnected: false,
				io: io(new URL(namespace, AppConfigs.BASE_WEBSOCKET_URL).toString(), {
					autoConnect: true,
					timeout: 10_000,
					transports: ['websocket', 'polling', 'webtransport'],
					auth: {
						accessToken,
						factoryCode: user?.current_factory_code
					}
				}),
				setIsConnected: (isConnected) => {
					set((state) => ({ ...state, isConnected }))
				}
			}
		})

	const socket = storeRef.current.getState().io

	const handleConnect = () => storeRef.current.getState().setIsConnected(true)
	const handleDisconnect = () => storeRef.current.getState().setIsConnected(false)

	useUpdateEffect(() => {
		if (!accessToken) return
		socket.disconnect()
		socket.io.opts.forceNew = true
		socket.connect()
	}, [accessToken])

	useEffect(() => {
		socket.on('connect', handleConnect)
		socket.on('disconnect', handleDisconnect)
		socket.on('jwt_expired', AuthService.refreshToken)

		return () => {
			socket.off('connect', handleConnect)
			socket.off('disconnect', handleDisconnect)
			socket.off('jwt_expired', AuthService.refreshToken)
		}
	}, [socket])

	return <SocketContext.Provider value={storeRef.current}>{children}</SocketContext.Provider>
}

export const useSocketContext = createStoreSelector(SocketContext)

// Hook để lấy socket object
