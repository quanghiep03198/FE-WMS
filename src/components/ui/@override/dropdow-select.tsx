import { SelectContentProps, SelectProps, SelectTriggerProps } from '@radix-ui/react-select'
import { memo } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '..'

export type DropdownSelectProps<T extends Record<string, any>> = {
	openState?: boolean
	onValueChange?: (value: string) => any | AnonymousFunction
	data: Array<T>
	placeholder?: string
	selectProps?: Partial<SelectProps>
	selectTriggerProps?: Partial<SelectTriggerProps>
	selectContentProps?: Partial<SelectContentProps>
} & {
	labelField: keyof T & string
	valueField: keyof T & string
}

export const DropdownSelect = memo(
	<T extends Record<string, any>>({
		data,
		labelField,
		valueField,
		placeholder = 'Select',
		selectProps,
		selectTriggerProps,
		selectContentProps
	}: DropdownSelectProps<T>) => {
		return (
			<Select {...selectProps} defaultValue={selectProps?.defaultValue ?? null}>
				<SelectTrigger {...selectTriggerProps}>
					{selectTriggerProps?.children}
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent {...selectContentProps}>
					<SelectGroup>
						{Array.isArray(data) && data.length > 0 ? (
							data.map((option, index) => (
								<SelectItem key={index} value={String(option[valueField])}>
									{String(option[labelField])}
								</SelectItem>
							))
						) : (
							<SelectItem
								value={null}
								disabled
								className='flex items-center justify-center text-center text-xs font-medium'>
								No option
							</SelectItem>
						)}
					</SelectGroup>
				</SelectContent>
			</Select>
		)
	}
)
