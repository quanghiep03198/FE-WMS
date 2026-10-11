import { DebouncedInput } from '@components/customs/debounced-input'
import { buttonVariants } from '@components/ui/button'
import { ButtonGroup } from '@components/ui/button-group'
import { Icon } from '@components/ui/icon'
import type { IUser } from '@features/auth/types'
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
				className: 'bg-background hover:bg-background font-normal'
			})}>
			<Icon name='Search' />
			<DebouncedInput
				className='h-full min-w-44 p-0 shadow-none placeholder:text-sm md:max-w-32 md:min-w-32 xl:min-w-56'
				placeholder={t('ns_common:actions.search') + ' ...'}
				type='search'
				value={table.getState().globalFilter}
				onChange={(value) => {
					table.setGlobalFilter(String(value))
				}}
			/>
		</ButtonGroup>
	)
}
export default UserGlobalFilter
