'use no memo'

import type { IUser } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import type { IconProps } from '@/components/ui'
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
} from '@/components/ui'
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
				<Button variant='outline' className='border-dashed'>
					<Icon name='CirclePlus' />
					{title}
					{selectedValues?.size > 0 && (
						<Div className='inline-flex items-center gap-x-2 md:hidden'>
							<Separator orientation='vertical' className='mx-2 h-4' />
							<Badge variant='secondary' className='hidden rounded-sm px-1.5 font-normal'>
								{selectedValues.size}
							</Badge>
							<Div className='flex gap-1'>
								{selectedValues.size > 2 ? (
									<Badge variant='secondary' className='rounded-sm px-1.5 font-normal'>
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
												variant='secondary'
												key={option.value}
												className='rounded-sm px-1.5 font-normal'>
												{option.label}
											</Badge>
										))
								)}
							</Div>
						</Div>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-72 p-0' align='start'>
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
											<CheckIcon className='size-3.5 text-primary-foreground' />
										</Div>
										{option.icon && (
											<Icon name={option.icon} size={18} className='size-[18px] text-muted-foreground' />
										)}
										<span>{option.label}</span>
										{facets?.get(option.value) && (
											<span className='ml-auto flex size-4 items-center justify-center font-mono text-xs text-muted-foreground'>
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
										onSelect={() => column?.setFilterValue(undefined)}
										className='justify-center text-center'>
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
