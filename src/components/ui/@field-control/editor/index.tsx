import { BaseFieldControl } from '@/common/types/hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form'
import { Editor } from '../../@tiptap'

type EditorFieldControlProps<T extends FieldValues> = Omit<BaseFieldControl<T>, 'control'> & {
	errorMessage?: string
}

export function EditorFieldControl<T extends FieldValues>({
	label,
	name,
	defaultValue,
	errorMessage
}: EditorFieldControlProps<T>) {
	const { formState, control, setValue, setError, clearErrors } = useFormContext()

	const [state, setState] = useState<{ value: string; isEmpty: boolean }>(() => ({
		value: defaultValue ?? '',
		isEmpty: isEmpty(defaultValue)
	}))

	useEffect(() => {
		if (defaultValue) setState({ value: defaultValue, isEmpty: false })
	}, [defaultValue])

	useEffect(() => {
		if (state.isEmpty && formState.isSubmitted) {
			setError(name, { type: 'required', message: errorMessage ?? 'Vui lòng nhập nội dung' })
		} else {
			clearErrors(name)
		}
		setValue(name, state.value as PathValue<T, Path<T>>)
	}, [state, formState.isSubmitted])

	return (
		<FormField
			name={name}
			control={control}
			render={() => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Editor content={defaultValue} onUpdate={setState} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
