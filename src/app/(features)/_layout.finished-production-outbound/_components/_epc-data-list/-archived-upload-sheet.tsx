import { useSearchCommandNumberQuery } from '@/app/(features)/_apis/use-order.api'
import useScrollToFn from '@/common/hooks/use-scroll-fn'
import { cn } from '@/common/utils/cn'
import {
	Button,
	buttonVariants,
	Checkbox,
	Combobox,
	Div,
	Icon,
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Typography
} from '@/components/ui'
import ScrollShadow, { ScrollShadowProps } from '@/components/ui/@custom/scroll-shadow'
import axiosInstance from '@/configs/axios.config'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemoizedFn, useResetState } from 'ahooks'
import { debounce } from 'lodash'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { z } from 'zod'

const VIRTUAL_ITEM_SIZE: number = 40
const PRERENDERED_ITEMS: number = 5

const schema = z.object({
	epc: z.array(z.string().nonempty()).nonempty()
})

const ArchivedUploadSheet: React.FC = () => {
	const { t } = useTranslation()
	const [searchTerm, setSearchTerm] = useState<string>('')
	const { data: commandNumbers } = useSearchCommandNumberQuery(searchTerm)
	const [currentCommandNumber, setCurrentCommandNumber] = useState<string>('')
	const [selectedEpcs, setSelectedEpcs, resetSelectedEpcs] = useResetState<string[]>([])

	const { data: archivedEpcs } = useQuery({
		queryKey: ['ARCHIVED_EPCS', currentCommandNumber],
		queryFn: async () =>
			await axiosInstance.get<void, ResponseBody<Record<'epc', string>[]>>(
				`/rfid/archived-epcs/${currentCommandNumber}`
			),
		enabled: !!currentCommandNumber,
		select: (response) => {
			if (!Array.isArray(response.metadata)) return []
			return response.metadata.map((item) => item.epc)
		}
	})

	const containerRef = useRef<HTMLDivElement>(null)
	const scrollingRef = useRef<number>(null)
	const virtualScrollFn = useScrollToFn(containerRef, scrollingRef)

	const virtualizer = useVirtualizer({
		count: archivedEpcs?.length ?? 0,
		indexAttribute: 'data-index',
		overscan: PRERENDERED_ITEMS,
		gap: 2,
		getScrollElement: () => containerRef.current,
		estimateSize: useMemoizedFn(() => VIRTUAL_ITEM_SIZE),
		scrollToFn: virtualScrollFn,
		measureElement:
			typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
				? useMemoizedFn((element) => element?.getBoundingClientRect().height)
				: undefined
	})

	const handleSelectEpc = (checked: CheckedState, value) => {
		if (checked) setSelectedEpcs((prev) => [...prev, value])
		else setSelectedEpcs((prev) => prev.filter((epc) => epc !== value))
	}

	const isSomeItemsSelected = selectedEpcs?.length > 0 && selectedEpcs?.length < archivedEpcs?.length
	const isAllItemsSelected = selectedEpcs?.length === archivedEpcs?.length

	console.table(selectedEpcs)

	return (
		<Sheet>
			<SheetTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'px-2 text-sm')}>
				<Icon name='ArchiveRestore' role='presentation' size={18} /> Archive
			</SheetTrigger>
			<SheetContent className='max-w-lg gap-y-6'>
				<SheetHeader>
					<SheetTitle>Archived Uploads</SheetTitle>
					<SheetDescription>
						This section contains all the uploads that have been archived. You can view details of each upload
						here.
					</SheetDescription>
				</SheetHeader>
				<SheetBody>
					<Combobox
						datalist={commandNumbers}
						labelField='mo_no'
						valueField='mo_no'
						onInput={debounce((value) => setSearchTerm(value), 200)}
						onSelect={(value) => setCurrentCommandNumber(value)}
					/>

					{!Array.isArray(archivedEpcs) || archivedEpcs.length === 0 ? (
						<Div className='flex h-full flex-col place-content-center items-center justify-center space-y-2 rounded-lg border-2 border-dashed'>
							<Icon name='ArchiveX' size={44} strokeWidth={1} stroke='hsl(var(--muted-foreground))' />
							<Typography className='font-medium'>{t('ns_common:table.no_data')}</Typography>
							<Typography variant='small' color='muted'>
								Select a command number to view all archived EPC
							</Typography>
						</Div>
					) : (
						<ListContainer>
							<ListHeader>
								<Checkbox
									checked={(isAllItemsSelected || (isSomeItemsSelected && 'indeterminate')) as CheckedState}
									onCheckedChange={(checked) => {
										if (checked) setSelectedEpcs(archivedEpcs)
										else resetSelectedEpcs()
									}}
								/>
								<Typography className='font-medium'>EPC</Typography>
							</ListHeader>
							<ListBody ref={containerRef}>
								<ListWrapper style={{ height: virtualizer.getTotalSize() }}>
									{virtualizer.getVirtualItems().map((virtualItem) => {
										const value = archivedEpcs[virtualItem.index]
										return (
											<ListItem
												key={virtualItem.key}
												data-index={virtualItem.index}
												aria-selected={selectedEpcs.includes(value)}
												htmlFor={virtualItem.key}
												style={{
													height: virtualItem.size,
													transform: `translateY(${virtualItem.start}px)`
												}}>
												<Checkbox
													id={virtualItem.key.toString()}
													checked={selectedEpcs.includes(value)}
													onCheckedChange={(checked) => handleSelectEpc(checked, value)}
												/>
												<Typography>{value}</Typography>
											</ListItem>
										)
									})}
								</ListWrapper>
							</ListBody>
						</ListContainer>
					)}

					<Typography className='text-end tracking-wide'>
						{selectedEpcs?.length}/{archivedEpcs?.length ?? 0} selected
					</Typography>
				</SheetBody>
				<SheetFooter className='flex-col gap-y-2'>
					<Button disabled={!selectedEpcs.length}>Upload</Button>
					<SheetClose asChild>
						<Button variant='outline'>Discard</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}

const SheetBody = tw.div`flex flex-col flex-1 gap-y-6 w-full`
const ListContainer = tw.div`space-y-2`
const ListHeader = tw.div`grid grid-cols-[24px_auto] items-center gap-x-6 px-2 py-4 border-b`
const ListItem = tw.label`grid grid-cols-[24px_auto] items-center gap-x-6 p-2 cursor-pointer absolute top-0 left-auto right-auto hover:bg-accent/50 hover:text-accent-foreground inset-x-0 rounded-md font-medium aria-selected:bg-accent`
const ListBody = tw(ScrollShadow)<ScrollShadowProps>`h-[50vh] !scrollbar-none`
const ListWrapper = tw.div`relative`

export default ArchivedUploadSheet
