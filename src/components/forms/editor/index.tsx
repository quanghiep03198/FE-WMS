'use no memo'

import type { BaseFieldControl } from '@/common/types/hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui'
import { useUpdateEffect } from 'ahooks'
import { isEmpty } from 'lodash-es'
import { useLayoutEffect, useState } from 'react'
import type { FieldValues, Path, PathValue } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { EditorProps } from '../../ui/@tiptap'
import { Editor } from '../../ui/@tiptap'

type EditorFieldControlProps<T extends FieldValues> = Omit<BaseFieldControl<T>, 'control'> &
	Partial<EditorProps> & {
		errorMessage?: string
	}

export function EditorFieldControl<T extends FieldValues>({
	label,
	name,
	defaultValue = '',
	errorMessage,
	disabled = false
}: EditorFieldControlProps<T>) {
	const { formState, control, setValue, getValues, setError, clearErrors } = useFormContext()
	const { t, i18n } = useTranslation()

	const [state, setState] = useState<{ value: string; isEmpty: boolean }>(() => ({
		value: defaultValue,
		isEmpty: isEmpty(defaultValue)
	}))

	useLayoutEffect(() => {
		setState({ value: defaultValue, isEmpty: isEmpty(defaultValue) })
	}, [defaultValue])

	useUpdateEffect(() => {
		if (state.isEmpty && formState.isSubmitted) {
			setError(name, { type: 'required', message: errorMessage ?? t('ns_validation:required') })
		} else {
			clearErrors(name)
		}
		setValue(name, state.value as PathValue<T, Path<T>>)
	}, [state, i18n.language, formState.isSubmitted])

	useUpdateEffect(() => {
		setState({ value: getValues(name), isEmpty: isEmpty(getValues(name)) })
	}, [getValues(name)])
	return (
		<FormField
			name={name}
			control={control}
			defaultValue={defaultValue}
			render={() => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Editor name={name} defaultValue={defaultValue} onUpdate={setState} disabled={disabled} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
