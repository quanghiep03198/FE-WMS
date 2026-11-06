'use no memo'

import AutoComplete from '@components/customs/auto-complete'
import { DebouncedInput } from '@components/customs/debounced-input'
import { Div } from '@components/customs/div'
import { DropdownSelect } from '@components/customs/dropdown-select'
import { Combobox } from '@components/ui/combobox'
import { Icon } from '@components/ui/icon'
import { useFilterQuery } from '@features/defective-goods/hooks/use-filter-query'
import type { IDefectiveGoods } from '@features/defective-goods/types'
import {
	useGetManufacturingOrderQuery,
	useSearchManufacturingOrderQuery,
	useSearchPurchaseOrderQuery
} from '@features/order/hooks/use-order-request'
import type { Column, Table } from '@tanstack/react-table'
import { useDebounce } from 'ahooks'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

type ColumnFilterProps<TData, TValue> = {
	table: Table<TData>
	column: Column<TData, TValue>
}

export function TableColumnFilter<Prop extends keyof IDefectiveGoods>({
	table,
	column
}: ColumnFilterProps<IDefectiveGoods, ExtractObjectValue<IDefectiveGoods, Prop>>) {
	const { t } = useTranslation()
	const { searchParams, setParam, setParams, removeParam } = useFilterQuery()
	const [searchManufacturingOrder, setSearchManufacturingOrder] = useState(searchParams.mo_no ?? '')
	const [searchPurchaseOrder, setSearchPurchaseOrder] = useState(searchParams.po ?? '')

	const debouncedSearchManufacturingOrder = useDebounce(searchManufacturingOrder, { wait: 200 })
	const debouncedSearchPurchaseOrder = useDebounce(searchPurchaseOrder, { wait: 200 })

	const { data: filteredManufacturingOrders } = useSearchManufacturingOrderQuery(
		debouncedSearchManufacturingOrder,
		column.id === 'mo_no'
	)
	const { data: purchaseOrders } = useSearchPurchaseOrderQuery(debouncedSearchPurchaseOrder, column.id === 'po')

	const manufacturingOrderFilter =
		column.id === 'mo_no' ? (column.getFilterValue() ?? searchParams.mo_no ?? '') : undefined
	const value =
		column.id === 'mo_no' ? manufacturingOrderFilter : searchParams[column.id] || column.getFilterValue() || ''

	const { data: manufacturingOrder, isFetching } = useGetManufacturingOrderQuery(
		column.id === 'mo_no' ? value : undefined
	)

	const comboboxRef = useRef<{ reset: () => void }>({ reset: () => void '' })

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
		// mo_no is only synced to search params once its manufacturing order info has been loaded (see effect below)
		if (column.id === 'mo_no') return
		if (column.getFilterValue()) setParam(column.id, column.getFilterValue())
		else {
			removeParam(column.id)
			if (column.id === 'po') setSearchPurchaseOrder('')
		}
	}, [column.getFilterValue()])

	useEffect(() => {
		if (column.id !== 'mo_no') return

		const relatedColumns = ['brand_name', 'factory_shoes_style', 'color_sn'] as const
		if (!manufacturingOrderFilter) {
			for (const relatedColumn of relatedColumns) {
				table.getColumn(relatedColumn)?.setFilterValue(undefined)
			}
			setSearchManufacturingOrder('')
			if (searchParams.mo_no || relatedColumns.some((relatedColumn) => searchParams[relatedColumn])) {
				removeParam('mo_no', ...relatedColumns)
			}
			return
		}

		if (isFetching || !manufacturingOrder || manufacturingOrder.mo_no !== manufacturingOrderFilter) return

		for (const relatedColumn of relatedColumns) {
			table.getColumn(relatedColumn)?.setFilterValue(manufacturingOrder[relatedColumn])
		}

		if (
			searchParams.mo_no !== manufacturingOrder.mo_no ||
			searchParams.brand_name !== manufacturingOrder.brand_name ||
			searchParams.factory_shoes_style !== manufacturingOrder.factory_shoes_style ||
			searchParams.color_sn !== manufacturingOrder.color_sn
		) {
			setParams({
				mo_no: manufacturingOrder.mo_no,
				brand_name: manufacturingOrder.brand_name,
				factory_shoes_style: manufacturingOrder.factory_shoes_style,
				color_sn: manufacturingOrder.color_sn
			})
		}
	}, [
		column.id,
		manufacturingOrderFilter,
		isFetching,
		manufacturingOrder,
		table,
		searchParams,
		removeParam,
		setParams
	])

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

	if (!column.columnDef.enableColumnFilter)
		return (
			<Div className='text-muted-foreground bg-table-head flex h-(--row-height) items-center justify-center px-2 text-xs font-medium select-none'>
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
						onValueChange: column.setFilterValue
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
					contentProps={{ modal: false }}
					datalist={datalist}
					labelField='label'
					ref={comboboxRef}
					triggerProps={{ className: 'border-none shadow-none' }}
					value={value}
					valueField='value'
					onSelect={column.setFilterValue}
					onInput={(value) => {
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
					contentProps={{ modal: false }}
					datalist={datalist}
					labelField='label'
					placeholder={t('ns_common:table.search_in_column')}
					shouldFilter={true}
					value={value}
					valueField='value'
					onSelect={column.setFilterValue}
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
