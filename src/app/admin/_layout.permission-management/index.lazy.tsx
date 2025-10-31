import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/admin/_layout/permission-management/')({
	component: RouteComponent
})

function RouteComponent() {
	return <div>Hello "/admin/_layout/permission-management/"!</div>
}
