'use no memo'

import { Div, DropdownSelect, Icon, Input } from '@/components/ui'
import { Column } from '@tanstack/react-table'
import { useDebounceEffect } from 'ahooks'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFilterQuery } from '../../-hooks/use-filter-query'

type ColumnFilterProps<TData, TValue> = {
	column: Column<TData, TValue>
}

export function TableColumnFilter<TData, TValue>({ column }: ColumnFilterProps<TData, TValue>) {
	const { t } = useTranslation()
	const filterVariant = column.columnDef.meta?.filterVariant
	const { searchParams, setParams } = useFilterQuery()

	const [currentFilterValue, setCurrentFilterValue] = useState(searchParams[column.id])

	useEffect(() => {
		console.log(searchParams)
		setCurrentFilterValue(searchParams[column.id])
	}, [searchParams])

	const getFacetedUniqueValues = () => {
		try {
			return column.getFacetedUniqueValues()
		} catch {
			return new Map()
		}
	}

	const getSortedUniqueValues = () => {
		const facetedUniqueValues = getFacetedUniqueValues()
		const uniqueValues = Array.from(facetedUniqueValues?.keys())
		uniqueValues.sort((a, b) => {
			if (a === b) return 0
			return a > b ? 1 : -1
		})
		return uniqueValues
	}

	// * Useful for server side filtering
	const metaUniqueValues = column.columnDef.meta?.facetedUniqueValues
	if (!column.columnDef.enableColumnFilter)
		return (
			<Div className='flex h-full select-none items-center justify-center px-2 text-xs font-medium text-muted-foreground/50'>
				<Icon name='Minus' />
			</Div>
		)

	useDebounceEffect(
		() => {
			setParams({ ...searchParams, [column.id]: currentFilterValue })
		},
		[currentFilterValue],
		{ wait: 200, leading: true, trailing: true }
	)

	switch (filterVariant) {
		case 'select': {
			return (
				<DropdownSelect
					selectTriggerProps={{
						className:
							'w-full px-4 h-[var(--row-height)] bg-transparent rounded-none border-none text-sm font-normal text-muted-foreground ring-0 focus:ring-0 outline-none shadow-none hover:text-foreground focus:border-none ring-0',
						tabIndex: 0
					}}
					selectProps={{
						defaultValue: '',
						value: currentFilterValue ?? ('' as string),
						onValueChange: (value) => {
							setCurrentFilterValue(value)
						}
					}}
					placeholder={t('ns_common:table.search_in_column')}
					datalist={
						Array.isArray(metaUniqueValues)
							? metaUniqueValues
							: getSortedUniqueValues()
									.filter((value) => Boolean(value))
									.map((value: any) => ({
										label: value,
										value: value
									}))
					}
					labelField='label'
					valueField='value'
				/>
			)
		}

		default: {
			return (
				<Input
					id={column.id}
					value={currentFilterValue ?? ('' as React.ComponentProps<'input'>['value'])}
					placeholder={t('ns_common:table.search_in_column')}
					onChange={(e) => setCurrentFilterValue(e.currentTarget.value)}
					autoComplete='off'
					className='h-[var(--row-height)] border-none bg-transparent text-sm font-normal shadow-none focus:border-none'
				/>
			)
		}
	}
}
