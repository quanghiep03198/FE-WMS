'use no memo'

import { cn } from '@common/utils/cn'
import type { IconProps } from '@components/ui'
import {
	Badge,
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	Div,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Separator
} from '@components/ui'
import type { IUser } from '@features/auth/types'
import { CheckIcon } from '@radix-ui/react-icons'
import { type Column } from '@tanstack/react-table'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

type UserPropertyValue = IUser[keyof IUser]

export interface DataTableFacetedFilterProps {
	column?: Column<IUser, UserPropertyValue>
	title?: string
	options: {
		label: string
		value: UserPropertyValue
		icon?: IconProps['name']
	}[]
}

export function DataTableFacetedFilter({ column, title, options }: DataTableFacetedFilterProps) {
	const { t } = useTranslation()

	const facets = column?.getFacetedUniqueValues()
	const selectedValues = new Set(column?.getFilterValue() as string[])

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className='border-dashed' variant='outline'>
					<Icon name='CirclePlus' />
					{title}
					{selectedValues?.size > 0 && (
						<Div className='inline-flex items-center gap-x-2 md:hidden'>
							<Separator className='mx-2 h-4' orientation='vertical' />
							<Badge className='hidden rounded-sm px-1.5 font-normal' variant='secondary'>
								{selectedValues.size}
							</Badge>
							<Div className='flex gap-1'>
								{selectedValues.size > 2 ? (
									<Badge className='rounded-sm px-1.5 font-normal' variant='secondary'>
										{t('ns_common:pagination.selected_records', {
											selectedRecords: selectedValues.size,
											defaultValue: null
										})}
									</Badge>
								) : (
									options
										.filter((option) => selectedValues.has(option.value))
										.map((option) => (
											<Badge
												className='rounded-sm px-1.5 font-normal'
												key={option.value}
												variant='secondary'>
												{option.label}
											</Badge>
										))
								)}
							</Div>
						</Div>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent align='start' className='w-72 p-0'>
				<Command>
					<CommandInput placeholder={title} />
					<CommandList>
						<CommandEmpty>{t('ns_common:table.no_data')}</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const isSelected = selectedValues.has(option.value)
								return (
									<CommandItem
										key={option.value}
										onSelect={() => {
											if (isSelected) {
												selectedValues.delete(option.value)
											} else {
												selectedValues.add(option.value)
											}
											const filterValues = Array.from(selectedValues)
											column?.setFilterValue(filterValues.length ? filterValues : undefined)
										}}>
										<Div
											className={cn(
												'flex size-4 items-center justify-center rounded-[4px] border',
												isSelected
													? 'border-primary bg-primary text-primary-foreground'
													: 'border-input [&_svg]:invisible'
											)}>
											<CheckIcon className='text-primary-foreground size-3.5' />
										</Div>
										{option.icon && (
											<Icon className='text-muted-foreground size-[18px]' name={option.icon} size={18} />
										)}
										<span>{option.label}</span>
										{facets?.get(option.value) && (
											<span className='text-muted-foreground ml-auto flex size-4 items-center justify-center font-mono text-xs'>
												{facets.get(option.value)}
											</span>
										)}
									</CommandItem>
								)
							})}
						</CommandGroup>
						{selectedValues.size > 0 && (
							<Fragment>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										className='justify-center text-center'
										onSelect={() => column?.setFilterValue(undefined)}>
										{t('ns_common:actions.clear_filter')}
									</CommandItem>
								</CommandGroup>
							</Fragment>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
