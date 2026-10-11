import { ROW_EXPANSION_COLUMN_ID } from '@components/addons/tanstack-table/constants'

export const getCanSticky = (columnId: string): React.CSSProperties => {
	if (columnId !== ROW_EXPANSION_COLUMN_ID) return {}
	return { position: 'sticky', left: 0, zIndex: 10 }
}
