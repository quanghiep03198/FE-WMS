import useMediaQuery from '@/common/hooks/use-media-query'
import useQueryParams from '@/common/hooks/use-query-params'
import { cn } from '@/common/utils/cn'
import { Button, ComboboxFieldControl, Div, Form as FormProvider, Icon } from '@/components/ui'
import { InventoryService } from '@/services/inventory.service'
import { useQuery } from '@tanstack/react-query'
import { capitalize, isEmpty } from 'lodash-es'
import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useGetProductionInventoryQuery } from '../../-hooks/use-production-inventory-asm'
import { useGetTenantByFactory } from '../../../-hooks/use-tenacy-asm'
import DownloadExcelButton from './download-excel-button'

type ComboboxProps = { data: Record<'label' | 'value', string>[]; isLoading: boolean }

const SearchBox: React.FC = () => {
	const { t, i18n } = useTranslation()
	const isSmallScreen = useMediaQuery('(max-width:800px)')
	const { data: tenant } = useGetTenantByFactory()
	const { refetch } = useGetProductionInventoryQuery()
	const { searchParams, setParams } = useQueryParams<Record<'shoes_style' | 'color', string>>(null)

	const { data, isLoading } = useQuery({
		queryKey: ['PRODUCTION_INVENTORY_FEATURE', tenant?.id],
		queryFn: async () => await InventoryService.getProductionInventoryFeatures(tenant?.id),
		enabled: !!tenant?.id,
		refetchOnMount: 'always',
		select: (response) => {
			return response.metadata
		}
	})

	const form = useForm<Record<'brand_name' | 'shoes_style' | 'color', string>>({
		defaultValues: searchParams ? { ...searchParams } : { shoes_style: '', color: '' }
	})
	const selectedBrandName = useWatch({ control: form.control, name: 'brand_name' })
	const selectedShoesStyle = useWatch({ control: form.control, name: 'shoes_style' })

	const getOptions = (items: any[] | undefined, key: string, labelKey: string = key, valueKey: string = key) => {
		if (!Array.isArray(items)) return []
		const options = items
			.filter((item) => item[key] !== 'ALL')
			.map((item) => ({
				label: item[labelKey],
				value: item[valueKey]
			}))
		if (items.some((item) => item[key] === 'ALL')) options.unshift({ label: t('ns_common:others.all'), value: 'ALL' })
		return options
	}

	const brandNameOptions = useMemo(() => getOptions(data, 'brand_name'), [data, i18n.language])

	const shoesStyleOptions = useMemo(() => {
		const match = Array.isArray(data) ? data.find((item) => item.brand_name === selectedBrandName) : undefined
		return getOptions(match?.product_variants, 'shoes_style')
	}, [data, selectedBrandName, i18n.language])

	const colorOptions = useMemo(() => {
		const matchBrand = Array.isArray(data) ? data.find((item) => item.brand_name === selectedBrandName) : undefined
		const matchVariant = matchBrand?.product_variants?.find((item: any) => item.shoes_style === selectedShoesStyle)
		return getOptions(matchVariant?.colors, 'color')
	}, [data, selectedBrandName, selectedShoesStyle, i18n.language])

	return (
		<Div
			className={cn(
				'mx-auto max-w-5xl',
				isEmpty(searchParams) ? 'block' : 'flex items-center justify-center space-x-4 divide-x-2 md:space-x-2'
			)}>
			<FormProvider {...form}>
				<Form onSubmit={form.handleSubmit((values) => setParams(values))}>
					<BrandNameComboboxFieldControl data={brandNameOptions} isLoading={isLoading} />
					<ShoesStyleCombobox data={shoesStyleOptions} isLoading={isLoading} />
					<ColorCombobox data={colorOptions} isLoading={isLoading} />
					<Button
						type='submit'
						size={isSmallScreen ? 'icon' : 'default'}
						disabled={!form.watch('shoes_style') || !form.watch('color')}>
						<Icon name='Search' size={isSmallScreen ? 18 : 16} />{' '}
						{!isSmallScreen && t('ns_common:actions.search')}
					</Button>
					<Button
						type='button'
						variant='outline'
						size={isSmallScreen ? 'icon' : 'default'}
						disabled={!form.watch('shoes_style') || !form.watch('color')}
						onClick={() => refetch()}>
						<Icon name='RefreshCcw' size={isSmallScreen ? 18 : 16} />{' '}
						{!isSmallScreen && t('ns_common:actions.reload')}
					</Button>
				</Form>
			</FormProvider>
			{!isEmpty(searchParams) && (
				<Div className='px-4 duration-300 ease-in animate-in fade-in-0'>
					<DownloadExcelButton variant='secondary' />
				</Div>
			)}
		</Div>
	)
}

const BrandNameComboboxFieldControl: React.FC<ComboboxProps> = ({ data, isLoading }) => {
	const { t } = useTranslation()

	const [searchTerm, setSearchTerm] = useState<string>('')

	const filteredData = useMemo(() => {
		if (!Array.isArray(data)) return []
		return data.filter((item) => item.value?.toUpperCase()?.includes(searchTerm.toUpperCase()))
	}, [data, searchTerm])

	return (
		<Div className='flex-1'>
			<ComboboxFieldControl
				name='brand_name'
				loading={isLoading}
				placeholder={capitalize(
					t('ns_common:form_placeholder.select', {
						object: t('ns_erp:fields.brand_name'),
						defaultValue: 'Select customer brand'
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

const ShoesStyleCombobox: React.FC<ComboboxProps> = ({ data, isLoading }) => {
	const { t } = useTranslation()

	const [searchTerm, setSearchTerm] = useState<string>('')

	const filteredData = useMemo(() => {
		if (!Array.isArray(data)) return []
		return data.filter((item) => item.value?.toUpperCase()?.includes(searchTerm.toUpperCase()))
	}, [data, searchTerm])

	return (
		<Div className='flex-1'>
			<ComboboxFieldControl
				name='shoes_style'
				placeholder={capitalize(
					t('ns_common:form_placeholder.select', {
						object: t('ns_erp:fields.factory_shoes_style'),
						defaultValue: 'Select shoes style'
					})
				)}
				shouldFilter={false}
				loading={isLoading}
				datalist={filteredData}
				onInput={setSearchTerm}
				labelField='label'
				valueField='value'
			/>
		</Div>
	)
}

const ColorCombobox: React.FC<ComboboxProps> = ({ data, isLoading }) => {
	const { t } = useTranslation()

	const [searchTerm, setSearchTerm] = useState<string>('')

	const filteredData = useMemo(() => {
		if (!Array.isArray(data)) return []
		return data.filter((item) => item.value?.toUpperCase()?.includes(searchTerm.toUpperCase()))
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
				loading={isLoading}
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
