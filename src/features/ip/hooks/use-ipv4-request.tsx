import axiosInstance from '@configs/axios.config'
import { useQuery } from '@tanstack/react-query'

enum AgentIPv4QueryKey {
	AgentIPv4 = 'AGENT_IPV4'
}

export const useGetAgentIPv4 = () => {
	return useQuery({
		queryKey: [AgentIPv4QueryKey.AgentIPv4],
		queryFn: async () => await axiosInstance.get<void, Record<'protocol' | 'ip', string>>('/agent-ipv4')
	})
}
