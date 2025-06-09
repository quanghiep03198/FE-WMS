import { Button, ComboboxFieldControl, Form as FormProvider, Icon } from '@/components/ui'
import { InventoryService } from '@/services/inventory.service'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useGetTenantByFactory } from '../../_apis/use-tenacy.api'

const FilterBox: React.FC = () => {
	const { t } = useTranslation()

	const { data: tenant } = useGetTenantByFactory()

	const { data } = useQuery({
		queryKey: ['PRODUCTION_INVENTORY_FEATURE', tenant?.id],
		queryFn: () => InventoryService.getProductionInventoryFeatures(tenant?.id),
		enabled: !!tenant?.id,
		select: (response) => response.metadata
	})

	const form = useForm({
		defaultValues: {
			shoes_style: '',
			color: ''
		}
	})

	return (
		<FormProvider {...form}>
			<Form>
				<ComboboxFieldControl
					name='shoes_style'
					// label={t('ns_erp:fields.shoestyle_codefactory')}
					placeholder='Select shoes style'
					datalist={data.shoes_style.map((item) => ({ shoes_style: item }))}
					// orientation='horizontal'
					// triggerProps={{ className: 'flex-1' }}
					labelField='shoes_style'
					valueField='shoes_style'
				/>
				<ComboboxFieldControl
					// label={t('ns_erp:fields.color_sn')}
					name='color'
					placeholder='Select color'
					// orientation='horizontal'
					// triggerProps={{ className: 'flex-1' }}
					datalist={data.color.map((item) => ({ color: item }))}
					labelField='color'
					valueField='color'
				/>
				<Button type='submit'>
					<Icon name='Search' role='presentation' /> {t('ns_common:actions.search')}
				</Button>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`grid grid-cols-[auto_auto_128px] gap-x-2 w-full`

export default FilterBox
