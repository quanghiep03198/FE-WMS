/* eslint-disable no-mixed-spaces-and-tabs */
import { Combobox, ComboboxProps, DropdownSelect, DropdownSelectProps, Input, InputProps } from '@/components/ui'
import { CellContext } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'

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
	const initialValue = transformedValue ?? getValue()
	// We need to keep and update the state of the cell normally
	const [value, setValue] = useState(initialValue)

	// If the initialValue is changed external, sync it up with our state
	useEffect(() => {
		setValue(initialValue)
	}, [initialValue])

	const onBlur = () => {
		table.options.meta?.updateData(row.index, column.id, value)
	}

	// If cell is not being edited, return cell original value
	if (!table.options.meta?.editedRows[row.id]) return <>{initialValue}</>

	switch (cellEditorVariant) {
		case 'input':
			return (
				<Input
					role='textbox'
					className='h-9 rounded-none border-none p-0 outline-none ring-0 focus-within:ring-0 focus-within:ring-offset-transparent'
					onChange={(e) => setValue(e.target.value)}
					onBlur={onBlur}
					{...cellEditorProps}
				/>
			)
		case 'select': {
			return (
				<DropdownSelect
					selectProps={{
						value: (value ?? undefined) as string | undefined,
						onValueChange: (value) => setValue(value)
					}}
					placeholder='Select'
					selectTriggerProps={{
						role: 'listbox',
						className: 'border-none ouline-none focus-within:ring-0 rounded-none h-9',
						onBlur
					}}
					{...cellEditorProps}
				/>
			)
		}
		case 'combobox': {
			return (
				<Combobox
					triggerProps={{
						role: 'combobox',
						className:
							'rounded-none hover:bg-inherit focus-within:ring-0 focus-within:ring-offset-transparent h-9',
						onBlur
					}}
					onSelect={(value) => setValue(value)}
					value={value as string}
					{...cellEditorProps}
				/>
			)
		}

		default: {
			return <>{initialValue}</>
		}
	}
}

export default CellEditor
