import FallbackPage from '@/app/_components/_errors/-fallback-page'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(preferences)/_layout/account/')({
	component: FallbackPage
})
