import UnavailableService from '@/app/_components/_errors/-unavailable-service'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(features)/preferences/_layout/account/')({
	component: UnavailableService
})
