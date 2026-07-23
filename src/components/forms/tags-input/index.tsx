'use no memo'

import type { BaseFieldControl } from '@common/types/hook-form'
import { cn } from '@common/utils/cn'
import type { TagsInputProps } from '@components/ui'
import {
	Div,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	TagsInput
} from '@components/ui'
import { useId } from 'react'
import type { FieldValues } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'

export type TagInputFieldControlProps<T extends FieldValues> = BaseFieldControl<T> & Partial<TagsInputProps>

export function TagInputFieldControl<T extends FieldValues>(props: TagInputFieldControlProps<T>) {
	const { name, hidden = false, label, description, orientation, placeholder, ...restProps } = props
	const id = useId()
	const { control, getValues, getFieldState } = useFormContext()
	const isInvalid = getFieldState(name).invalid

	return (
		<FormField
			name={name}
			control={control}
			defaultValue={getValues(name) ?? []}
			render={({ field }) => (
				<FormItem
					className={cn(
						orientation === 'horizontal' ? 'grid grid-cols-[1fr_2fr] items-start gap-2 space-y-0' : 'space-y-2',
						hidden && 'hidden'
					)}>
					{label && (
						<FormLabel
							htmlFor={id}
							className={cn(
								'text-pretty',
								orientation === 'horizontal' && 'translate-y-3/4 align-middle leading-none'
							)}>
							{label}
						</FormLabel>
					)}
					<FormControl>
						<Div className='space-y-2'>
							<TagsInput
								placeholder={placeholder}
								value={field.value}
								onValueChange={field.onChange}
								aria-invalid={isInvalid}
								{...restProps}
							/>
							<FormDescription>{description}</FormDescription>
							<FormMessage />
						</Div>
					</FormControl>
				</FormItem>
			)}
		/>
	)
}
