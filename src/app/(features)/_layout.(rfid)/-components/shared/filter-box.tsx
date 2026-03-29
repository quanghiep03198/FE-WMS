import { cn } from '@/common/utils/cn'
import {
	AutoCompleteFieldControl,
	Button,
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
	Separator,
	Tooltip,
	Typography
} from '@/components/ui'
import { PopoverClose } from '@radix-ui/react-popover'
import { useDebounceEffect, useResetState } from 'ahooks'
import { capitalize, isEmpty } from 'lodash-es'
import { Fragment, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RFIDDataType, ScanCapability, ScannedStatus } from '../../-constants'
import { useGetArchivedEpcFeatureQuery } from '../../-hooks/use-data-restoration-asm'
import type { SearchFormValues } from '../../-hooks/use-persistent-filter-state'
import { usePersistentFilterState } from '../../-hooks/use-persistent-filter-state'
import { FilterForm, GhostButton } from './styled'

type ArchivedEpcFilterProps = {
	dataType: RFIDDataType
}

const ArchivedEpcFilter: React.FC<ArchivedEpcFilterProps> = ({ dataType }) => {
	const { t } = useTranslation()
	const [filterOpen, setFilterOpen] = useState<boolean>(false)
	const { data } = useGetArchivedEpcFeatureQuery()
	const [search, setSearch, resetSearch] = useResetState<string>('')

	const defaultFormValues = useMemo(() => {
		const values: Partial<SearchFormValues> = {
			shoes_style: null,
			color_sn: null,
			mo_no: null,
			size_numcode: null
		}
		switch (dataType) {
			case RFIDDataType.INBOUND:
				values['scannable'] = 'all'
				break
			case RFIDDataType.OUTBOUND:
				values['scanned'] = 'all'
				break
			default:
				break
		}

		return values
	}, [dataType])

	const [persistentFormValues, setPersistentFormValues] = usePersistentFilterState(dataType)

	const form = useForm<SearchFormValues>({
		mode: 'onChange',
		defaultValues: persistentFormValues
	})

	const currentShoesStyle = useWatch({ control: form.control, name: 'shoes_style' })
	const currentColor = useWatch({ control: form.control, name: 'color_sn' })
	const currentCommandNumber = useWatch({ control: form.control, name: 'mo_no' })

	/**
	 * Pre-build a lookup index from the flat API data once.
	 * This avoids repeated flatMap/filter/uniqBy on every cascading filter change.
	 *
	 * Structure:
	 *   styleToColors: Map<shoes_style, Set<color_sn>>
	 *   colorToBatches: Map<"style|color", Set<mo_no>>
	 *   batchToSizes: Map<"style|color|mo_no", Set<size>>
	 *   allColors: Set<color_sn>
	 *   allBatches: Set<mo_no>
	 *   allSizes: Set<size>
	 */
	const index = useMemo(() => {
		const styles = new Set<string>()
		const allColors = new Set<string>()
		const allBatches = new Set<string>()
		const allSizes = new Set<string>()
		const styleToColors = new Map<string, Set<string>>()
		const colorToBatches = new Map<string, Set<string>>()
		const batchToSizes = new Map<string, Set<string>>()

		if (!Array.isArray(data))
			return { styles, allColors, allBatches, allSizes, styleToColors, colorToBatches, batchToSizes }

		for (const item of data) {
			const style = item.factory_shoes_style
			styles.add(style)

			if (!styleToColors.has(style)) styleToColors.set(style, new Set())
			const colorsForStyle = styleToColors.get(style)!

			for (const clw of item.colorways ?? []) {
				const color = clw.color_sn
				allColors.add(color)
				colorsForStyle.add(color)

				const scKey = `${style}|${color}`
				if (!colorToBatches.has(scKey)) colorToBatches.set(scKey, new Set())
				const batchesForColor = colorToBatches.get(scKey)!

				for (const batch of clw.batches ?? []) {
					const mo = batch.mo_no
					allBatches.add(mo)
					batchesForColor.add(mo)

					const scmKey = `${style}|${color}|${mo}`
					if (!batchToSizes.has(scmKey)) batchToSizes.set(scmKey, new Set())
					const sizesForBatch = batchToSizes.get(scmKey)!

					for (const size of batch.sizes ?? []) {
						allSizes.add(size)
						sizesForBatch.add(size)
					}
				}
			}
		}

		return { styles, allColors, allBatches, allSizes, styleToColors, colorToBatches, batchToSizes }
	}, [data])

	const compareSizes = (a: string, b: string) =>
		Number.parseFloat(a.replace(/^0/, '')) - Number.parseFloat(b.replace(/^0/, ''))

	const shoesStyleOptions = useMemo(
		() =>
			Array.from(index.styles)
				.sort()
				.map((v) => ({ shoes_style_factory_code: v })),
		[index]
	)

	const colorOptions = useMemo(() => {
		const set = currentShoesStyle
			? (index.styleToColors.get(currentShoesStyle) ?? new Set<string>())
			: index.allColors
		return Array.from(set)
			.sort()
			.map((v) => ({ color_sn: v }))
	}, [index, currentShoesStyle])

	const commandNumberOptions = useMemo(() => {
		const result = new Set<string>()

		if (currentShoesStyle && currentColor) {
			const batches = index.colorToBatches.get(`${currentShoesStyle}|${currentColor}`)
			if (batches) batches.forEach((v) => result.add(v))
		} else if (currentShoesStyle) {
			const colors = index.styleToColors.get(currentShoesStyle) ?? new Set<string>()
			for (const color of colors) {
				const batches = index.colorToBatches.get(`${currentShoesStyle}|${color}`)
				if (batches) batches.forEach((v) => result.add(v))
			}
		} else if (currentColor) {
			for (const [key, batches] of index.colorToBatches) {
				if (key.endsWith(`|${currentColor}`)) batches.forEach((v) => result.add(v))
			}
		} else {
			return Array.from(index.allBatches)
				.sort()
				.map((v) => ({ mo_no: v }))
		}

		return Array.from(result)
			.sort()
			.map((v) => ({ mo_no: v }))
	}, [index, currentShoesStyle, currentColor])

	const sizeOptions = useMemo(() => {
		const result = new Set<string>()

		if (currentShoesStyle || currentColor || currentCommandNumber) {
			const styles = currentShoesStyle ? [currentShoesStyle] : Array.from(index.styles)
			for (const style of styles) {
				const colors = currentColor ? [currentColor] : Array.from(index.styleToColors.get(style) ?? [])
				for (const color of colors) {
					const batches = currentCommandNumber
						? [currentCommandNumber]
						: Array.from(index.colorToBatches.get(`${style}|${color}`) ?? [])
					for (const mo of batches) {
						const sizes = index.batchToSizes.get(`${style}|${color}|${mo}`)
						if (sizes) sizes.forEach((v) => result.add(v))
					}
				}
			}
		} else {
			return Array.from(index.allSizes)
				.sort(compareSizes)
				.map((v) => ({ size_numcode: v }))
		}

		return Array.from(result)
			.sort(compareSizes)
			.map((v) => ({ size_numcode: v }))
	}, [index, currentShoesStyle, currentColor, currentCommandNumber])

	useDebounceEffect(
		() => {
			setPersistentFormValues({ ...persistentFormValues, epc: search })
		},
		[search],
		{ wait: 300 }
	)

	const handleSearch = (data: SearchFormValues) => {
		switch (dataType) {
			case RFIDDataType.INBOUND:
				setPersistentFormValues({
					...data,
					scanned: null
					// scannable: data.scannable === 'all' ? null : data.scannable === ScanCapability.SCANNABLE ? true : false
				})
				break

			case RFIDDataType.OUTBOUND:
				setPersistentFormValues({
					...data,
					scannable: null
					// scanned: data.scanned === 'all' ? null : data.scanned === ScannedStatus.SCANNED ? true : false
				})
				break

			default:
				break
		}
	}

	const handleReset = () => {
		const defaultValues: Partial<SearchFormValues> = {
			limit: 100,
			epc: '',
			shoes_style: '',
			color_sn: '',
			mo_no: '',
			size_numcode: '',
			...(dataType === RFIDDataType.INBOUND && { scannable: 'all' }),
			...(dataType === RFIDDataType.OUTBOUND && { scanned: 'all' })
		}
		form.reset(defaultValues)
		setPersistentFormValues(defaultValues)
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
				{!Object.values(persistentFormValues).every(isEmpty) && (
					<Fragment>
						<Tooltip message={t('ns_common:actions.clear_filter')} triggerProps={{ asChild: true }}>
							<GhostButton
								onClick={(e) => {
									e.stopPropagation()
									form.reset(defaultFormValues)
									resetSearch()
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
								<AutoCompleteFieldControl
									label={t('ns_erp:fields.factory_shoes_style')}
									name='shoes_style'
									placeholder={capitalize(
										t('ns_common:form_placeholder.fill', {
											object: t('ns_erp:fields.factory_shoes_style'),
											defaultValue: null
										})
									)}
									orientation='horizontal'
									datalist={shoesStyleOptions}
									labelField='shoes_style_factory_code'
									valueField='shoes_style_factory_code'
								/>
								<AutoCompleteFieldControl
									label={t('ns_erp:fields.color_sn')}
									name='color_sn'
									placeholder={capitalize(
										t('ns_common:form_placeholder.fill', {
											object: t('ns_erp:fields.color_sn'),
											defaultValue: null
										})
									)}
									orientation='horizontal'
									datalist={colorOptions}
									labelField='color_sn'
									valueField='color_sn'
								/>
								<AutoCompleteFieldControl
									label={t('ns_erp:fields.mo_no')}
									name='mo_no'
									placeholder={capitalize(
										t('ns_common:form_placeholder.fill', {
											object: t('ns_erp:fields.mo_no'),
											defaultValue: null
										})
									)}
									orientation='horizontal'
									datalist={commandNumberOptions}
									labelField='mo_no'
									valueField='mo_no'
								/>
								<AutoCompleteFieldControl
									label='Size'
									name='size_numcode'
									orientation='horizontal'
									datalist={sizeOptions}
									placeholder={capitalize(
										t('ns_common:form_placeholder.fill', { object: 'Size', defaultValue: null })
									)}
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
								name={dataType === RFIDDataType.INBOUND ? 'scannable' : 'scanned'}
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<RadioGroup
											value={field.value}
											onValueChange={field.onChange}
											className='flex items-center gap-x-10'>
											<FormItem className='flex items-center gap-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='all' />
												</FormControl>
												<FormLabel className='cursor-pointer'>{t('ns_common:others.all')}</FormLabel>
											</FormItem>
											<FormItem className='flex items-center gap-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem
														value={
															dataType === RFIDDataType.INBOUND
																? ScanCapability.SCANNABLE
																: ScannedStatus.SCANNED
														}
													/>
												</FormControl>
												<FormLabel className='cursor-pointer'>
													{dataType === RFIDDataType.INBOUND
														? t('ns_rfid:status.scannable')
														: t('ns_rfid:status.scanned')}
												</FormLabel>
											</FormItem>
											<FormItem className='flex items-center gap-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem
														value={
															dataType === RFIDDataType.INBOUND
																? ScanCapability.UNSCANNABLE
																: ScannedStatus.UNSCANNED
														}
													/>
												</FormControl>
												<FormLabel className='cursor-pointer'>
													{dataType === RFIDDataType.INBOUND
														? t('ns_rfid:status.unscannable')
														: t('ns_rfid:status.unscanned')}
												</FormLabel>
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
							<Button type='button' variant='secondary' onClick={() => handleReset()}>
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
