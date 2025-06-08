import {
	ComboboxFieldControl,
	Form,
	Icon,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	SelectFieldControl,
	Separator,
	Tooltip
} from '@/components/ui'
import { useDebounceEffect, useDeepCompareEffect } from 'ahooks'
import { isEmpty, sortBy } from 'lodash'
import { Fragment, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useGetArchivedEpcFeatureQuery } from '../../_apis/outbound-rfid.api'
import { useArchivedRestorationContext } from '../../_contexts/-archived-sheet-context'
import { FilterForm, GhostButton } from './-styled'

const ArchivedEpcFilter: React.FC = () => {
	const { t } = useTranslation()

	const [filterOpen, setFilterOpen] = useState<boolean>(false)
	const { data } = useGetArchivedEpcFeatureQuery()
	const [search, setSearch] = useState<string>('')

	const { searchTerm, advancedFilters, setSearchTerm, setAdvancedFilters } = useArchivedRestorationContext(
		'searchTerm',
		'setSearchTerm',
		'advancedFilters',
		'setAdvancedFilters'
	)

	const form = useForm({
		mode: 'onChange',
		defaultValues: {
			shoes_style_code_factory: '',
			color_sn: '',
			mo_no: '',
			size_numcode: ''
		}
	})

	const currentShoesStyle = useWatch({ control: form.control, name: 'shoes_style_code_factory' })
	const currentColor = useWatch({ control: form.control, name: 'color_sn' })
	const currentCommandNumber = useWatch({ control: form.control, name: 'mo_no' })
	const currentSize = useWatch({ control: form.control, name: 'size_numcode' })

	const shoesStyleOptions = useMemo(() => {
		if (!Array.isArray(data)) return []
		return data.map((item) => ({ shoes_style_factory_code: item.shoes_style_code_factory }))
	}, [data])

	const colorOptions = useMemo(() => {
		if (Array.isArray(data) && currentShoesStyle) {
			const feature = data.find((item) => item.shoes_style_code_factory === currentShoesStyle)
			const result = feature?.colorways?.map((color) => ({ color_sn: color?.color_sn })) ?? []
			return sortBy(result, (item) => item?.color_sn)
		} else {
			return []
		}
	}, [data, currentShoesStyle])

	const commandNumberOptions = useMemo(() => {
		if (Array.isArray(data) && currentShoesStyle) {
			const feature = data.find((item) => item.shoes_style_code_factory === currentShoesStyle)
			const colorways = feature.colorways?.find((item) => item.color_sn === currentColor)
			const result = colorways?.batches?.map((item) => ({ mo_no: item?.mo_no })) ?? []
			return sortBy(result, (item) => item?.mo_no)
		} else {
			return []
		}
	}, [data, currentShoesStyle, currentColor])

	const sizeOptions = useMemo(() => {
		if (Array.isArray(data) && currentShoesStyle && currentColor && currentCommandNumber) {
			const feature = data.find((item) => item.shoes_style_code_factory === currentShoesStyle)
			const colorways = feature.colorways?.find((item) => item.color_sn === currentColor)
			if (!colorways) return []
			const batch = colorways?.batches?.find((item) => item.mo_no === currentCommandNumber)
			if (!batch) return []
			const result = batch?.sizes?.map((size) => ({ size_numcode: size })) ?? []
			return sortBy(result, (item) => item.size_numcode)
		} else {
			return []
		}
	}, [data, currentShoesStyle, currentColor, currentCommandNumber])

	useDeepCompareEffect(() => {
		if (!colorOptions.some((item) => item.color_sn === currentColor)) {
			form.setValue('color_sn', '')
		}
		if (!commandNumberOptions.some((item) => item.mo_no === currentCommandNumber)) {
			form.setValue('mo_no', '')
		}
		if (!sizeOptions.some((item) => item.size_numcode === currentSize)) {
			form.setValue('size_numcode', '')
		}
	}, [colorOptions, commandNumberOptions, sizeOptions])

	useDeepCompareEffect(() => {
		setAdvancedFilters({
			shoes_style_code_factory: currentShoesStyle,
			color_sn: currentColor,
			mo_no: currentCommandNumber,
			size_numcode: currentSize
		})
	}, [currentShoesStyle, currentColor, currentCommandNumber, currentSize])

	useDebounceEffect(
		() => {
			setSearchTerm(search)
		},
		[search],
		{ wait: 300 }
	)

	return (
		<Popover open={filterOpen} onOpenChange={setFilterOpen}>
			<PopoverTrigger className='group relative flex h-9 items-center justify-between gap-x-3 rounded-md border bg-background px-3 py-1'>
				<Icon
					name='Search'
					stroke='hsl(var(--muted-foreground))'
					className='absolute left-3 top-1/2 -translate-y-1/2'
					size={20}
				/>
				<Input
					className='static z-10 h-max border-none bg-transparent px-0 pl-8 shadow-none focus:border-none focus:outline-none'
					placeholder={t('ns_common:form_placeholder.search', {
						object: 'EPC',
						defaultValue: 'Search EPC ...'
					})}
					value={search}
					onClick={(e) => e.stopPropagation()}
					onFocus={(e) => e.stopPropagation()}
					onInput={(e) => setSearch(e.currentTarget.value)}
				/>
				{(searchTerm || !Object.values(advancedFilters).every(isEmpty)) && (
					<Fragment>
						<Tooltip message={t('ns_common:actions.clear_filter')} triggerProps={{ asChild: true }}>
							<GhostButton
								onClick={(e) => {
									e.stopPropagation()
									form.reset()
								}}>
								<Icon name='X' />
							</GhostButton>
						</Tooltip>
						<Separator orientation='vertical' />
					</Fragment>
				)}
				<Tooltip message={t('ns_common:table.filter')} triggerProps={{ asChild: true }}>
					<GhostButton aria-expanded={filterOpen} className='aspect-square basis-5 aria-expanded:text-foreground'>
						<Icon name='ListFilter' />
					</GhostButton>
				</Tooltip>
			</PopoverTrigger>
			<PopoverContent
				side='bottom'
				sideOffset={8}
				className='w-[var(--radix-popover-trigger-width)]'
				onOpenAutoFocus={(e) => e.preventDefault()}>
				<Form {...form}>
					<FilterForm className='grid gap-4' onSubmit={form.handleSubmit(setAdvancedFilters)}>
						<ComboboxFieldControl
							label={t('ns_erp:fields.shoestyle_codefactory')}
							name='shoes_style_code_factory'
							orientation='horizontal'
							datalist={shoesStyleOptions}
							labelField='shoes_style_factory_code'
							valueField='shoes_style_factory_code'
						/>
						<ComboboxFieldControl
							label={t('ns_erp:fields.color_sn')}
							name='color_sn'
							orientation='horizontal'
							datalist={colorOptions}
							labelField='color_sn'
							valueField='color_sn'
						/>
						<ComboboxFieldControl
							label={t('ns_erp:fields.mo_no')}
							name='mo_no'
							orientation='horizontal'
							datalist={commandNumberOptions}
							labelField='mo_no'
							valueField='mo_no'
						/>
						<SelectFieldControl
							label='Size'
							name='size_numcode'
							orientation='horizontal'
							datalist={sizeOptions}
							labelField='size_numcode'
							valueField='size_numcode'
						/>
					</FilterForm>
				</Form>
			</PopoverContent>
		</Popover>
	)
}

export default ArchivedEpcFilter
