import PermissionFormDialog from '@/app/admin/_layout.permission-management/-components/permission-form-dialog'
import PermissionTable from '@/app/admin/_layout.permission-management/-components/permission-table'
import { PageProvider } from '@/app/admin/_layout.permission-management/-contexts/page-context'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/admin/_layout/permission-management/')({
	component: Page
})

function Page() {
	return (
		<PageProvider>
			<PermissionTable />
			<PermissionFormDialog />
		</PageProvider>
	)
}
