import { Table } from '@tanstack/react-table'
import { Div, Button, Icon, Popover, PopoverContent, PopoverTrigger, Tooltip } from '../..'
import { DebouncedInput } from './debounced-input'
import { useTranslation } from 'react-i18next'

type GlobalFilterProps<T> = {
	table: Table<T>
	globalFilter: string | undefined
	onGlobalFilterChange: React.Dispatch<React.SetStateAction<string>>
}

export function GlobalFilter<T>(props: GlobalFilterProps<T>) {
	const { t } = useTranslation('ns_common', { keyPrefix: 'actions' })

	return (
		<>
			<Div className='relative w-fit sm:hidden'>
				<Icon name='Search' className='absolute left-2 top-1/2 -translate-y-1/2' />
				<DebouncedInput
					value={props.globalFilter ?? ''}
					onChange={(value) => props.onGlobalFilterChange(String(value))}
					className='font-lg w-full border p-2 pl-8 shadow'
					placeholder={t('search') + ' ... '}
					type='search'
				/>
			</Div>
		</>
	)
}

export function GlobalFilterPopover<T>(props: GlobalFilterProps<T>) {
	return (
		<Popover>
			<Tooltip content='Tìm kiếm'>
				<PopoverTrigger asChild>
					<Button variant='outline' size='icon' className='h-8 w-8'>
						<Icon name='Search' />
					</Button>
				</PopoverTrigger>
			</Tooltip>
			<PopoverContent align='center' side='left' sideOffset={4} className='w-fit border-none p-0'>
				<Div className='relative w-fit'>
					<Icon name='Search' className='absolute left-2 top-1/2 -translate-y-1/2' />
					<DebouncedInput
						value={props.globalFilter ?? ''}
						onChange={(value) => props.onGlobalFilterChange(String(value))}
						className='font-lg border p-2 pl-8 shadow'
						placeholder='Tìm kiếm ...'
						type='search'
					/>
				</Div>
			</PopoverContent>
		</Popover>
	)
}
