import { SelectContentProps, SelectProps, SelectTriggerProps } from '@radix-ui/react-select'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '..'

export type DropdownSelectProps<T extends Record<string, any>> = {
	openState?: boolean
	placeholder?: string
	data: Array<T>
	onValueChange?: (value: string) => any | AnonymousFunction
	selectProps?: SelectProps
	selectTriggerProps?: SelectTriggerProps
	selectContentProps?: SelectContentProps
} & {
	labelField: keyof T
	valueField: keyof T
}

export function DropdownSelect<T>({
	data,
	labelField,
	valueField,
	placeholder = 'Select',
	selectProps,
	selectTriggerProps,
	selectContentProps
}: DropdownSelectProps<T>) {
	return (
		<Select {...selectProps}>
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
