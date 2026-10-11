'use no memo'

import { Div } from '@components/customs/div'
import { DatePickerFieldControl } from '@components/forms/date-picker'
import { InputFieldControl } from '@components/forms/input'
import { SelectFieldControl } from '@components/forms/select'
import { Badge } from '@components/ui/badge'
import { Button, buttonVariants } from '@components/ui/button'
import { Checkbox } from '@components/ui/checkbox'
import { Field, FieldLegend, FieldSet } from '@components/ui/field'
import { Form as FormProvider } from '@components/ui/form'
import type { IconProps } from '@components/ui/icon'
import { Icon } from '@components/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { zodResolver } from '@hookform/resolvers/zod'
import { PopoverClose } from '@radix-ui/react-popover'
import { isNil, omit, omitBy } from 'lodash-es'
import React, { useEffect, useId, useMemo } from 'react'
import type { Resolver } from 'react-hook-form'
import { useForm, useFormContext } from 'react-hook-form'
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

const GlobalFilter: React.FC = () => {
	const { t, i18n } = useTranslation()
	const { searchParams, setParams } = usePageQueryParams()
	const [storedGlobalFilters, setStoredGlobalFilters] = useStoreFilterParams()

	const form = useForm<TruckloadDeliveryFilterFormValues>({
		resolver: zodResolver(truckloadDeliveryFilterSchema) as unknown as Resolver<TruckloadDeliveryFilterFormValues>,
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
				icon: 'Lock',
				name: 'seal_number',
				label: t('ns_erp:fields.seal_number'),
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
				name: 'factory_entrance_time',
				label: t('ns_erp:fields.factory_entrance_time'),
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
		const defaultValues = truckloadDeliveryFilterSchema.safeParse(undefined).data as TruckloadDeliveryFilterFormValues
		e.stopPropagation()
		form.reset(defaultValues)
		setStoredGlobalFilters(defaultValues)
		setParams(omitBy(searchParams, (_value, key) => key.startsWith('where')) as PageQueryParams)
	}

	const columnFilters = storedGlobalFilters.where

	const appliedFilters = Array.isArray(columnFilters) ? columnFilters.filter((filter) => !isNil(filter.column)) : []

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Div className={buttonVariants({ variant: 'outline', className: 'cursor-pointer' })}>
					<Icon name='Funnel' />
					{t('ns_common:table.filter')}
					<Badge>{appliedFilters.length}</Badge>
					{appliedFilters.length > 0 && (
						<GhostButton className='aspect-square size-6 basis-6' onClick={handleClearFilters}>
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
							<Field className='justify-end gap-x-2' orientation='horizontal'>
								<Button type='submit'>{t('ns_common:actions.search')}</Button>

								<PopoverClose asChild>
									<Button type='button' variant='outline' onClick={handleClearFilters}>
										{t('ns_common:actions.cancel')}
									</Button>
								</PopoverClose>
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
	const { setValue, resetField, watch } = useFormContext<TruckloadDeliveryFilterFormValues>()
	const currentColumnValue = watch(`where.${index}.column`)
	const currentOperator = watch(`where.${index}.operator`)
	const currentValue = watch(`where.${index}.value`)

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
				aria-disabled={!isIncluded}
				className='aria-disabled:text-muted-foreground font-normal'
				htmlFor={id}
				onClick={(e) => e.stopPropagation()}>
				<Checkbox
					checked={isIncluded}
					id={id}
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
				datalist={operators}
				defaultValue={operators[0].value!}
				disabled={!isIncluded}
				errorMessageVariant='tooltip'
				labelField='label'
				name={`where.${index}.operator`}
				valueField='value'
				onValueChange={() => {
					if (type === 'date') resetField(`where.${index}.value`)
				}}
			/>
			{type === 'text' && (
				<InputFieldControl
					disabled={!isIncluded}
					errorMessageVariant='tooltip'
					name={`where.${index}.value`}
					placeholder={t('ns_common:actions.search') + '...'}
				/>
			)}
			{type === 'date' && (
				<DatePickerFieldControl
					calendarProps={{ mode: currentOperator === '=:@value' ? 'single' : 'range', disabled: !isIncluded }}
					disabled={!isIncluded}
					name={`where.${index}.value`}
				/>
			)}
			{type === 'select' && <StatusFieldControl disabled={!isIncluded} name={`where.${index}.value`} />}
		</FieldGroup>
	)
}

const FieldLabel: React.FC<React.ComponentProps<'label'>> =
	tw.label`text-sm flex items-center gap-x-2 [&_svg]:min-w-4 *:last:flex-1`
const Form: React.FC<React.ComponentProps<'form'>> = tw.form`space-y-2`
const FieldGroup: React.FC<React.ComponentProps<'div'>> = tw.div`grid grid-cols-[1.5fr_1fr_2fr] gap-x-2`

export default GlobalFilter
