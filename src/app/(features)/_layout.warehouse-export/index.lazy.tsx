import FallbackPage from '@/app/_components/_errors/-fallback-page'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(features)/_layout/warehouse-export/')({
	component: FallbackPage
})
