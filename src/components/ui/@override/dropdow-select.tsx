import { SelectProps, SelectTriggerProps } from '@radix-ui/react-select';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '..';
import React from 'react';

type DropdownSelectProps = {
	openState?: boolean;
	placeholder?: string;
	options: Record<'label' | 'value', string>[];
	onValueChange?: (value: string) => any | AnonymousFunction;

	selectProps?: SelectProps;
	selectTriggerProps?: SelectTriggerProps;
};

export const DropdownSelect: React.FC<DropdownSelectProps> = ({ options, placeholder, openState, onValueChange, selectTriggerProps, selectProps }) => {
	return (
		<Select
			open={openState}
			onValueChange={(value) => {
				if (onValueChange) onValueChange(value);
			}}
			{...selectProps}>
			<SelectTrigger {...selectTriggerProps}>
				{selectTriggerProps?.children}
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{Array.isArray(options) &&
						options.map((option) => (
							<SelectItem key={option.value} value={option.value?.toString()}>
								{option.label}
							</SelectItem>
						))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};
