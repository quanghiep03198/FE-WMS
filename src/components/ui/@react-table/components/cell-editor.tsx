/* eslint-disable no-mixed-spaces-and-tabs */
import { Combobox, ComboboxProps, DropdownSelect, DropdownSelectProps, Input, InputProps } from '@/components/ui'
import { CellContext } from '@tanstack/react-table'
import React, { Fragment, useEffect, useState } from 'react'

type BaseCellEditorProps =
	| {
			cellEditorVariant: 'input'
			cellEditorProps: InputProps
	  }
	| {
			cellEditorVariant: 'select'
			cellEditorProps: DropdownSelectProps<any>
	  }
	| {
			cellEditorVariant: 'combobox'
			cellEditorProps: ComboboxProps<any>
	  }

type CellEditorProps = CellContext<any, unknown> & BaseCellEditorProps

const CellEditor: React.FC<CellEditorProps & { transformedValue?: any }> = ({
	getValue,
	transformedValue,
	column,
	table,
	row,
	cellEditorVariant,
	cellEditorProps
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
					role='textbox'
					placeholder={cellEditorProps.placeholder ?? 'Type ...'}
					className='focus-within:ring-offset-transparen h-full rounded-none border-none p-0 px-4 py-0 outline-none ring-0 focus-within:ring-0'
					onChange={(e) => {
						setValue(e.target.value)
						table.options.meta?.updateData(row.index, column.id, value)
					}}
					value={value as InputProps['value']}
					{...cellEditorProps}
				/>
			)
		case 'select': {
			return (
				<DropdownSelect
					selectProps={{
						value: (value ?? undefined) as string | undefined,
						onValueChange: (value) => {
							setValue(value)
							table.options.meta?.updateData(row.index, column.id, value)
						}
					}}
					selectTriggerProps={{
						role: 'listbox',
						className: 'border-none ouline-none focus-within:ring-0 rounded-none px-4 h-full py-0'
					}}
					selectContentProps={{ sideOffset: 8, ...cellEditorProps?.selectContentProps }}
					{...cellEditorProps}
				/>
			)
		}
		case 'combobox': {
			return (
				<Combobox
					value={value as string}
					onSelect={(value) => {
						setValue(value)
						table.options.meta?.updateData(row.index, column.id, value)
					}}
					triggerProps={{
						role: 'combobox',
						className:
							'rounded-none border-none hover:bg-inherit focus-within:ring-0 focus-within:ring-offset-transparent h-full py-0 px-4'
					}}
					contentProps={{ sideOffset: 12, ...cellEditorProps.contentProps }}
					{...cellEditorProps}
				/>
			)
		}
	}
}

export default CellEditor
