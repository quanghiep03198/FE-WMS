import { cn } from '@/common/utils/cn'
import { useTranslation } from 'react-i18next'
import { Icon, Popover, PopoverContent, PopoverTrigger, Tooltip, buttonVariants } from '../..'
import { useTableContext } from '../context/table.context'
import { DebouncedInput } from './debounced-input'

export const GlobalFilterPopover: React.FC = () => {
	const { t } = useTranslation()
	const { globalFilter, setGlobalFilter, enableGlobalFilter } = useTableContext()

	if (!enableGlobalFilter) return null

	return (
		<Popover>
			<Tooltip message={t('ns_common:actions.search')} triggerProps={{ asChild: true }}>
				<PopoverTrigger className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
					<Icon name='Search' />
				</PopoverTrigger>
			</Tooltip>
			<PopoverContent align='end' side='left' sideOffset={4} className='relative w-64 p-0'>
				<Icon name='Search' className='absolute left-2 top-1/2 -translate-y-1/2' />
				<DebouncedInput
					value={globalFilter}
					onChange={(value) => setGlobalFilter(String(value))}
					className='font-lg border p-2 pl-8'
					placeholder='Tìm kiếm ...'
					type='search'
				/>
			</PopoverContent>
		</Popover>
	)
}
