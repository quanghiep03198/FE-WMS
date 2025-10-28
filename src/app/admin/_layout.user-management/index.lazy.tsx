import UserManagementTable from '@/app/admin/_layout.user-management/-components/user-management-table'
import Loading from '@/components/shared/loading'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/admin/_layout/user-management/')({
	component: page,
	pendingComponent: Loading
})

function page() {
	return <UserManagementTable />
}
