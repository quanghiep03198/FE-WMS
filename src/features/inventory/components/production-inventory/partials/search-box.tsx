import { Div } from '@components/customs/div'
import { ComboboxFieldControl } from '@components/forms/combobox'
import { Button } from '@components/ui/button'
import { Form as FormProvider } from '@components/ui/form'
import { Icon } from '@components/ui/icon'
import { Separator } from '@components/ui/separator'
import { useGetProductSpecsQuery } from '@features/product-specification/hooks/use-product-specs-request'
import useMediaQuery from '@hooks/use-media-query'
import useQueryParams from '@hooks/use-query-params'
import { capitalize, isEmpty, uniqBy } from 'lodash-es'
import { useMemo, useState } from 'react'
import { useForm, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useGetProductionInventoryQuery } from '../../../hooks/use-production-inventory-request'
import DownloadExcelButton from './download-excel-button'

type ComboboxProps = { data: Record<'label' | 'value', string>[]; isLoading: boolean }

const SearchBox: React.FC = () => {
	const { t, i18n } = useTranslation()
	const isSmallScreen = useMediaQuery('(max-width:800px)')
	const { refetch } = useGetProductionInventoryQuery()
	const { searchParams, setParams } =
		useQueryParams<Record<'brand_name' | 'factory_shoes_style' | 'color_sn', string>>()

	const { data, isLoading } = useGetProductSpecsQuery()

	const form = useForm<Record<'brand_name' | 'factory_shoes_style' | 'color_sn', string>>({
		defaultValues: searchParams ? { ...searchParams } : { factory_shoes_style: '', color_sn: '' }
	})
	const selectedBrandName = useWatch({ control: form.control, name: 'brand_name' })
	const selectedShoesStyle = useWatch({ control: form.control, name: 'factory_shoes_style' })

	const brandNameOptions = useMemo(() => {
		if (!Array.isArray(data)) return []
		const options = [...new Set(data.map((item) => item.brand_name))].map((brand) => ({
			label: brand,
			value: brand
		}))
		options.unshift({ label: t('ns_common:others.all'), value: '' })
		return options
	}, [data, i18n.language])

	const shoesStyleOptions = useMemo(() => {
		if (!Array.isArray(data)) return []
		const options = data
			.filter((item) => {
				if (!selectedBrandName) return true
				return item.brand_name === selectedBrandName
			})
			.map((item) => ({ label: item.factory_shoes_style, value: item.factory_shoes_style }))
			.toSorted((a, b) => b.label.localeCompare(a.label))
		options.unshift({ label: t('ns_common:others.all'), value: '' })
		return options
	}, [data, selectedBrandName, i18n.language])

	const colorOptions = useMemo(() => {
		if (!Array.isArray(data)) return []

		const options = uniqBy(
			data
				.filter((item) => {
					if (!selectedShoesStyle) return true
					return item.factory_shoes_style === selectedShoesStyle
				})
				.flatMap((item) =>
					item.product_variants.map((variant) => ({ label: variant.color_sn, value: variant.color_sn }))
				),
			(item) => item.value
		).toSorted((a, b) => a.label.localeCompare(b.label))
		options.unshift({ label: t('ns_common:others.all'), value: '' })
		return options
	}, [data, selectedBrandName, selectedShoesStyle, i18n.language])

	const isFormEmpty = isEmpty(searchParams)

	return (
		<Div
			aria-selected={!isFormEmpty}
			className='mx-auto max-w-5xl block aria-selected:[&_*[role=separator]]:block [&_*[role=separator]]:hidden aria-selected:flex items-center justify-center gap-4 md:gap-x-2'>
			<FormProvider {...form}>
				<Form
					onSubmit={form.handleSubmit((values) => {
						setParams(values)
					})}>
					<BrandNameComboboxFieldControl data={brandNameOptions} isLoading={isLoading} />
					<ShoesStyleCombobox data={shoesStyleOptions} isLoading={isLoading} />
					<ColorCombobox data={colorOptions} isLoading={isLoading} />
					<Button
						// disabled={!form.watch('factory_shoes_style') || !form.watch('color_sn')}
						size={isSmallScreen ? 'icon' : 'default'}
						type='submit'>
						<Icon name='Search' size={isSmallScreen ? 18 : 16} />{' '}
						{!isSmallScreen && t('ns_common:actions.search')}
					</Button>
					<Button
						// disabled={!form.watch('factory_shoes_style') || !form.watch('color_sn')}
						size={isSmallScreen ? 'icon' : 'default'}
						type='button'
						variant='outline'
						onClick={() => refetch()}>
						<Icon name='RefreshCcw' size={isSmallScreen ? 18 : 16} />{' '}
						{!isSmallScreen && t('ns_common:actions.reload')}
					</Button>
				</Form>
			</FormProvider>
			<Separator className='w-0.5 h-8' orientation='vertical' role='separator' />
			{!isEmpty(searchParams) && (
				<Div className='animate-in fade-in-0 duration-300 ease-in'>
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
		return data.filter((item) => item.value?.toUpperCase()?.includes(searchTerm?.toUpperCase()))
	}, [data, searchTerm])

	const { watch } = useFormContext()

	const placeholder = capitalize(
		watch('brand_name') === ''
			? t('ns_common:others.all')
			: t('ns_common:form_placeholder.select', {
					object: t('ns_erp:fields.brand_name'),
					defaultValue: 'Select customer brand'
				})
	)

	return (
		<Div className='flex-1'>
			<ComboboxFieldControl
				datalist={filteredData}
				labelField='label'
				loading={isLoading}
				name='brand_name'
				shouldFilter={false}
				valueField='value'
				placeholder={placeholder}
				onInput={setSearchTerm}
			/>
		</Div>
	)
}

const ShoesStyleCombobox: React.FC<ComboboxProps> = ({ data, isLoading }) => {
	const { t } = useTranslation()

	const [searchTerm, setSearchTerm] = useState<string>('')

	const filteredData = useMemo(() => {
		if (!Array.isArray(data)) return []
		return data.filter((item) => item.value?.toUpperCase()?.includes(searchTerm?.toUpperCase?.()))
	}, [data, searchTerm])

	const { watch } = useFormContext()

	const placeholder = capitalize(
		watch('factory_shoes_style') === ''
			? t('ns_common:others.all')
			: t('ns_common:form_placeholder.select', {
					object: t('ns_erp:fields.factory_shoes_style'),
					defaultValue: 'Select shoes style'
				})
	)

	return (
		<Div className='flex-1'>
			<ComboboxFieldControl
				datalist={filteredData}
				labelField='label'
				loading={isLoading}
				name='factory_shoes_style'
				placeholder={placeholder}
				shouldFilter={false}
				valueField='value'
				onInput={setSearchTerm}
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

	const { watch } = useFormContext()

	const placeholder = capitalize(
		watch('color_sn') === ''
			? t('ns_common:others.all')
			: t('ns_common:form_placeholder.select', {
					object: t('ns_erp:fields.color_sn'),
					defaultValue: 'Select color'
				})
	)

	return (
		<Div className='flex-1'>
			<ComboboxFieldControl
				datalist={filteredData}
				labelField='label'
				loading={isLoading}
				name='color_sn'
				placeholder={placeholder}
				shouldFilter={false}
				valueField='value'
				onInput={setSearchTerm}
			/>
		</Div>
	)
}

const Form = tw.form`flex items-center gap-x-2 w-full max-w-full mx-auto py-6 flex-1`

export default SearchBox
