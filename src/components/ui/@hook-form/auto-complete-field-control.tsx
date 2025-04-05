'use no memo'

import { BaseFieldControl } from '@/common/types/hook-form'
import { cn } from '@/common/utils/cn'
import { CheckIcon } from '@radix-ui/react-icons'
import React, { useId, useRef } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { v4 as uuidv4 } from 'uuid'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../@core/form'
import { Input } from '../@core/input'
import { Popover, PopoverContent, PopoverTrigger } from '../@core/popover'
import { Typography } from '../@custom/typography'

type AutoCompleteFieldControlProps<T extends FieldValues, D = Record<string, any>> = Omit<
	BaseFieldControl<T>,
	'control'
> & {
	datalist: Array<D>
	disabled?: boolean
	loading?: boolean
	template?: React.FC<
		{ data: D } & React.ComponentProps<
			'div' extends keyof HTMLElementTagNameMap ? keyof HTMLElementTagNameMap : React.ElementType
		>
	>
	shouldFilter?: boolean
	onInput?: (value: string) => unknown
	onSelect?: (value: string) => unknown
	labelField: keyof D
	valueField: keyof D
} & React.ComponentProps<'input'>

export function AutoCompleteFieldControl<T, D>(props: AutoCompleteFieldControlProps<T, D>) {
	const { t } = useTranslation()
	const { control, getFieldState, setValue } = useFormContext()
	const { name, datalist, labelField, valueField, label, ref: forwardedRef } = props
	const id = useId()
	const internalRef = useRef<HTMLInputElement>(null)
	const resolvedRef = (forwardedRef || internalRef) as React.RefObject<HTMLInputElement>

	return (
		<FormField
			control={control}
			name='po'
			render={({ field }) => {
				return (
					<FormItem
						style={
							{
								'--item-height': '32px'
							} as React.CSSProperties
						}>
						{label && <FormLabel htmlFor={id}>{label}</FormLabel>}
						<Popover modal={true}>
							<FormControl>
								<PopoverTrigger className='w-full'>
									<Input
										id={id}
										autoComplete='off'
										placeholder='xxxx-xxxx-xxxx'
										aria-invalid={!!getFieldState(name).error}
										className='aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-within:border-destructive'
										value={field.value}
										ref={resolvedRef}
										onChange={field.onChange}
									/>
								</PopoverTrigger>
							</FormControl>
							<PopoverContent
								className='w-[var(--radix-popover-trigger-width)] p-1'
								onOpenAutoFocus={(e) => e.preventDefault()}>
								{datalist?.length > 0 ? (
									datalist?.map((item) => (
										<AutoCompleteItem
											key={uuidv4()}
											onClick={(e) => {
												e.stopPropagation()
												setValue(name, item[valueField])
											}}>
											<Typography variant='small' className='line-clamp-1 flex-1'>
												{String(item[labelField])}
											</Typography>
											<CheckIcon
												className={cn(
													'ml-auto transition-opacity duration-200',
													field.value === item[valueField] ? 'opacity-100' : 'opacity-0'
												)}
											/>
										</AutoCompleteItem>
									))
								) : (
									<Typography variant='small' className='p-10 text-center'>
										{t('ns_common:table.no_data')}
									</Typography>
								)}
							</PopoverContent>
						</Popover>
						<FormMessage />
					</FormItem>
				)
			}}
		/>
	)
}

const AutoCompleteItem = tw.div`flex cursor-pointer items-center rounded-md p-2 h-8 hover:bg-secondary hover:text-secondary-foreground`

AutoCompleteFieldControl.displayName = 'AutoCompleteFieldControl'
