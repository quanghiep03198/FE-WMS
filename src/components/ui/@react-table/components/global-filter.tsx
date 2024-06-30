import { Table } from '@tanstack/react-table'
import { Div, Button, Icon, Popover, PopoverContent, PopoverTrigger, Tooltip, buttonVariants } from '../..'
import { DebouncedInput } from './debounced-input'
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { TableContext } from '../context/table.context'
import { cn } from '@/common/utils/cn'

export const GlobalFilter: React.FC = () => {
	const { t } = useTranslation('ns_common', { keyPrefix: 'actions' })
	const { globalFilter, setGlobalFilter } = useContext(TableContext)

	return (
		<>
			<Div className='relative basis-1/3 sm:hidden xl:basis-1/4'>
				<Icon name='Search' className='absolute left-2 top-1/2 -translate-y-1/2' />
				<DebouncedInput
					value={globalFilter}
					onChange={(value) => setGlobalFilter(String(value))}
					className='font-lg w-full border bg-background p-2 pl-8 shadow'
					placeholder={t('search') + ' ... '}
					type='search'
				/>
			</Div>
		</>
	)
}

export const GlobalFilterPopover: React.FC = () => {
	const { t } = useTranslation()
	const { globalFilter, setGlobalFilter } = useContext(TableContext)

	return (
		<Div className='hidden sm:block'>
			<Popover>
				<Tooltip message={t('ns_common:actions.search')} triggerProps={{ asChild: true }}>
					<PopoverTrigger className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
						<Icon name='Search' />
					</PopoverTrigger>
				</Tooltip>
				<PopoverContent align='center' side='left' sideOffset={4} className='w-fit border-none p-0'>
					<Div className='relative w-fit'>
						<Icon name='Search' className='absolute left-2 top-1/2 -translate-y-1/2' />
						<DebouncedInput
							value={globalFilter}
							onChange={(value) => setGlobalFilter(String(value))}
							className='font-lg border p-2 pl-8 shadow'
							placeholder='Tìm kiếm ...'
							type='search'
						/>
					</Div>
				</PopoverContent>
			</Popover>
		</Div>
	)
}
