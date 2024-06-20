import { CheckedState } from '@radix-ui/react-checkbox'
import { Table } from '@tanstack/react-table'
import { Checkbox } from '../../@shadcn/checkbox'

export function IndeterminateCheckbox<TData = unknown>({ table }: { table: Table<TData> }) {
	const checked = (table.getIsAllPageRowsSelected() ||
		(table.getIsSomePageRowsSelected() && 'indeterminate')) as CheckedState
	return (
		<Checkbox
			role='checkbox'
			checked={checked}
			onCheckedChange={(value) => {
				table.toggleAllPageRowsSelected(!!value)
			}}
		/>
	)
}
