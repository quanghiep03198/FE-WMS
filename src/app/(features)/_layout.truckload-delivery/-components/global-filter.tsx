'use no memo'

import {
	Button,
	buttonVariants,
	Checkbox,
	DatePickerFieldControl,
	Field,
	FieldLegend,
	FieldSet,
	Form as FormProvider,
	Icon,
	IconProps,
	InputFieldControl,
	Popover,
	PopoverContent,
	PopoverTrigger,
	SelectFieldControl,
	Typography
} from '@/components/ui'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Table } from '@tanstack/react-table'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { omit, omitBy } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { useForm, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { PageQueryParams, usePageQueryParams } from '../-hooks/use-page-query-params'
import {
	type FilterColumn,
	type FilterOperator,
	type TruckloadDeliveryFilterFormValues,
	truckloadDeliveryFilterSchema
} from '../-schemas'

type FieldItemProps = {
	index: number
	name: FilterColumn
	label: string
	icon: IconProps['name']
	type: 'text' | 'date'
}

const GlobalFilter: React.FC<{
	table: Table<ITruckloadDelivery>
	event$: EventEmitter<Record<string, unknown>>
}> = () => {
	const { t } = useTranslation()
	const { searchParams, setParams } = usePageQueryParams()

	const form = useForm<TruckloadDeliveryFilterFormValues>({
		resolver: zodResolver(truckloadDeliveryFilterSchema),
		defaultValues: {
			where: [
				{ column: null, operator: 'like_%@value%', value: null },
				{ column: null, operator: 'like_%@value%', value: null },
				{ column: null, operator: 'like_%@value%', value: null },
				{ column: null, operator: 'between_@value1_and_@value2', value: null },
				{ column: null, operator: 'between_@value1_and_@value2', value: null },
				{ column: null, operator: 'between_@value1_and_@value2', value: null },
				{ column: null, operator: 'between_@value1_and_@value2', value: null }
			]
		}
	})

	const handleSelectColumn = (checked: CheckedState) => {
		// setGlobalFilterColumns((prev) => {
		// if (checked) return [...new Set([...prev, 'po'])]
		// return prev.filter((item) => item !== 'po')
		// })
	}

	const fields: Omit<FieldItemProps, 'index'>[] = [
		{ icon: 'Truck', name: 'license_plate', label: t('ns_erp:fields.license_plate'), type: 'text' },
		{ icon: 'Container', name: 'container_number', label: t('ns_erp:fields.container_number'), type: 'text' },
		{ icon: 'NotepadText', name: 'po', label: t('ns_erp:fields.po'), type: 'text' },
		{ icon: 'CalendarPlus', name: 'created_at', label: t('ns_common:common_fields.created_at'), type: 'date' },
		{
			icon: 'CalendarCheck',
			name: 'container_sealing_time',
			label: t('ns_erp:fields.container_sealing_time'),
			type: 'date'
		},
		{
			icon: 'CalendarCheck',
			name: 'factory_departure_time',
			label: t('ns_erp:fields.factory_departure_time'),
			type: 'date'
		},
		{
			icon: 'CalendarCheck',
			name: 'actual_factory_departure_time',
			label: t('ns_erp:fields.actual_factory_departure_time'),
			type: 'date'
		}
	]

	return (
		<Popover>
			<PopoverTrigger
				className={buttonVariants({
					variant: 'outline',
					className: 'flex-1 !justify-start font-normal xl:flex-none xl:basis-1/2'
				})}>
				<Icon name='ListFilter' />
				<Typography variant='small' color='muted'>
					{t('ns_common:actions.search')} ...
				</Typography>
			</PopoverTrigger>
			<PopoverContent
				align='start'
				className='w-[calc(100svw-16px)] space-y-6 xl:w-[--radix-popover-trigger-width]'
				onOpenAutoFocus={(e) => e.preventDefault()}>
				<FormProvider {...form}>
					<Form
						onSubmit={form.handleSubmit((value) => {
							const filterParams = value.where
								.filter((q) => !!q.column)
								.reduce((acc, curr) => {
									return { ...acc, [`where.${curr.column}`]: curr.operator.replace('@value', curr.value) }
								}, {})
							const noneFilterParams = omitBy<Partial<PageQueryParams>>(searchParams, (_value, key) =>
								key.startsWith('where')
							)

							setParams({ ...noneFilterParams, ...filterParams } as PageQueryParams, { overrideExisting: true })
						})}>
						<FieldSet>
							<FieldLegend>{t('ns_common:titles.advanced_search')}</FieldLegend>
							<Field>
								{fields.map((field, index) => (
									<FormItem key={field.name} index={index} {...field} />
								))}
							</Field>
							<Field orientation='horizontal' className='justify-end'>
								<Button type='submit'>{t('ns_common:actions.search')}</Button>
								<Button variant='outline' type='button' onClick={() => form.reset()}>
									{t('ns_common:actions.cancel')}
								</Button>
							</Field>
						</FieldSet>
					</Form>
				</FormProvider>
			</PopoverContent>
		</Popover>
	)
}

const FormItem: React.FC<FieldItemProps> = ({ index, name, label, icon, type }) => {
	const { t, i18n } = useTranslation()
	const { control, setValue } = useFormContext()
	const currentColumnValue = useWatch({ control, name: `where.${index}.column` })
	const currentOperator = useWatch({ control, name: `where.${index}.operator` })

	const operators: Array<{ label: string; value: FilterOperator }> = useMemo(() => {
		const expressions: Array<{ label: string; value: FilterOperator; types: FieldItemProps['type'][] }> = [
			{ label: t('ns_common:filter.contains'), value: 'like_%@value%', types: ['text'] },
			{ label: t('ns_common:filter.begins_with'), value: 'like_@value%', types: ['text'] },
			{ label: t('ns_common:filter.ends_with'), value: 'like_%@value', types: ['text'] },
			{ label: t('ns_common:filter.between'), value: 'between_@value1_and_@value2', types: ['date'] },
			{ label: t('ns_common:filter.equals'), value: '=_@value', types: ['text', 'date'] }
		]
		return expressions.filter((expr) => expr.types.includes(type)).map((expr) => omit(expr, 'types'))
	}, [i18n.language, type])

	useEffect(() => {
		if (type === 'date') setValue(`where.${index}.value`, null)
	}, [currentColumnValue])

	const isIncluded = !!currentColumnValue

	return (
		<FieldGroup className='grid grid-cols-[1.5fr_1fr_2fr] gap-2 space-y-0.5'>
			<FieldLabel
				htmlFor={name}
				aria-disabled={!isIncluded}
				className='font-normal aria-disabled:text-muted-foreground'>
				<Checkbox
					id={name}
					checked={isIncluded}
					className='mr-2'
					onCheckedChange={(checked) => {
						if (checked) setValue(`where.${index}.column`, name)
						else setValue(`where.${index}.column`, null)
					}}
				/>
				<Icon name={icon} stroke='hsl(var(--muted-foreground))' />
				{label}
			</FieldLabel>

			<SelectFieldControl
				name={`where.${index}.operator`}
				defaultValue='like_%@value%'
				disabled={!isIncluded}
				datalist={operators}
				labelField='label'
				valueField='value'
				errorMessageVariant='tooltip'
			/>
			{type === 'text' && (
				<InputFieldControl
					name={`where.${index}.value`}
					placeholder={t('ns_common:actions.search') + '...'}
					disabled={!isIncluded}
					errorMessageVariant='tooltip'
				/>
			)}
			{type === 'date' && (
				<DatePickerFieldControl
					name={`where.${index}.value`}
					calendarProps={{ mode: currentOperator === '=_@value' ? 'single' : 'range', disabled: !isIncluded }}
				/>
			)}
		</FieldGroup>
	)
}

const FieldLabel: React.FC<React.ComponentProps<'label'>> = tw.label`text-sm flex items-center gap-x-2`
const Form: React.FC<React.ComponentProps<'form'>> = tw.form`space-y-2`
const FieldGroup: React.FC<React.ComponentProps<'div'>> = tw.div`grid grid-cols-3 gap-x-2`

export default GlobalFilter
