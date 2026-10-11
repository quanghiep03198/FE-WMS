import type { DropdownSelectProps } from '@components/customs/dropdown-select'
import { DropdownSelect } from '@components/customs/dropdown-select'
import type { ComboboxProps } from '@components/ui/combobox'
import { Combobox } from '@components/ui/combobox'
import { Input, type InputProps } from '@components/ui/input'
import type { CellContext } from '@tanstack/react-table'
import React, { Fragment, useEffect, useState } from 'react'
import { DEFAULT_ESTIMATE_SIZE } from '../constants'

type BaseCellEditorProps =
	| {
			cellEditorVariant: 'input'
			cellEditorProps: InputProps
	  }
	| {
			cellEditorVariant: 'select'
			cellEditorProps: DropdownSelectProps<any> & { template?: (data: any) => string }
	  }
	| {
			cellEditorVariant: 'combobox'
			cellEditorProps: ComboboxProps<any> & { template?: (data: any) => string }
	  }

export type CellEditorProps = CellContext<any, unknown> &
	BaseCellEditorProps & {
		transformedValue?: any
		className?: string
	}

const CellEditor: React.FC<CellEditorProps> = ({
	getValue,
	transformedValue,
	column,
	table,
	row,
	cellEditorVariant,
	cellEditorProps,
	className
}) => {
	// We need to keep and update the state of the cell normally
	const [value, setValue] = useState(getValue())

	// If the initialValue is changed external, sync it up with our state
	useEffect(() => {
		setValue(getValue())
	}, [getValue()])

	// If cell is not being edited, return cell transformed/original value
	if (!table.options.meta?.editedRows[row.id]) return <Fragment>{transformedValue ?? getValue()}</Fragment>

	switch (cellEditorVariant) {
		case 'input':
			return (
				<Input
					className='focus-within:ring-offset-transparen h-full rounded-none p-0 px-4 py-0 ring-0 outline-none focus-within:ring-0'
					placeholder={cellEditorProps.placeholder ?? 'Type ...'}
					role='textbox'
					style={{ height: DEFAULT_ESTIMATE_SIZE }}
					value={value as InputProps['value']}
					onChange={(e) => {
						setValue(e.target.value)
						table.options.meta?.updateRow(row.index, column.id, value)
					}}
					{...cellEditorProps}
				/>
			)

		case 'select': {
			const transformedData = cellEditorProps.datalist.map((item) => ({
				...item,
				customLabel: `${item[cellEditorProps.labelField]}`
				// customLabel: `${item[cellEditorProps.labelField]} - ${item[cellEditorProps.valueField]}`
			}))

			return (
				<DropdownSelect
					datalist={transformedData}
					labelField='customLabel'
					valueField={cellEditorProps.valueField}
					selectContentProps={{
						sideOffset: 8,
						...cellEditorProps?.selectContentProps
					}}
					selectProps={{
						value: (value ?? undefined) as string | undefined,
						onValueChange: (value) => {
							setValue(value)
							table.options.meta?.updateRow(row.index, column.id, value)
						}
					}}
					selectTriggerProps={{
						role: 'listbox',
						className: `${className} border-none outline-none focus-within:ring-0 rounded-none px-4 h-full`,
						style: { height: DEFAULT_ESTIMATE_SIZE }
					}}
				/>
			)
		}

		case 'combobox': {
			return (
				<Combobox
					contentProps={{ sideOffset: 12, ...cellEditorProps.contentProps }}
					value={value as string}
					triggerProps={{
						role: 'combobox',
						style: { height: DEFAULT_ESTIMATE_SIZE },
						className:
							'rounded-none border-none hover:bg-inherit focus-within:ring-0 focus-within:ring-offset-transparent h-full py-0 px-4'
					}}
					onSelect={(value) => {
						setValue(value)
						table.options.meta?.updateRow(row.index, column.id, value)
					}}
					{...cellEditorProps}
				/>
			)
		}
	}
}

export default CellEditor
