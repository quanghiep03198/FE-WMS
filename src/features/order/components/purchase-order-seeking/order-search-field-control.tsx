'use no memo'

import { cn } from '@common/utils/cn'
import {
	buttonVariants,
	Div,
	FormControl,
	FormField,
	FormItem,
	Icon,
	Input,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Separator,
	Tooltip,
	Typography
} from '@components/ui'
import useMediaQuery from '@hooks/use-media-query'
import { capitalize } from 'lodash-es'
import React, { useId, useMemo, useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { GhostButton } from '../../../../components/shared/ghost-button'
import { useSearchPurchaseOrderQuery } from '../../hooks/use-order-request'
import { useGetPurchaseOrderQuery } from '../../hooks/use-po-detail-request'
import SearchHistory from './search-history'

export function OrderSearchFieldControl() {
	const { t } = useTranslation()
	const id = useId()
	const ref = useRef<HTMLInputElement>(null)
	const [open, setOpen] = useState(false)
	const { control, getFieldState, setValue } = useFormContext()
	const isMobile = useMediaQuery('(max-width: 1023px)')

	const currentOrderValue = useWatch({ control, name: 'po' })

	const { data: availablePurchaseOrders, isLoading } = useSearchPurchaseOrderQuery(currentOrderValue, true)
	const { refetch } = useGetPurchaseOrderQuery()

	const availableOrders = useMemo(() => {
		return Array.isArray(availablePurchaseOrders)
			? availablePurchaseOrders.map((item) => ({
					label: item.po,
					value: { po: item.po, isCompleted: item.is_completed }
				}))
			: []
	}, [availablePurchaseOrders])

	const filteredDatalist = useMemo(() => {
		return Array.isArray(availableOrders)
			? availableOrders.filter((item) => item.value?.po?.toLowerCase()?.includes(currentOrderValue?.toLowerCase()))
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
			name='po'
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
							<Popover modal={false} open={open} onOpenChange={setOpen}>
								<FormControl>
									<PopoverTrigger asChild={true} onClick={(e) => e.preventDefault()}>
										<Div className='focus-within:border-primary aria-invalid:border-destructive aria-invalid:focus-within:border-destructive relative flex w-full flex-1 flex-col items-stretch gap-6 rounded-lg border px-6 py-3 transition-colors duration-200'>
											<Div className='flex items-center gap-x-2'>
												<Input
													aria-invalid={!!getFieldState('po').error}
													autoComplete='off'
													id={id}
													ref={ref}
													value={field.value}
													className={cn(
														'focus-border-0 rounded-none border-0 px-0 text-base shadow-none',
														isLoading && 'animate-pulse'
													)}
													placeholder={capitalize(
														t('ns_common:form_placeholder.fill', {
															object: t('ns_erp:fields.po'),
															defaultValue: null
														})
													)}
													onChange={(e) => field.onChange(e)}
													onClick={() => setOpen(true)}
													onKeyDown={handleKeyDown}
												/>

												<Tooltip message={t('ns_common:actions.reset')} triggerProps={{ asChild: true }}>
													<GhostButton
														disabled={!field.value}
														type='button'
														onClick={() => setValue('po', '')}>
														<Icon name='X' />
													</GhostButton>
												</Tooltip>
												<Separator className='h-4 w-0.5' orientation='vertical' />
												<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
													<GhostButton disabled={isLoading} onClick={() => refetch()}>
														<Icon className={isLoading && 'animate-spin'} name='RefreshCcw' />
													</GhostButton>
												</Tooltip>
											</Div>
											<Div className='flex items-center justify-between'>
												<SearchHistory />
												<Label
													className={cn(buttonVariants({ size: isMobile ? 'default' : 'lg' }))}
													htmlFor='search-po-button'
													onClick={(e) => {
														e.stopPropagation()
														setOpen(false)
													}}>
													<Icon name='Search' />
													{t('ns_common:actions.search')}
												</Label>
											</Div>
										</Div>
									</PopoverTrigger>
								</FormControl>
								<PopoverContent
									className='max-h-52 w-[var(--radix-popover-trigger-width)] overflow-auto p-1'
									sideOffset={8}
									onOpenAutoFocus={(e) => e.preventDefault()}>
									{Array.isArray(filteredDatalist) && filteredDatalist?.length > 0 ? (
										filteredDatalist?.map((item) => {
											return (
												<AutoCompleteItem
													aria-disabled={item.value.isCompleted}
													key={item.value.po}
													onClick={() => setValue('po', item.value.po)}>
													{item.value.po}
													{item.value.isCompleted && <Icon name='BadgeCheck' size={18} />}
													{item.value.po === currentOrderValue && (
														<Icon className='ml-auto' name='Check' />
													)}
												</AutoCompleteItem>
											)
										})
									) : (
										<Typography className='block h-full p-10 text-center' color='muted' variant='small'>
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

const AutoCompleteItem = tw.div`
	flex cursor-pointer items-center rounded-md p-2 h-9 text-base gap-x-2
	hover:bg-secondary 
	hover:text-secondary-foreground 
	aria-disabled:cursor-auto 
	aria-disabled:text-muted-foreground 
	aria-disabled:opacity-80
`
