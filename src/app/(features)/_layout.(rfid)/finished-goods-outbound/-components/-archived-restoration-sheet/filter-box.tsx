import { cn } from '@/common/utils/cn'
import {
	Button,
	ComboboxFieldControl,
	Div,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	Icon,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	RadioGroup,
	RadioGroupItem,
	SelectFieldControl,
	Separator,
	Tooltip,
	Typography
} from '@/components/ui'
import { PopoverClose } from '@radix-ui/react-popover'
import { useDebounceEffect, useDeepCompareEffect } from 'ahooks'
import { isEmpty, sortBy } from 'lodash'
import { Fragment, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ScannedStatus } from '../../-constants'
import { useArchivedRestorationContext } from '../../-contexts/archived-sheet-context'
import { useGetArchivedEpcFeatureQuery } from '../../-hooks'
import { FilterForm, GhostButton } from './styled'

type SearchFormValues = {
	shoes_style: string
	color_sn: string
	mo_no: string
	size_numcode: string
	scanned: ScannedStatus
}

const ArchivedEpcFilter: React.FC = () => {
	const { t } = useTranslation()

	const [filterOpen, setFilterOpen] = useState<boolean>(false)
	const { data } = useGetArchivedEpcFeatureQuery()
	const [search, setSearch] = useState<string>('')

	const { searchTerm, advancedFilters, setSearchTerm, setAdvancedFilters } = useArchivedRestorationContext(
		'limit',
		'searchTerm',
		'setSearchTerm',
		'advancedFilters',
		'setAdvancedFilters'
	)

	const form = useForm<SearchFormValues>({
		mode: 'onChange',
		defaultValues: {
			shoes_style: '',
			color_sn: '',
			mo_no: '',
			size_numcode: '',
			scanned: ScannedStatus.ALL
		}
	})

	const currentShoesStyle = useWatch({ control: form.control, name: 'shoes_style' })
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

	useDebounceEffect(
		() => {
			setSearchTerm(search)
		},
		[search],
		{ wait: 300 }
	)

	const handleSearch = (data: SearchFormValues) => {
		setAdvancedFilters({
			...data,
			scanned: data.scanned === ScannedStatus.ALL ? null : data.scanned === ScannedStatus.SCANNED ? true : false
		})
	}

	return (
		<Popover open={filterOpen} onOpenChange={setFilterOpen}>
			<PopoverTrigger className='group relative flex h-10 items-center justify-between gap-x-3 rounded-md border bg-background px-3 py-1'>
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
					<GhostButton
						aria-expanded={filterOpen}
						className={cn('aspect-square basis-5 aria-expanded:text-active')}>
						<Icon name='ListFilter' />
					</GhostButton>
				</Tooltip>
			</PopoverTrigger>
			<PopoverContent
				side='bottom'
				sideOffset={8}
				className='relative w-[var(--radix-popover-trigger-width)] p-6'
				onOpenAutoFocus={(e) => e.preventDefault()}
				onWheel={(e) => e.stopPropagation()}>
				<PopoverClose className='absolute right-3 top-3 text-muted-foreground transition-colors duration-200 hover:text-foreground'>
					<Icon name='X' />
				</PopoverClose>
				<Form {...form}>
					<FilterForm className='space-y-1.5' onSubmit={form.handleSubmit(handleSearch)}>
						<Div as='fieldset' className='space-y-6'>
							<Typography as='legend' className='font-medium'>
								{t('ns_erp:titles.product_info')}
							</Typography>
							<Div className='space-y-3'>
								<ComboboxFieldControl
									label={t('ns_erp:fields.shoestyle_codefactory')}
									name='shoes_style'
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
							</Div>
						</Div>
						<Separator />
						<Div as='fieldset' className='space-y-6'>
							<Typography as='legend' className='font-medium'>
								{t('ns_common:common_fields.status')}
							</Typography>
							<FormField
								name='scanned'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<RadioGroup
											value={field.value}
											onValueChange={field.onChange}
											className='flex items-center gap-x-10'>
											<FormItem className='flex items-center gap-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value={ScannedStatus.ALL} />
												</FormControl>
												<FormLabel className='cursor-pointer'>{t('ns_common:others.all')}</FormLabel>
											</FormItem>
											<FormItem className='flex items-center gap-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value={ScannedStatus.SCANNED} />
												</FormControl>
												<FormLabel className='cursor-pointer'>{t('ns_rfid:status.scanned')}</FormLabel>
											</FormItem>
											<FormItem className='flex items-center gap-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value={ScannedStatus.UNSCANNED} />
												</FormControl>
												<FormLabel className='cursor-pointer'>{t('ns_rfid:status.unscanned')}</FormLabel>
											</FormItem>
										</RadioGroup>
									</FormItem>
								)}
							/>
						</Div>
						<Separator />
						<Div className='mt-6 flex items-center justify-end gap-x-2'>
							<PopoverClose asChild>
								<Button type='submit'>
									<Icon name='Search' /> {t('ns_common:actions.search')}
								</Button>
							</PopoverClose>
							<Button type='button' variant='secondary' onClick={() => form.reset()}>
								<Icon name='Undo' />
								{t('ns_common:actions.reset')}
							</Button>
						</Div>
					</FilterForm>
				</Form>
			</PopoverContent>
		</Popover>
	)
}

export default ArchivedEpcFilter
