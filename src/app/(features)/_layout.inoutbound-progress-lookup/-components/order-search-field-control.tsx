'use no memo'

import { cn } from '@/common/utils/cn'
import {
	Div,
	FormControl,
	FormField,
	FormItem,
	Icon,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Typography
} from '@/components/ui'
import { CheckIcon } from '@radix-ui/react-icons'
import { capitalize } from 'lodash'
import React, { useId, useMemo, useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useSearchCommandNumberQuery, useSearchPurchaseOrderQuery } from '../../-hooks/use-order'
import { RFIDDataType } from '../../_layout.(rfid)/-constants'

export function OrderSearchFieldControl() {
	const { t } = useTranslation()
	const id = useId()
	const ref = useRef<HTMLInputElement>(null)
	const [open, setOpen] = useState(false)

	const { control, getFieldState, setValue } = useFormContext()

	const currentDataType = useWatch({ control, name: 'dataType' })
	const currentOrderValue = useWatch({ control, name: 'order' })

	const { data: availableCommandNumbers, isLoading: isLoadingCommandNumber } = useSearchCommandNumberQuery(
		currentOrderValue,
		currentDataType === RFIDDataType.INBOUND
	)
	const { data: availablePurchaseOrders, isLoading: isLoadingPurchaseOrder } = useSearchPurchaseOrderQuery(
		currentOrderValue,
		currentDataType === RFIDDataType.OUTBOUND
	)

	const isLoading = isLoadingCommandNumber || isLoadingPurchaseOrder

	const availableOrders = useMemo(() => {
		switch (currentDataType) {
			case RFIDDataType.INBOUND:
				return Array.isArray(availableCommandNumbers)
					? availableCommandNumbers.map((item) => ({ label: item.mo_no, value: item.mo_no }))
					: []
			case RFIDDataType.OUTBOUND:
				return Array.isArray(availablePurchaseOrders)
					? availablePurchaseOrders.map((item) => ({ label: item.po, value: item.po }))
					: []
			default:
				return []
		}
	}, [currentDataType, availableCommandNumbers, availablePurchaseOrders])

	const filteredDatalist = useMemo(() => {
		return Array.isArray(availableOrders)
			? availableOrders.filter((item) => item.value?.toLowerCase()?.includes(currentOrderValue?.toLowerCase()))
			: []
	}, [availableOrders, currentOrderValue])

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') e.preventDefault()
		else if (e.key === 'Escape') setOpen(false)
		else {
			setOpen(true)
		}
	}

	return (
		<FormField
			control={control}
			name='order'
			render={({ field }) => {
				return (
					<FormItem
						className='w-full'
						style={
							{
								'--item-height': '32px'
							} as React.CSSProperties
						}>
						<Div className='space-y-2'>
							<Popover open={open} onOpenChange={setOpen} modal={false}>
								<FormControl>
									<PopoverTrigger
										className='relative flex h-10 w-full items-center rounded-lg border px-3 py-1 transition-colors duration-200 focus-within:border-primary aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-within:border-destructive'
										onClick={(e) => e.preventDefault()}>
										<Icon name='Search' size={20} className={cn('stroke-muted-foreground')} />
										<Input
											id={id}
											ref={ref}
											value={field.value}
											autoComplete='off'
											placeholder={capitalize(
												currentDataType === RFIDDataType.INBOUND
													? t('ns_common:form_placeholder.search', {
															object: t('ns_erp:fields.mo_no'),
															defaultValue: null
														})
													: t('ns_common:form_placeholder.search', {
															object: t('ns_erp:fields.po'),
															defaultValue: null
														})
											)}
											aria-invalid={!!getFieldState('order').error}
											className='focus-border-0 rounded-none border-0'
											onKeyDown={handleKeyDown}
											onClick={() => setOpen(true)}
											onChange={(e) => field.onChange(e)}
										/>
										{isLoading && (
											<Icon
												name='LoaderCircle'
												size={18}
												className={cn('animate-spin stroke-muted-foreground')}
											/>
										)}
									</PopoverTrigger>
								</FormControl>
								<PopoverContent
									sideOffset={8}
									className='max-h-52 w-[var(--radix-popover-trigger-width)] overflow-auto p-1'
									onOpenAutoFocus={(e) => e.preventDefault()}>
									{Array.isArray(filteredDatalist) && filteredDatalist?.length > 0 ? (
										filteredDatalist?.map((item) => {
											return (
												<AutoCompleteItem
													key={item.value}
													onClick={(e) => {
														e.stopPropagation()
														setValue('order', item.value)
													}}>
													<Typography variant='small' className='line-clamp-1 flex-1'>
														{String(item.label)}
													</Typography>
													<CheckIcon
														className={cn(
															'ml-auto transition-opacity duration-200',
															field.value === item.value ? 'opacity-100' : 'opacity-0'
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
						</Div>
					</FormItem>
				)
			}}
		/>
	)
}

const AutoCompleteItem = tw.div`flex cursor-pointer items-center rounded-md p-2 h-8 hover:bg-secondary hover:text-secondary-foreground`
