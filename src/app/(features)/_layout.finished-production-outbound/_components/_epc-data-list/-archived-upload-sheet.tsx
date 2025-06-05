import useScrollToFn from '@/common/hooks/use-scroll-fn'
import { IElectronicProductCode } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import {
	Button,
	buttonVariants,
	Checkbox,
	ComboboxFieldControl,
	Div,
	Form,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	SelectFieldControl,
	Separator,
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Tooltip,
	Typography
} from '@/components/ui'
import ScrollShadow, { ScrollShadowProps } from '@/components/ui/@custom/scroll-shadow'
import { CheckedState } from '@radix-ui/react-checkbox'
import { notUndefined, useVirtualizer } from '@tanstack/react-virtual'
import { useMemoizedFn, useResetState } from 'ahooks'
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { useGetArchivedEpcQuery, useRestoreEpcMutation } from '../../_apis/outbound-rfid.api'

const VIRTUAL_ITEM_SIZE: number = 40
const PRERENDERED_ITEMS: number = 0

const ArchivedUploadSheet: React.FC = () => {
	const { t } = useTranslation()
	const [sheetOpen, setSheetOpen] = useState<boolean>(false)
	const [filterOpen, setFilterOpen] = useState<boolean>(false)
	const [selectedEpcs, setSelectedEpcs, resetSelectedEpcs] = useResetState<IElectronicProductCode[]>([])
	const [filterText, setFilterText, resetFilterText] = useResetState<string>('')

	const form = useForm({
		defaultValues: {
			mo_no: '',
			size_numcode: ''
		}
	})
	const currentCommandNumber = useWatch({ control: form.control, name: 'mo_no' })
	const currentSizeCode = useWatch({ control: form.control, name: 'size_numcode' })

	const { data: archivedEpcs, refetch } = useGetArchivedEpcQuery()
	const { mutateAsync, isPending, isError } = useRestoreEpcMutation()
	const [filteredEpcs, setFilteredEpcs] = useState<IElectronicProductCode[]>(archivedEpcs)

	const commandNumbers = useMemo(() => {
		if (!Array.isArray(archivedEpcs)) return []
		const uniqueCommandNumbers = new Set(archivedEpcs.map((item) => item.mo_no))
		return Array.from(uniqueCommandNumbers, (mo_no) => ({ mo_no }))
	}, [archivedEpcs])

	const sizeCodes = useMemo(() => {
		if (!Array.isArray(archivedEpcs)) return []
		if (!currentCommandNumber) return []
		const filteredEpcs = archivedEpcs.filter((item) => item.mo_no === currentCommandNumber)
		const uniqueSizeCodes = new Set(filteredEpcs.map((item) => item.size_numcode))
		return Array.from(uniqueSizeCodes, (size_numcode) => ({ size_numcode }))
	}, [archivedEpcs, currentCommandNumber])

	const handleSelectEpc = (checked: CheckedState, value: IElectronicProductCode) => {
		if (checked) setSelectedEpcs((prev) => [...prev, value])
		else setSelectedEpcs((prev) => prev.filter((item) => item.epc !== value.epc))
	}

	useEffect(() => {
		setFilteredEpcs(archivedEpcs)
	}, [archivedEpcs])

	useEffect(() => {
		const filterFn = (item: IElectronicProductCode) => {
			return (
				item.epc.toUpperCase().includes(filterText.toUpperCase()) &&
				item.mo_no.includes(currentCommandNumber) &&
				item.size_numcode.includes(currentSizeCode)
			)
		}

		setFilteredEpcs(archivedEpcs.filter(filterFn))
	}, [archivedEpcs, filterText, currentCommandNumber, currentSizeCode])

	useEffect(() => {
		setSelectedEpcs((prev) => prev.filter((item) => filteredEpcs.some((epc) => epc.epc === item.epc)))
	}, [filteredEpcs, archivedEpcs])

	const [scrollElement, setScrollElement] = useState<HTMLDivElement>(null)
	const scrollingRef = useRef<number>(null)
	const refCallback = useCallback((node: HTMLDivElement) => {
		if (node) {
			setScrollElement(node)
		}
	}, [])
	const getScrollElement = useCallback(() => scrollElement, [scrollElement])
	const scrollToFn = useScrollToFn({ current: scrollElement }, scrollingRef)
	const estimateSize = useCallback(() => VIRTUAL_ITEM_SIZE, [])
	const virtualizer = useVirtualizer({
		count: filteredEpcs?.length,
		overscan: PRERENDERED_ITEMS,
		indexAttribute: 'data-index',
		scrollToFn,
		getScrollElement,
		estimateSize,
		measureElement:
			typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
				? useMemoizedFn((element) => element?.getBoundingClientRect().height)
				: undefined
	})

	const virtualItems = virtualizer.getVirtualItems()

	const [before, after] =
		virtualItems.length > 0
			? [
					notUndefined(virtualItems[0]).start - virtualizer.options.scrollMargin,
					virtualItems.length > 0
						? virtualizer.getTotalSize() - notUndefined(virtualItems[virtualItems.length - 1]).end
						: 0
				]
			: [0, 0]

	useEffect(() => {
		// * If the popover is closed, there is no need to measure
		if (!sheetOpen) return
		virtualizer.measure()
	}, [sheetOpen, virtualizer])

	const handleResetFilter = () => {
		resetFilterText()
		form.reset()
	}

	const handleRestoreArchivedEpcs = async () => {
		const id = toast.loading(t('ns_common:notification.processing_request'))

		try {
			await mutateAsync(selectedEpcs.map((epc) => epc.epc))
			toast.success(t('ns_common:notification.success'), { id })
		} catch {
			toast.error(t('ns_common:notification.error'), { id })
		}
	}

	const isSomeItemsSelected = selectedEpcs?.length > 0 && selectedEpcs?.length < filteredEpcs?.length
	const isAllItemsSelected = selectedEpcs?.length > 0 && selectedEpcs?.length === filteredEpcs?.length

	return (
		<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
			<SheetTrigger className={cn(buttonVariants({ variant: 'ghost' }))} onClick={() => setSheetOpen(!sheetOpen)}>
				<Icon name='Archive' role='presentation' size={18} /> Archived
			</SheetTrigger>
			<SheetContent className='max-w-md gap-y-6'>
				<SheetHeader>
					<SheetTitle>{t('ns_inoutbound:titles.archived_restoration')}</SheetTitle>
					<SheetDescription>{t('ns_inoutbound:description.archived_restoration')}</SheetDescription>
				</SheetHeader>
				<SheetBody>
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
								value={filterText}
								onClick={(e) => e.stopPropagation()}
								onFocus={(e) => e.stopPropagation()}
								onInput={(e) => setFilterText(e.currentTarget.value)}
							/>
							{(filterText || currentCommandNumber || currentSizeCode) && (
								<Fragment>
									<GhostButton
										onClick={(e) => {
											e.stopPropagation()
											handleResetFilter()
										}}>
										<Icon name='X' />
									</GhostButton>
									<Separator orientation='vertical' />
								</Fragment>
							)}
							<Tooltip message={t('ns_common:table.filter')} triggerProps={{ asChild: true }}>
								<GhostButton
									aria-expanded={filterOpen}
									className='aspect-square basis-5 aria-expanded:text-foreground'>
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
								<FilterForm className='grid gap-4' onSubmit={(e) => e.preventDefault()}>
									<ComboboxFieldControl
										label={t('ns_erp:fields.mo_no')}
										name='mo_no'
										orientation='horizontal'
										datalist={commandNumbers}
										labelField='mo_no'
										valueField='mo_no'
									/>
									<SelectFieldControl
										label='Size'
										name='size_numcode'
										orientation='horizontal'
										datalist={sizeCodes}
										labelField='size_numcode'
										valueField='size_numcode'
									/>
								</FilterForm>
							</Form>
						</PopoverContent>
					</Popover>
					<ListContainer>
						<ListHeader>
							<Checkbox
								checked={(isAllItemsSelected || (isSomeItemsSelected && 'indeterminate')) as CheckedState}
								onCheckedChange={(checked) => {
									if (checked) setSelectedEpcs(filteredEpcs)
									else resetSelectedEpcs()
								}}
							/>
							<Typography className='font-medium'>EPC</Typography>
							<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
								<GhostButton onClick={() => refetch()}>
									<Icon name='RotateCw' />
								</GhostButton>
							</Tooltip>
						</ListHeader>
						{!Array.isArray(filteredEpcs) || filteredEpcs.length === 0 ? (
							<Div className='flex h-[50vh] flex-col place-content-center items-center justify-center space-y-2'>
								<Icon name='PackageOpen' size={44} strokeWidth={1} stroke='hsl(var(--muted-foreground))' />
								<Typography className='font-medium'>{t('ns_common:table.no_data')}</Typography>
							</Div>
						) : (
							<ListBody ref={refCallback}>
								{before > 0 && <ListItem style={{ width: '100%', height: before }} />}
								{virtualItems.map((virtualItem) => {
									const item = filteredEpcs[virtualItem.index]
									const isSelected = selectedEpcs.some((epc) => epc.epc === item.epc)
									return (
										<ListItem
											key={virtualItem.key}
											data-index={virtualItem.index}
											aria-selected={isSelected}
											htmlFor={virtualItem.key.toString()}
											style={{
												height: virtualItem.size
											}}>
											<Checkbox
												id={virtualItem.key.toString()}
												checked={isSelected}
												onCheckedChange={(checked) => handleSelectEpc(checked, item)}
											/>
											<Typography>{item?.epc}</Typography>
											<HoverCard openDelay={100} closeDelay={100}>
												<HoverCardTrigger asChild>
													<GhostButton>
														<Icon name='Ellipsis' />
													</GhostButton>
												</HoverCardTrigger>
												<HoverCardContent
													align='start'
													side='left'
													sideOffset={8}
													className='w-full max-w-md rounded-md bg-popover text-popover-foreground'>
													<ListDetail>
														<ListDetailItem>
															{t('ns_erp:fields.mo_no')}:{' '}
															<Typography variant='small'>{item.mo_no}</Typography>
														</ListDetailItem>
														<ListDetailItem>
															{t('ns_erp:fields.shoestyle_codefactory')}:{' '}
															<Typography variant='small'>{item.shoes_style_code_factory}</Typography>
														</ListDetailItem>
														<ListDetailItem>
															{t('ns_erp:fields.color_sn')}:{' '}
															<Typography variant='small'>{item.color_sn}</Typography>
														</ListDetailItem>
														<ListDetailItem>
															Size: <Typography variant='small'>{item.size_numcode}</Typography>
														</ListDetailItem>
													</ListDetail>
												</HoverCardContent>
											</HoverCard>
										</ListItem>
									)
								})}
								{after > 0 && <ListItem style={{ width: '100%', height: after }} />}
							</ListBody>
						)}
					</ListContainer>
					<Typography variant='small' className='block text-end font-medium tracking-wide'>
						{t('ns_common:table.selected_rows', {
							selectedRows: `${selectedEpcs?.length}/${filteredEpcs?.length ?? 0}`,
							defaultValue: null
						})}
					</Typography>
				</SheetBody>
				<SheetFooter className='flex-col gap-y-2'>
					<Button disabled={!selectedEpcs.length || isPending} onClick={() => handleRestoreArchivedEpcs()}>
						{isPending && (
							<Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' role='presentation' />
						)}
						{isError ? t('ns_common:actions.retry') : t('ns_common:actions.restore')}
					</Button>

					<SheetClose asChild>
						<Button
							variant='outline'
							onClick={() => {
								handleResetFilter()
								resetSelectedEpcs()
							}}>
							Discard
						</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}

const FilterForm = tw.form`grid gap-6 auto-rows-min`
const SheetBody = tw.div`flex flex-col flex-1 gap-y-6 w-full`
const ListContainer = tw.div`space-y-2`
const ListHeader = tw.div`grid grid-cols-[24px_auto_24px] mr-[10px] [&>:first-child]:place-self-center [&>:last-child]:place-self-center items-center gap-x-6 px-2 py-4 border-b`
const ListItem = tw.label`grid grid-cols-[24px_auto_24px] [&>:first-child]:place-self-center [&>:last-child]:place-self-center items-center gap-x-6 p-2 cursor-pointer hover:bg-accent/50 hover:text-accent-foreground inset-x-0 rounded-md font-medium aria-selected:bg-accent`
const ListBody = tw(ScrollShadow)<ScrollShadowProps>`xxl:h-[50vh] h-[40vh] space-y-1 !scroll-auto`
const ListDetail = tw.ul`flex list-inside list-disc flex-col items-stretch gap-y-2`
const ListDetailItem = tw.li`[&>small]:font-medium`
const GhostButton = tw.button`text-muted-foreground transition-colors duration-200 hover:text-foreground`

export default ArchivedUploadSheet
