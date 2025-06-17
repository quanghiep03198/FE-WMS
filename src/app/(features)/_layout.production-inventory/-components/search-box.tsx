import useQueryParams from '@/common/hooks/use-query-params'
import { Button, ComboboxFieldControl, Div, Form as FormProvider, Icon, Separator } from '@/components/ui'
import { InventoryService } from '@/services/inventory.service'
import { useQuery } from '@tanstack/react-query'
import { capitalize, has, isEmpty } from 'lodash'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useGetTenantByFactory } from '../../-hooks/use-tenacy'
import DownloadExcelButton from './download-excel-button'

const SearchBox: React.FC = () => {
	const { t } = useTranslation()

	const { data: tenant } = useGetTenantByFactory()
	const { searchParams, setParams } = useQueryParams<Record<'shoes_style' | 'color', string>>(null)

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

	const form = useForm<Record<'shoes_style' | 'color', string>>({
		defaultValues: searchParams ? { ...searchParams } : { shoes_style: '', color: '' }
	})

	return (
		<Div
			className={
				!isEmpty(searchParams)
					? 'mx-auto flex max-w-5xl items-center justify-center gap-x-6 md:gap-x-2'
					: 'mx-auto block max-w-3xl'
			}>
			<FormProvider {...form}>
				<Form onSubmit={form.handleSubmit((values) => setParams(values))}>
					<ShoesStyleCombobox data={data?.shoes_style ?? []} />
					<ColorCombobox data={data?.color} />
					<Button type='submit' disabled={!form.watch('shoes_style') || !form.watch('color')}>
						<Icon name='Search' role='presentation' /> {t('ns_common:actions.search')}
					</Button>
				</Form>
			</FormProvider>
			{!isEmpty(searchParams) && (
				<Div className='inline-flex items-center gap-x-6 duration-300 ease-in animate-in fade-in-0'>
					<Separator orientation='vertical' className='h-8 w-0.5 md:hidden' />
					<DownloadExcelButton variant='secondary' />
				</Div>
			)}
		</Div>
	)
}

const ShoesStyleCombobox: React.FC<{ data: Record<'label' | 'value', string>[] }> = ({ data }) => {
	const { t } = useTranslation()

	const [searchTerm, setSearchTerm] = useState<string>('')

	const filteredData = useMemo(() => {
		if (!Array.isArray(data)) return []
		return data.filter((item) => item.value.toUpperCase().includes(searchTerm.toUpperCase()))
	}, [data, searchTerm])

	return (
		<Div className='flex-1'>
			<ComboboxFieldControl
				name='shoes_style'
				placeholder={capitalize(
					t('ns_common:form_placeholder.select', {
						object: t('ns_erp:fields.shoestyle_codefactory'),
						defaultValue: 'Select shoes style'
					})
				)}
				shouldFilter={false}
				onInput={setSearchTerm}
				datalist={filteredData}
				labelField='label'
				valueField='value'
			/>
		</Div>
	)
}
const ColorCombobox: React.FC<{ data: Record<'label' | 'value', string>[] }> = ({ data }) => {
	const { t } = useTranslation()

	const [searchTerm, setSearchTerm] = useState<string>('')

	const filteredData = useMemo(() => {
		if (!Array.isArray(data)) return []
		return data.filter((item) => item.value.toUpperCase().includes(searchTerm.toUpperCase()))
	}, [data, searchTerm])

	return (
		<Div className='flex-1'>
			<ComboboxFieldControl
				name='color'
				placeholder={capitalize(
					t('ns_common:form_placeholder.select', {
						object: t('ns_erp:fields.color_sn'),
						defaultValue: 'Select color'
					})
				)}
				onInput={setSearchTerm}
				shouldFilter={false}
				datalist={filteredData}
				labelField='label'
				valueField='value'
			/>
		</Div>
	)
}

const Form = tw.form`flex items-center gap-x-2 w-full max-w-full mx-auto py-6 flex-1`

export default SearchBox
