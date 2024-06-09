import { AuthContext } from '@/components/providers/auth-provider'
import { useContext } from 'react'

export default function useAuth() {
	return useContext(AuthContext)
}
