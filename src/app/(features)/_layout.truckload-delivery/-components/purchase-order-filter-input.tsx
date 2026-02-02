'use no memo'

import RoleBaseAccessControl from '@/app/-components/-guard/role-base-access-control'
import { UserRole } from '@/common/constants/enums'
import { cn } from '@/common/utils/cn'
import { Div, Icon, Input, Popover, PopoverContent, PopoverTrigger, Typography } from '@/components/ui'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { useDebounce, useUpdateEffect } from 'ahooks'
import { capitalize } from 'lodash-es'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useSearchPurchaseOrderQuery } from '../../-hooks/use-order-asm'

const PurchaseOrderFilterInput: React.FC<{
	table: Table<ITruckloadDelivery>
}> = ({ table }) => {
	const { t } = useTranslation()
	const [search, setSearch] = useState<string>('')
	const debounceSearchValue = useDebounce(search, { wait: 200 })
	const { data, isLoading } = useSearchPurchaseOrderQuery(debounceSearchValue)
	const [open, setOpen] = useState<boolean>(false)

	const handleKeyDown = (e: React.KeyboardEvent) => {
		switch (e.key) {
			case 'Enter':
				e.preventDefault()
				break
			case 'Escape':
				setOpen(false)
				break
			default:
				setOpen(true)
				break
		}
	}

	useUpdateEffect(() => {
		table?.getColumn?.('purchase_orders')?.setFilterValue?.(debounceSearchValue)
	}, [debounceSearchValue])

	return (
		<RoleBaseAccessControl
			mode='invisible'
			authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FG_WAREHOUSE_STAFF, UserRole.IE_STAFF]}>
			<Popover open={open} onOpenChange={setOpen} modal={false}>
				<PopoverTrigger
					className='relative flex h-9 w-64 items-center overflow-clip rounded-md border px-3 py-1 shadow-sm'
					onClick={(e) => e.preventDefault()}>
					<Icon name='Search' />
					<Input
						value={search}
						autoComplete='off'
						placeholder={capitalize(
							t('ns_common:form_placeholder.search', {
								object: t('ns_erp:fields.po'),
								defaultValue: 'Search purchase order ...'
							})
						)}
						className={cn('peer border-none py-0 shadow-none focus:border-none focus:ring-0')}
						onKeyDown={handleKeyDown}
						onClick={() => setOpen(true)}
						onChange={(e) => setSearch(e.currentTarget.value)}
					/>
					<CaretSortIcon className='absolute right-3 top-1/2 ml-auto h-4 w-4 -translate-y-1/2 opacity-50 peer-data-[icon=false]:hidden' />
				</PopoverTrigger>

				<PopoverContent
					className='max-h-52 w-[var(--radix-popover-trigger-width)] overflow-auto p-1'
					onOpenAutoFocus={(e) => e.preventDefault()}>
					{isLoading ? (
						<Div className='flex items-center justify-center p-10 text-center'>
							<Icon name='LoaderCircle' size={18} className='animate-[spin_1s_linear_infinite]' />
						</Div>
					) : data?.length > 0 ? (
						data?.map((item) => {
							return (
								<AutoCompleteItem
									key={item.po}
									onClick={(e) => {
										e.stopPropagation()
										table?.getColumn?.('purchase_orders')?.setFilterValue?.(item.po)
										setSearch(item.po)
										setOpen(false)
									}}>
									<Typography variant='small' className='line-clamp-1 flex-1'>
										{item.po}
									</Typography>
									<CheckIcon
										className={cn(
											'ml-auto transition-opacity duration-200',
											search === item.po ? 'opacity-100' : 'opacity-0'
										)}
									/>
								</AutoCompleteItem>
							)
						})
					) : (
						<Typography variant='small' color='muted' className='block h-full p-10 text-center'>
							{t('ns_common:table.no_data')}
						</Typography>
					)}
				</PopoverContent>
			</Popover>
		</RoleBaseAccessControl>
	)
}

const AutoCompleteItem = tw.div`flex cursor-pointer items-center rounded-md p-2 h-8 hover:bg-secondary hover:text-secondary-foreground`

export default PurchaseOrderFilterInput
