import { io } from 'socket.io-client'
import { RequestHeaders } from './common/constants/enums'
import env from './common/utils/env'
import { useAuthStore } from './stores/auth.store'

const { user, token } = useAuthStore()

export const socket = io(env('VITE_WEBSOCKET_URL'), {
	extraHeaders: {
		[RequestHeaders.AUTHORIZATION]: `Bearer ${token}`,
		[RequestHeaders.USER_COMPANY]: user?.company_code
	}
})
