// import { isEmpty } from 'lodash';
// import { useEffect, useState } from 'react';
// import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
// import { Editor, FormControl, FormField, FormItem, FormLabel, FormMessage } from '..';
// import { BaseFieldControl } from './types/hook-form';
// import FormTooltipLabel from './form-tooltip-label';

// type EditorFieldControlProps<T extends FieldValues> = Omit<BaseFieldControl<T>, 'control'> & {
// 	form: UseFormReturn<T>;
// 	errorMessage?: string;
// };

// export function EditorFieldControl<T extends FieldValues>({
// 	form,
// 	label,
// 	name,
// 	defaultValue,
// 	messageMode = 'tooltip',
// 	errorMessage
// }: EditorFieldControlProps<T>) {
// 	const [state, setState] = useState<{ value: string; isEmpty: boolean }>(() => ({
// 		value: defaultValue ?? '',
// 		isEmpty: isEmpty(defaultValue)
// 	}));

// 	useEffect(() => {
// 		if (defaultValue) setState({ value: defaultValue, isEmpty: false });
// 	}, [defaultValue]);

// 	useEffect(() => {
// 		if (state.isEmpty && form.formState.isSubmitted) {
// 			form.setError(name, {
// 				type: 'required',
// 				message: errorMessage ?? 'Vui lòng nhập nội dung'
// 			});
// 		} else {
// 			form.clearErrors(name);
// 		}
// 		form.setValue(name, state.value as PathValue<T, Path<T>>);
// 	}, [state, form.formState.isSubmitted]);

// 	return (
// 		<FormField
// 			name={name}
// 			render={() => (
// 				<FormItem>
// 					<FormTooltipLabel labelText={String(label)} messageMode={messageMode} />
// 					<FormControl>
// 						<Editor content={defaultValue} onUpdate={setState} />
// 					</FormControl>
// 					<FormMessage />
// 				</FormItem>
// 			)}
// 		/>
// 	);
// }
