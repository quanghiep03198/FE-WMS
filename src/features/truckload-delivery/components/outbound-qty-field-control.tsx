'use no memo'

import { CommonActions } from '@common/constants/enums'
import type { InputFieldControlProps } from '@components/forms/input'
import { InputFieldControl } from '@components/forms/input'
import React, { useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { CreateDeliveryFormValues } from '../schemas'

const OutboundQtyInputFieldControl: React.FC<
	InputFieldControlProps<CreateDeliveryFormValues> & {
		['data-action']: CommonActions.CREATE | CommonActions.UPDATE
		['data-index']: number
	}
> = ({ name, ...props }) => {
	const { control, setValue } = useFormContext<CreateDeliveryFormValues>()
	const { t } = useTranslation()

	const fieldIndex = props['data-index']
	const fieldAction = props['data-action']

	const currentOutboundQty = useWatch({ name, control, defaultValue: 0 })
	const currentMaxOutboundQty = useWatch({
		control,
		name: `outbound_purchase_orders.${fieldIndex}.max_outbound_qty`,
		defaultValue: 0
	})

	const currentPurchaseOrder = useWatch({
		control,
		name: `outbound_purchase_orders.${fieldIndex}.po`
	})

	const actualMaxOutboundQty = useMemo(() => {
		if (!currentMaxOutboundQty && typeof currentMaxOutboundQty !== 'number') return Infinity
		if (fieldAction === CommonActions.UPDATE) return currentMaxOutboundQty + (currentOutboundQty ?? 0)
		return currentMaxOutboundQty
	}, [currentPurchaseOrder, currentOutboundQty, currentMaxOutboundQty])

	return (
		<InputFieldControl
			errorMessageVariant='tooltip'
			inputMode='numeric'
			min={1}
			name={name}
			step={1}
			type='number'
			value={currentOutboundQty === 0 ? null : currentOutboundQty}
			placeholder={
				actualMaxOutboundQty === Infinity
					? '0 (prs)'
					: t('ns_inoutbound:placeholders.max_qty', {
							qty: actualMaxOutboundQty,
							defaultValue: actualMaxOutboundQty
						})
			}
			onChange={(e) =>
				setValue(`outbound_purchase_orders.${props['data-index']}.outbound_qty`, Math.abs(+e.currentTarget.value))
			}
			{...props}
		/>
	)
}

export default OutboundQtyInputFieldControl
