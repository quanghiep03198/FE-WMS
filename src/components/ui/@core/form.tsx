import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'
import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form'
import { Controller, FormProvider, useFormContext } from 'react-hook-form'

import { Label } from '@/components/ui/@core/label'
import { cn } from '@common/utils/cn'
import { Json } from '@common/utils/json'
import { type ResourceKey } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Icon } from './icon'

const Form = FormProvider

type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
	name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
	...props
}: ControllerProps<TFieldValues, TName>) => {
	return (
		<FormFieldContext.Provider value={{ name: props.name }}>
			<Controller {...props} />
		</FormFieldContext.Provider>
	)
}

const useFormField = () => {
	const fieldContext = React.use(FormFieldContext)
	const itemContext = React.use(FormItemContext)
	const { getFieldState, formState } = useFormContext()

	const fieldState = getFieldState(fieldContext.name, formState)

	if (!fieldContext) {
		throw new Error('useFormField should be used within <FormField>')
	}

	const { id } = itemContext

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState
	}
}

type FormItemContextValue = {
	id: string
}

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

const FormItem: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => {
	const id = React.useId()

	return (
		<FormItemContext.Provider value={{ id }}>
			<div className={cn('space-y-2', className)} {...props} />
		</FormItemContext.Provider>
	)
}

FormItem.displayName = 'FormItem'

const FormLabel: React.FC<React.ComponentProps<typeof Label>> = ({ className, ...props }) => {
	const { error, formItemId } = useFormField()

	return <Label className={cn(error && 'text-destructive', className)} htmlFor={formItemId} {...props} />
}
FormLabel.displayName = 'FormLabel'

const FormControl: React.FC<React.ComponentProps<typeof Slot>> = (props) => {
	const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

	return (
		<Slot
			id={formItemId}
			aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
			aria-invalid={!!error}
			{...props}
		/>
	)
}

FormControl.displayName = 'FormControl'

const FormDescription: React.FC<React.ComponentProps<'p'>> = ({ className, ...props }) => {
	const { formDescriptionId } = useFormField()

	return <p id={formDescriptionId} className={cn('text-[0.8rem] text-muted-foreground', className)} {...props} />
}

FormDescription.displayName = 'FormDescription'

type FormErrorMessage =
	| Extract<ResourceKey, 'string'>
	| { key: ResourceKey; bindings?: Record<string, string | number> }

const FormMessage: React.FC<React.ComponentProps<'p'>> = ({ className, children, ...props }) => {
	const { error, formMessageId } = useFormField()
	const { t } = useTranslation()
	const body = error ? String(error?.message) : children

	if (!body) {
		return null
	}

	const i18nErrorMessage = Json.parse<FormErrorMessage>(error?.message)

	const message =
		typeof i18nErrorMessage === 'string'
			? t(i18nErrorMessage)
			: t(i18nErrorMessage.key, { ...i18nErrorMessage.bindings })

	return (
		<p
			id={formMessageId}
			className={cn('inline-flex items-center gap-x-1 text-[0.8rem] font-medium text-destructive', className)}
			{...props}>
			<Icon name='TriangleAlert' />
			{message}
		</p>
	)
}

FormMessage.displayName = 'FormMessage'

export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField }
