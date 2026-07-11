import { AuthService } from '@/services/auth.service'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'

export default function Unauthorized({ reset }: ErrorComponentProps) {
	const router = useRouter()

	router.invalidate().finally(() => {
		reset()
		AuthService.logout()
	})

	return null
}
