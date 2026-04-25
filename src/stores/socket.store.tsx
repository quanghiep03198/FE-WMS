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

export const SocketProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const storeRef = useRef<StoreApi<TSocketContextStore>>(null)
	const { user, accessToken } = useAuth()

	if (!storeRef.current)
		storeRef.current = create<TSocketContextStore>((set) => {
			return {
				isConnected: false,
				io: io(AppConfigs.BASE_WEBSOCKET_URL, {
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

		return () => {
			socket.off('connect', handleConnect)
			socket.off('disconnect', handleDisconnect)
		}
	}, [socket])

	return <SocketContext.Provider value={storeRef.current}>{children}</SocketContext.Provider>
}

export const useSocketContext = createStoreSelector(SocketContext)

// Hook để lấy socket object
