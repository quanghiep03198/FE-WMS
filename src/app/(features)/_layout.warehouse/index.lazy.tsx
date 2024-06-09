import { createLazyFileRoute } from '@tanstack/react-router'
import WarehouseList from './_components/-warehouse-list'

export const Route = createLazyFileRoute('/(features)/_layout/warehouse/')({
	component: WarehousePage
})

function WarehousePage() {
	return (
		<>
			<WarehouseList />
		</>
	)
}
