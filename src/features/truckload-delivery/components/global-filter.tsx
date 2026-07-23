'use no memo'

import type { IconProps } from '@components/ui'
import {
	Badge,
	Button,
	buttonVariants,
	Checkbox,
	DatePickerFieldControl,
	Div,
	Field,
	FieldLegend,
	FieldSet,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	Popover,
	PopoverContent,
	PopoverTrigger,
	SelectFieldControl
} from '@components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { PopoverClose } from '@radix-ui/react-popover'
import { isNil, omit, omitBy } from 'lodash-es'
import React, { useEffect, useId, useMemo } from 'react'
import { useForm, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { GhostButton } from '../../../components/shared/ghost-button'
import type { PageQueryParams } from '../hooks/use-page-query-params'
import { useBuildQueryParams, usePageQueryParams } from '../hooks/use-page-query-params'
import { useStoreFilterParams } from '../hooks/use-store-filter-params'
import {
	type FilterColumn,
	type FilterOperator,
	type TruckloadDeliveryFilterFormValues,
	truckloadDeliveryFilterSchema
} from '../schemas'
import StatusFieldControl from './status-field-control'

type FieldItemProps = {
	index: number
	name: FilterColumn
	label: string
	icon: IconProps['name']
	type: 'text' | 'date' | 'select'
}

const defaultValue: TruckloadDeliveryFilterFormValues = {
	where: [
		{ column: null, operator: '=:@value', value: null },
		{ column: null, operator: 'like:%@value%', value: '' },
		{ column: null, operator: 'like:%@value%', value: '' },
		{ column: null, operator: 'like:%@value%', value: '' },
		{ column: null, operator: 'between:@value1,@value2', value: null },
		{ column: null, operator: 'between:@value1,@value2', value: null },
		{ column: null, operator: 'between:@value1,@value2', value: null },
		{ column: null, operator: 'between:@value1,@value2', value: null }
	]
}

const GlobalFilter: React.FC = () => {
	const { t, i18n } = useTranslation()
	const { searchParams, setParams } = usePageQueryParams()
	const [storedGlobalFilters, setStoredGlobalFilters] = useStoreFilterParams()

	const form = useForm<TruckloadDeliveryFilterFormValues>({
		resolver: zodResolver(truckloadDeliveryFilterSchema),
		defaultValues: storedGlobalFilters
	})

	const fields: Omit<FieldItemProps, 'index'>[] = useMemo(
		() => [
			{
				icon: 'BadgeCheck',
				name: 'approval_status',
				label: t('ns_erp:fields.status_approve'),
				type: 'select'
			},
			{
				icon: 'Truck',
				name: 'license_plate',
				label: t('ns_erp:fields.license_plate'),
				type: 'text'
			},
			{
				icon: 'Container',
				name: 'container_number',
				label: t('ns_erp:fields.container_number'),
				type: 'text'
			},
			{
				icon: 'NotepadText',
				name: 'po',
				label: t('ns_erp:fields.po'),
				type: 'text'
			},
			{
				icon: 'CalendarPlus',
				name: 'created_at',
				label: t('ns_common:common_fields.created_at'),
				type: 'date'
			},
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
				name: 'actual_departure_time',
				label: t('ns_erp:fields.actual_departure_time'),
				type: 'date'
			}
		],
		[i18n.language]
	)

	const buildQueryParams = useBuildQueryParams()

	useEffect(() => {
		if (!('page' in searchParams) || !('limit' in searchParams)) return
		const nextParams = buildQueryParams(searchParams, storedGlobalFilters)
		form.reset(storedGlobalFilters)
		setParams(nextParams)
	}, [storedGlobalFilters])

	const handleSubmit = (value: TruckloadDeliveryFilterFormValues) => {
		setStoredGlobalFilters(value)
		const nextParams = buildQueryParams(searchParams, value)
		nextParams.page = 1 // * Reset to first page when applying new filters
		setParams(nextParams)
	}

	const handleClearFilters: React.MouseEventHandler = (e) => {
		e.stopPropagation()
		form.reset(defaultValue)
		setStoredGlobalFilters(defaultValue)
		setParams(omitBy(searchParams, (_value, key) => key.startsWith('where')) as PageQueryParams)
	}

	const columnFilters = storedGlobalFilters.where

	const appliedFilters = Array.isArray(columnFilters) ? columnFilters.filter((filter) => !isNil(filter.column)) : []

	return (
		<Div className='relative overflow-visible'>
			<Popover>
				<PopoverTrigger asChild>
					<Div className={buttonVariants({ variant: 'outline', className: 'cursor-pointer' })}>
						<Icon name='Funnel' />
						{t('ns_common:table.filter')}
						<Badge>{appliedFilters.length}</Badge>
						{appliedFilters.length > 0 && (
							<GhostButton onClick={handleClearFilters} className='aspect-square size-6 basis-6'>
								<Icon name='X' />
							</GhostButton>
						)}
					</Div>
				</PopoverTrigger>
				<PopoverContent
					align='start'
					className='w-[calc(100vw-1rem)] space-y-6 lg:w-auto xl:w-auto'
					onOpenAutoFocus={(e) => e.preventDefault()}>
					<FormProvider {...form}>
						<Form onSubmit={form.handleSubmit(handleSubmit)}>
							<FieldSet>
								<FieldLegend>{t('ns_common:titles.advanced_search')}</FieldLegend>
								<Field>
									{fields.map((field, index) => (
										<FormItem key={index} {...{ ...field, index }} />
									))}
								</Field>
								<Field orientation='horizontal' className='justify-end gap-x-2'>
									<PopoverClose asChild>
										<Button type='submit'>{t('ns_common:actions.search')}</Button>
									</PopoverClose>
									<PopoverClose asChild>
										<Button variant='outline' type='button' onClick={handleClearFilters}>
											{t('ns_common:actions.cancel')}
										</Button>
									</PopoverClose>
								</Field>
							</FieldSet>
						</Form>
					</FormProvider>
				</PopoverContent>
			</Popover>
		</Div>
	)
}

const FormItem: React.FC<FieldItemProps> = ({ index, name, label, icon, type }) => {
	'use no memo'

	const { t, i18n } = useTranslation()
	const { control, setValue, resetField } = useFormContext()
	const currentColumnValue = useWatch({ control, name: `where.${index}.column` })
	const currentOperator = useWatch({ control, name: `where.${index}.operator` })

	const operators: Array<{ label: string; value: FilterOperator }> = useMemo(() => {
		const expressions: Array<{ label: string; value: FilterOperator; types: FieldItemProps['type'][] }> = [
			{ label: t('ns_common:filter.contains'), value: 'like:%@value%', types: ['text'] },
			{ label: t('ns_common:filter.begins_with'), value: 'like:@value%', types: ['text'] },
			{ label: t('ns_common:filter.ends_with'), value: 'like:%@value', types: ['text'] },
			{ label: t('ns_common:filter.between'), value: 'between:@value1,@value2', types: ['date'] },
			{ label: t('ns_common:filter:equals'), value: '=:@value', types: ['text', 'date', 'select'] }
		]
		return expressions.filter((expr) => expr.types.includes(type)).map((expr) => omit(expr, 'types'))
	}, [i18n.language])

	const isIncluded = !!currentColumnValue

	const id = useId()

	return (
		<FieldGroup>
			<FieldLabel
				htmlFor={id}
				aria-disabled={!isIncluded}
				onClick={(e) => e.stopPropagation()}
				className='aria-disabled:text-muted-foreground font-normal'>
				<Checkbox
					id={id}
					checked={isIncluded}
					onCheckedChange={(checked) => {
						if (checked) setValue(`where.${index}.column`, name)
						else {
							setValue(`where.${index}.column`, null)
						}
					}}
				/>
				<Icon name={icon} stroke='var(--muted-foreground)' />
				<span className='line-clamp-1' title={label}>
					{label}
				</span>
			</FieldLabel>
			<SelectFieldControl
				name={`where.${index}.operator`}
				defaultValue={operators[0].value}
				disabled={!isIncluded}
				datalist={operators}
				labelField='label'
				valueField='value'
				errorMessageVariant='tooltip'
				onValueChange={() => {
					if (type === 'date') resetField(`where.${index}.value`)
				}}
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
					disabled={!isIncluded}
					calendarProps={{ mode: currentOperator === '=:@value' ? 'single' : 'range', disabled: !isIncluded }}
				/>
			)}
			{type === 'select' && <StatusFieldControl name={`where.${index}.value`} disabled={!isIncluded} />}
		</FieldGroup>
	)
}

const FieldLabel: React.FC<React.ComponentProps<'label'>> =
	tw.label`text-sm flex items-center gap-x-2 [&_svg]:min-w-4 *:last:flex-1`
const Form: React.FC<React.ComponentProps<'form'>> = tw.form`space-y-2`
const FieldGroup: React.FC<React.ComponentProps<'div'>> = tw.div`grid grid-cols-[1.5fr_1fr_2fr] gap-x-2`

export default GlobalFilter
