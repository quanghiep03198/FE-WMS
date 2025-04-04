import { BaseFieldControl } from '@/common/types/hook-form'
import { cn } from '@/common/utils/cn'
import { CheckIcon } from '@radix-ui/react-icons'
import { useClickAway } from 'ahooks'
import React, { useId, useRef, useState } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { v4 as uuidv4 } from 'uuid'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../@core/form'
import { Input } from '../@core/input'
import { Div } from '../@custom/div'
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
	const [open, setOpen] = useState<boolean>(false)
	const { control, getFieldState, setValue, trigger } = useFormContext()
	const { name, datalist, labelField, valueField, label, ref: forwardedRef } = props
	const id = useId()
	const internalRef = useRef<HTMLInputElement>(null)
	const resolvedRef = (forwardedRef || internalRef) as React.RefObject<HTMLInputElement>

	useClickAway(() => {
		setOpen(false)
	}, [resolvedRef])

	return (
		<FormField
			control={control}
			name='po'
			render={({ field }) => {
				return (
					<FormItem>
						{label && <FormLabel htmlFor={id}>{label}</FormLabel>}
						<FormControl>
							<Div
								className='relative'
								style={
									{
										'--item-height': '32px'
									} as React.CSSProperties
								}>
								<AutoCompleteInput
									id={id}
									aria-invalid={!!getFieldState(name).error}
									className={cn(
										getFieldState(name).error && 'border-destructive focus-within:border-destructive'
									)}
									autoComplete='off'
									placeholder='xxxx-xxxx-xxxx'
									value={field.value}
									ref={resolvedRef}
									onFocus={() => setOpen(true)}
									onChange={field.onChange}
								/>
								<AutoCompletePopoverContent data-state={open ? 'open' : 'closed'}>
									<Div
										className='overflow-y-auto !scrollbar-none'
										style={{
											maxHeight: 'calc(5*var(--item-height))'
										}}>
										{datalist?.length > 0 ? (
											datalist?.map((item) => (
												<AutoCompleteItem
													key={uuidv4()}
													onClick={(e) => {
														e.stopPropagation()
														setValue(name, item[valueField])
														trigger(name)
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
									</Div>
								</AutoCompletePopoverContent>
							</Div>
						</FormControl>
						<FormMessage />
					</FormItem>
				)
			}}
		/>
	)
}

const AutoCompleteInput = tw(Input)<
	React.ComponentProps<'input'>
>`w-full bg-background tracking-wider placeholder:tracking-widest aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-within:border-destructive`
const AutoCompletePopoverContent = tw.div`absolute inset-x-0 z-50 translate-y-1 rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none !scrollbar-none data-[state=closed]:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`
const AutoCompleteItem = tw.div`flex cursor-pointer items-center rounded-md p-2 h-8 hover:bg-secondary hover:text-secondary-foreground`

AutoCompleteFieldControl.displayName = 'AutoCompleteFieldControl'
