import useQueryParams from '@/common/hooks/use-query-params'
import { Button, ComboboxFieldControl, Div, Form as FormProvider, Icon } from '@/components/ui'
import { InventoryService } from '@/services/inventory.service'
import { useQuery } from '@tanstack/react-query'
import { capitalize, has } from 'lodash'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useGetTenantByFactory } from '../../_apis/use-tenacy.api'

const SearchBox: React.FC = () => {
	const { t } = useTranslation()

	const { data: tenant } = useGetTenantByFactory()
	const { searchParams, setParams } = useQueryParams()

	const { data } = useQuery({
		queryKey: ['PRODUCTION_INVENTORY_FEATURE', tenant?.id],
		queryFn: () => InventoryService.getProductionInventoryFeatures(tenant?.id),
		enabled: !!tenant?.id,
		refetchOnMount: 'always',
		select: (response) => {
			const data: Record<'shoes_style' | 'color', Record<'label' | 'value', string>[]> = {
				shoes_style: [{ label: t('ns_common:others.all'), value: 'ALL' }],
				color: [{ label: t('ns_common:others.all'), value: 'ALL' }]
			}
			if (has(response.metadata, 'shoes_style') && Array.isArray(response.metadata.shoes_style))
				data.shoes_style = [
					{ label: t('ns_common:others.all'), value: 'ALL' },
					...response.metadata.shoes_style.map((item) => ({ label: item, value: item }))
				]

			if (has(response.metadata, 'color') && Array.isArray(response.metadata.color))
				data.color = [
					{ label: t('ns_common:others.all'), value: 'ALL' },
					...response.metadata.color.map((item) => ({ label: item, value: item }))
				]
			return data
		}
	})

	const form = useForm({
		defaultValues: searchParams ? { ...searchParams } : { shoes_style: '', color: '' }
	})

	return (
		<FormProvider {...form}>
			<Form
				onSubmit={form.handleSubmit((values) => {
					if (!values?.shoes_style && !values?.color) return
					setParams(values)
				})}>
				<Div className='flex-1'>
					<ComboboxFieldControl
						name='shoes_style'
						placeholder={capitalize(
							t('ns_common:form_placeholder.select', {
								object: t('ns_erp:fields.shoestyle_codefactory'),
								defaultValue: 'Select shoes style'
							})
						)}
						datalist={data?.shoes_style}
						labelField='label'
						valueField='value'
					/>
				</Div>
				<Div className='flex-1'>
					<ComboboxFieldControl
						name='color'
						placeholder={capitalize(
							t('ns_common:form_placeholder.select', {
								object: t('ns_erp:fields.color_sn'),
								defaultValue: 'Select color'
							})
						)}
						datalist={data?.color}
						labelField='label'
						valueField='value'
					/>
				</Div>
				<Button type='submit'>
					<Icon name='Search' role='presentation' /> {t('ns_common:actions.search')}
				</Button>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`flex items-center gap-x-2 w-full`

export default SearchBox
