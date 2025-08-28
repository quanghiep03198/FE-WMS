import { useGetAgentIPv4 } from '@/app/-hooks/use-agent-ipv4'
import { useSocketIo, UseWebSocketOptions } from '@/common/hooks/use-socket-io'
import { useRef } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_AGENT_PORT = 3198

export function useSocketAgent<T>({ event }: Pick<UseWebSocketOptions<T>, 'event'>) {
	const { data: agent } = useGetAgentIPv4()

	const socketInstance = useRef<Socket>(null)
	if (!socketInstance.current && agent)
		socketInstance.current = io(`${agent.protocol}://${agent.ip}:${SOCKET_AGENT_PORT}`, { timeout: 10000 })
	return useSocketIo<string, any>({ client: socketInstance.current, event })
}
