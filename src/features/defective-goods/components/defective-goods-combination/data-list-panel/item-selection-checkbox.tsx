import { UserRole } from '@common/constants/enums'
import RoleBaseAccessControl from '@components/guards/role-base-access-control'
import { Checkbox, Div, Typography } from '@components/ui'
import type Pagination from '@components/ui/@custom/pagination'
import type { IDefectiveGoods } from '@features/defective-goods/types'
import type { CheckedState } from '@radix-ui/react-checkbox'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useListPanelContext } from '../../../contexts/list-panel-context'

type ItemSelectionCheckboxProps = React.ComponentProps<typeof Checkbox> &
	Pick<Pagination<IDefectiveGoods>, 'data' | 'totalDocs' | 'limit'>

const ItemSelectionCheckbox: React.FC<ItemSelectionCheckboxProps> = ({ data, totalDocs }) => {
	const { t } = useTranslation()
	const { updatePageItems, getSelectedCount, getCheckboxState, toggleAll, clearSelection } = useListPanelContext()

	// Update page items when data changes
	useEffect(() => {
		if (data?.length) {
			const pageItemIds = data.map((item) => item.id)
			updatePageItems(pageItemIds, totalDocs)
		}
	}, [data, totalDocs, updatePageItems])

	// Get current checkbox state and selected count
	const checkboxState = getCheckboxState()
	const selectedCount = getSelectedCount()

	// Handle checkbox change
	const handleCheckboxChange = useCallback(
		(checked: CheckedState) => {
			if (checked === true) {
				toggleAll()
			} else if (checked === false) {
				clearSelection()
			}
			// Indeterminate state is computed, no action needed
		},
		[toggleAll, clearSelection]
	)

	return (
		<RoleBaseAccessControl
			mode='fallback'
			authorizedRoles={[UserRole.DG_WAREHOUSE_STAFF]}
			fallbackComponent={
				<Typography variant='small' color='muted'>
					{t('ns_common:table.total_rows', {
						count: totalDocs,
						defaultValue: `${selectedCount}/${totalDocs} selected`
					})}
				</Typography>
			}>
			<Div className='inline-flex items-center gap-x-3'>
				<Checkbox checked={checkboxState} onCheckedChange={handleCheckboxChange} />
				<Typography variant='small' color='muted'>
					{t('ns_common:pagination.selected_records', {
						selectedRecords: `${selectedCount}/${totalDocs ?? 0}`,
						defaultValue: `${selectedCount}/${totalDocs} selected`
					})}
				</Typography>
			</Div>
		</RoleBaseAccessControl>
	)
}

ItemSelectionCheckbox.displayName = 'RecordSelectionCheckbox'

export default ItemSelectionCheckbox
