import { Div, Icon, Popover, PopoverContent, PopoverTrigger, Tooltip, buttonVariants } from '../..'
import { DebouncedInput } from './debounced-input'
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { TableContext } from '../context/table.context'
import { cn } from '@/common/utils/cn'
import useMediaQuery from '@/common/hooks/use-media-query'
import { BreakPoints } from '@/common/constants/enums'

export const GlobalFilter: React.FC = () => {
	const { t } = useTranslation('ns_common', { keyPrefix: 'actions' })
	const { globalFilter, setGlobalFilter, enableGlobalFilter } = useContext(TableContext)

	if (!enableGlobalFilter) return null

	return (
		<Div className='relative flex w-full items-center gap-x-2 rounded-[var(--radius)] border px-2 sm:hidden md:max-w-1/2 lg:max-w-1/2 xl:max-w-1/4'>
			<Icon name='Search' />
			<DebouncedInput
				value={globalFilter}
				onChange={(value) => setGlobalFilter(String(value))}
				className='font-lg w-full flex-1 border bg-background px-0 shadow-none'
				placeholder={t('search') + ' ... '}
				type='search'
			/>
		</Div>
	)
}

export const GlobalFilterPopover: React.FC = () => {
	const { t } = useTranslation()
	const { globalFilter, setGlobalFilter, enableGlobalFilter } = useContext(TableContext)
	const isSmallScreen = useMediaQuery(BreakPoints.SMALL)

	if (!enableGlobalFilter) return null

	return (
		isSmallScreen && (
			<Popover>
				<Tooltip message={t('ns_common:actions.search')} triggerProps={{ asChild: true }}>
					<PopoverTrigger className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
						<Icon name='Search' />
					</PopoverTrigger>
				</Tooltip>
				<PopoverContent align='center' side='left' sideOffset={4} className='w-fit p-0'>
					<Div className='relative w-fit'>
						<Icon name='Search' className='absolute left-2 top-1/2 -translate-y-1/2' />
						<DebouncedInput
							value={globalFilter}
							onChange={(value) => setGlobalFilter(String(value))}
							className='font-lg border p-2 pl-8'
							placeholder='Tìm kiếm ...'
							type='search'
						/>
					</Div>
				</PopoverContent>
			</Popover>
		)
	)
}
