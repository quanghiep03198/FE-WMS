import { AuthService } from '@/services/auth.service'
import { ErrorComponentProps, useRouter } from '@tanstack/react-router'

export default function Unauthorized({ reset }: ErrorComponentProps) {
	const router = useRouter()

	router.invalidate().finally(() => {
		reset()
		AuthService.logout()
	})

	return null
}
