import { SortDirection } from '@tanstack/react-table'
import { Icon } from '../..'

type ColumnSortingProps = {
	isSorted: false | SortDirection
	enableSorting?: boolean
}

export const ColumnSorting: React.FC<ColumnSortingProps> = ({ isSorted, enableSorting }) => {
	if (!enableSorting) return null
	return <Icon name={isSorted === 'asc' ? 'ArrowDown' : isSorted === 'desc' ? 'ArrowUp' : 'ArrowUpDown'} />
}

ColumnSorting.displayName = 'ColumnSortingButton'
