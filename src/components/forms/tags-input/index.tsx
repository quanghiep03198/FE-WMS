'use no memo'

import type { BaseFieldControl } from '@common/types/hook-form'
import { Div } from '@components/customs/div'
import type { TagsInputProps } from '@components/customs/tags-input'
import { TagsInput } from '@components/customs/tags-input'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form'
import { useId } from 'react'
import type { FieldValues } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'

export type TagInputFieldControlProps<T extends FieldValues> = BaseFieldControl<T> & Partial<TagsInputProps>

export function TagInputFieldControl<T extends FieldValues>(props: TagInputFieldControlProps<T>) {
	const { name, hidden = false, label, description, orientation: orientation, placeholder, ...restProps } = props
	const id = useId()
	const { control, getValues, getFieldState } = useFormContext()
	const isInvalid = getFieldState(name).invalid

	return (
		<FormField
			control={control}
			defaultValue={getValues(name) ?? []}
			name={name}
			render={({ field }) => (
				<FormItem
					aria-hidden={hidden}
					aria-orientation={orientation}
					className='space-y-2 aria-hidden:hidden aria-[orientation=horizontal]:grid aria-[orientation=horizontal]:grid-cols-[1fr_2fr] aria-[orientation=horizontal]:items-start aria-[orientation=horizontal]:gap-2 aria-[orientation=horizontal]:space-y-0'>
					{label && (
						<FormLabel
							aria-orientation={orientation}

							className='text-pretty aria-[orientation=horizontal]:translate-y-3/4 aria-[orientation=horizontal]:align-middle aria-[orientation=horizontal]:leading-none'
							htmlFor={id}>
							{label}
						</FormLabel>
					)}
					<FormControl>
						<Div className='space-y-2'>
							<TagsInput
								aria-invalid={isInvalid}
								placeholder={placeholder}
								value={field.value}
								onValueChange={field.onChange}
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
