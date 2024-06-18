import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(features)/_layout/warehouse/_layout/warehouse/$id/')({
	component: () => <div>Hello /(features)/_layout/warehouse/_layout/warehouse/$warehouse_num/!</div>
})
