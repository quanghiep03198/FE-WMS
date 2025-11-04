import UserFormDialog from '@/app/admin/_layout.user-management/-components/user-form-dialog'
import UserManagementTable from '@/app/admin/_layout.user-management/-components/user-management-table'
import { PageProvider } from '@/app/admin/_layout.user-management/-contexts/page-content'
import Loading from '@/components/shared/loading'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/admin/_layout/user-management/')({
	component: page,
	pendingComponent: Loading
})

function page() {
	return (
		<PageProvider>
			<UserManagementTable />
			<UserFormDialog />
		</PageProvider>
	)
}
