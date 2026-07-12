import { ButtonGroup, buttonVariants, Icon } from '@/components/ui'
import { DebouncedInput } from '@/components/ui/@custom/debounced-input'
import type { IUser } from '@/features/auth/types'
import type { Table } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'

const UserGlobalFilter: React.FC<{ table: Table<IUser> }> = ({ table }) => {
	const { t } = useTranslation()

	return (
		<ButtonGroup
			className={buttonVariants({
				variant: 'outline',
				size: 'default',
				className: 'bg-background font-normal hover:bg-background'
			})}>
			<Icon name='Search' />
			<DebouncedInput
				value={table.getState().globalFilter}
				onChange={(value) => {
					table.setGlobalFilter(String(value))
				}}
				className='h-full min-w-44 p-0 shadow-none placeholder:text-sm md:min-w-32 md:max-w-32 xl:min-w-56'
				placeholder={t('ns_common:actions.search') + ' ...'}
				type='search'
			/>
		</ButtonGroup>
	)
}
export default UserGlobalFilter
