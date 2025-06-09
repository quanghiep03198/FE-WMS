import { Combobox, Div } from '@/components/ui'
import { InventoryService } from '@/services/inventory.service'
import { useQuery } from '@tanstack/react-query'
import { useGetTenantByFactory } from '../../_apis/use-tenacy.api'

const FilterBox: React.FC = () => {
	const { data: tenant } = useGetTenantByFactory()

	const { data } = useQuery({
		queryKey: ['PRODUCTION_INVENTORY_FEATURE', tenant?.id],
		queryFn: () => InventoryService.getProductionInventoryFeatures(tenant?.id),
		enabled: !!tenant?.id,
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : [])
	})

	return (
		<Div className='flex items-center gap-x-2'>
			<Combobox
				placeholder='Select shoes style'
				datalist={data?.map((item) => ({ shoes_style: item.shoes_style }))}
				labelField='shoes_style'
				valueField='shoes_style'
			/>
			<Combobox
				placeholder='Select color'
				datalist={data?.map((item) => ({ color: item.color }))}
				labelField='color'
				valueField='color'
			/>
		</Div>
	)
}

export default FilterBox
