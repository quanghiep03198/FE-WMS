import PermissionTable from '@/app/admin/_layout.permission-management/-components/permission-table'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/admin/_layout/permission-management/')({
	component: page
})

function page() {
	return <PermissionTable />
}
