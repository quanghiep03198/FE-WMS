import { SelectProps, SelectTriggerProps } from '@radix-ui/react-select'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '..'
import React from 'react'

type DropdownSelectProps = {
	openState?: boolean
	placeholder?: string
	options: Record<'label' | 'value', string>[]
	onValueChange?: (value: string) => any | AnonymousFunction
	selectProps?: SelectProps
	selectTriggerProps?: SelectTriggerProps
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({
	options,
	placeholder,
	openState,
	onValueChange,
	selectTriggerProps,
	selectProps
}) => {
	return (
		<Select
			open={openState}
			onValueChange={(value) => {
				if (typeof onValueChange === 'function') onValueChange(value)
			}}
			{...selectProps}>
			<SelectTrigger {...selectTriggerProps}>
				{selectTriggerProps?.children}
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{Array.isArray(options) && options.length > 0 ? (
						options.map((option) => (
							<SelectItem key={option?.value} value={String(option?.value)}>
								{option?.label}
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
