'use no memo'

import AutoComplete from '@components/customs/auto-complete'
import { DebouncedInput } from '@components/customs/debounced-input'
import { Div } from '@components/customs/div'
import { DropdownSelect } from '@components/customs/dropdown-select'
import { Combobox } from '@components/ui/combobox'
import { Icon } from '@components/ui/icon'
import { useFilterQuery } from '@features/defective-goods/hooks/use-filter-query'
import {
	useGetManufacturingOrderQuery,
	useSearchManufacturingOrderQuery,
	useSearchPurchaseOrderQuery
} from '@features/order/hooks/use-order-request'
import type { Column, Table } from '@tanstack/react-table'
import { useDebounce } from 'ahooks'
import { isEmpty, isNil, omitBy } from 'lodash-es'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type ColumnFilterProps<TData, TValue> = {
	table: Table<TData>
	column: Column<TData, TValue>
}

export function TableColumnFilter<TData, TValue>({ table, column }: ColumnFilterProps<TData, TValue>) {
	const { searchParams, setParams, removeParam } = useFilterQuery()
	const { t } = useTranslation()
	// const [currentFilterValue, setCurrentFilterValue] = useState(searchParams[column.id])
	const [searchManufacturingOrder, setSearchManufacturingOrder] = useState(searchParams.mo_no ?? '')
	const [searchPurchaseOrder, setSearchPurchaseOrder] = useState(searchParams.po ?? '')

	const debouncedSearchManufacturingOrder = useDebounce(searchManufacturingOrder, { wait: 200 })
	const debouncedSearchPurchaseOrder = useDebounce(searchPurchaseOrder, { wait: 200 })

	const { data: filteredManufacturingOrders } = useSearchManufacturingOrderQuery(
		debouncedSearchManufacturingOrder,
		column.id === 'mo_no'
	)
	const { data: purchaseOrders } = useSearchPurchaseOrderQuery(debouncedSearchPurchaseOrder, column.id === 'po')
	const { data: manufacturingOrder } = useGetManufacturingOrderQuery(
		column.id === 'mo_no' ? (column.getFilterValue() as string) || searchParams.mo_no : undefined
	)

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

	useEffect(() => {
		if (column.id === 'mo_no') return
		setParams(
			omitBy({ ...searchParams, [column.id]: column.getFilterValue() }, (value) => isNil(value) || isEmpty(value))
		)
	}, [column.getFilterValue()])

	useEffect(() => {
		if (!manufacturingOrder) return

		setParams({
			...searchParams,
			mo_no: manufacturingOrder.mo_no,
			brand_name: manufacturingOrder.brand_name,
			factory_shoes_style: manufacturingOrder.factory_shoes_style,
			color_sn: manufacturingOrder.color_sn
		})
	}, [manufacturingOrder?.mo_no])

	// * Useful for server side filtering
	const filterVariant = column.columnDef.meta?.filterVariant
	const metaUniqueValues = column.columnDef.meta?.facetedUniqueValues

	const datalist = useMemo(() => {
		if (filterVariant === 'date' || filterVariant === 'text' || filterVariant === 'range') return []

		if (column.id === 'mo_no')
			return Array.isArray(filteredManufacturingOrders)
				? filteredManufacturingOrders.map((item) => ({ label: item.mo_no, value: item.mo_no }))
				: []
		else if (column.id === 'po')
			return Array.isArray(purchaseOrders) ? purchaseOrders.map((item) => ({ label: item.po, value: item.po })) : []
		else
			return Array.isArray(metaUniqueValues)
				? metaUniqueValues
				: getSortedUniqueValues()
						.filter((value) => Boolean(value))
						.map((value: any) => ({ label: value, value: value }))
	}, [column.id, metaUniqueValues, filteredManufacturingOrders, purchaseOrders, getSortedUniqueValues])

	const value = searchParams[column.id] ? searchParams[column.id] : column.getFilterValue()

	if (column.id === 'mo_no') console.log(searchParams.mo_no)

	if (!column.columnDef.enableColumnFilter)
		return (
			<Div className='text-muted-foreground/50 flex h-full items-center justify-center px-2 text-xs font-medium select-none'>
				<Icon name='Minus' />
			</Div>
		)

	switch (filterVariant) {
		case 'select': {
			return (
				<DropdownSelect
					{...column.columnDef.meta?.filterComponentProps}
					datalist={datalist}
					labelField='label'
					placeholder={t('ns_common:table.search_in_column')}
					valueField='value'
					selectProps={{
						defaultValue: '',
						value,
						onValueChange: (value) => {
							column.setFilterValue(value)
						}
					}}
					selectTriggerProps={{
						className:
							'w-full px-4 h-(--row-height) bg-transparent rounded-none border-none text-sm font-normal text-muted-foreground ring-0 focus:ring-0 outline-none shadow-none hover:text-foreground focus:border-none',
						tabIndex: 0
					}}
				/>
			)
		}

		case 'combobox': {
			return (
				<Combobox
					{...column.columnDef.meta?.filterComponentProps}
					datalist={datalist}
					labelField='label'
					triggerProps={{ className: 'border-none shadow-none' }}
					value={value}
					valueField='value'
					onInput={(value) => {
						if (column.id === 'mo_no') setSearchManufacturingOrder(value)
						if (column.id === 'po') setSearchPurchaseOrder(value)
					}}
					onSelect={(value) => {
						column.setFilterValue(value)
						if (column.id === 'mo_no') setSearchManufacturingOrder(value)
						if (column.id === 'po') setSearchPurchaseOrder(value)
					}}
				/>
			)
		}

		case 'autocomplete': {
			return (
				<AutoComplete
					{...column.columnDef.meta?.filterComponentProps}
					className='text-muted-foreground hover:text-foreground h-(--row-height) w-full rounded-none border-none! bg-transparent px-4 text-sm font-normal shadow-none ring-0 outline-none placeholder:text-sm focus:border-none focus:ring-0'
					datalist={datalist}
					labelField='label'
					placeholder={t('ns_common:table.search_in_column')}
					shouldFilter={true}
					value={value}
					valueField='value'
					onSelect={(value) => {
						column.setFilterValue(value)
					}}
				/>
			)
		}

		default: {
			return (
				<DebouncedInput
					autoComplete='off'
					className='h-(--row-height) border-none bg-transparent text-sm font-normal shadow-none focus:border-none'
					id={column.id}
					placeholder={t('ns_common:table.search_in_column')}
					value={value}
					onChange={(e) => column.setFilterValue(e.currentTarget.value)}
				/>
			)
		}
	}
}
