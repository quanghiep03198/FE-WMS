import { cn } from '@/common/utils/cn';
import React, { forwardRef, memo, useEffect, useId, useRef, useState } from 'react';
import { ControllerRenderProps, FieldValues, Path, useFormContext } from 'react-hook-form';
import { Div, FormControl, FormDescription, FormField, FormItem, FormMessage } from '..';
import { Input, InputProps } from '../@shadcn/input';
import FormTooltipLabel from './form-tooltip-label';
import { BaseFieldControl } from './types/hook-form';
import { omit } from 'lodash';

export type InputFieldControlProps<T extends FieldValues> = BaseFieldControl<T> & InputProps;

export function InputFieldControl<T extends FieldValues>(
	props: InputFieldControlProps<T> & React.PropsWithRef<T> & React.RefAttributes<T>,
	ref?: React.ForwardedRef<HTMLInputElement>
) {
	const {
		label,
		name,
		className,
		disabled,
		control,
		placeholder,
		description,
		type,
		hidden,
		layout,
		messageMode = 'tooltip',
		onChange,
		...restProps
	} = props;

	const id = useId();
	const [value, setValue] = useState<string>('');
	const { getFieldState } = useFormContext();
	const localRef = useRef<typeof Input.prototype>(null);
	const resolvedRef = (ref ?? localRef) as typeof localRef;

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		field: ControllerRenderProps<FieldValues, Path<FieldValues>>
	) => {
		setValue(e.target.value);
		if (onChange) onChange(e);
		if (type === 'file') {
			field.onChange(e.target.files);
		} else {
			field.onChange(e);
		}
	};

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => {
				return (
					<FormItem
						className={cn({
							hidden,
							'grid grid-cols-[1fr_2fr] items-center gap-2 space-y-0': layout === 'horizontal'
						})}>
						<FormTooltipLabel htmlFor={id} labelText={String(label)} messageMode={messageMode} />

						<FormControl>
							<Div className='relative'>
								<Input
									{...omit(field, ['onChange'])}
									{...restProps}
									id={id}
									value={value}
									placeholder={placeholder}
									ref={(e) => {
										field.ref(e);
										if (resolvedRef.current) {
											resolvedRef.current = e;
										}
									}}
									disabled={disabled}
									type={type ?? 'text'}
									onChange={(e) => handleChange(e, field)}
									className={cn(className, {
										'border-destructive focus:!border-destructive': !!getFieldState(name).error
									})}
								/>
							</Div>
						</FormControl>
						<FormDescription>{description}</FormDescription>
						{messageMode === 'default' && <FormMessage />}
					</FormItem>
				);
			}}
		/>
	);
}

InputFieldControl.displayName = 'InputFieldControl';

export const ForwardedRefInputFieldControl = memo(
	forwardRef<HTMLInputElement, InputFieldControlProps<any>>(InputFieldControl)
);
