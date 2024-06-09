import FallbackPage from '@/app/_components/_errors/-fallback-page'
import { Link, createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(features)/_layout/inventory/')({
	component: FallbackPage
})
