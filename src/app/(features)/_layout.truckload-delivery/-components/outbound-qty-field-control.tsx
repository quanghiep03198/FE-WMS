'use no memo'

import { CommonActions } from '@/common/constants/enums'
import { InputFieldControl, InputFieldControlProps } from '@/components/ui/@field-control/input'
import React, { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CreateDeliveryFormValues, UpdateDeliveryFormValues } from '../-schemas'

const OutboundQtyInputFieldControl: React.FC<
	InputFieldControlProps<CreateDeliveryFormValues> & {
		['data-action']: CommonActions.CREATE | CommonActions.UPDATE
		['data-index']?: number
	}
> = ({ name, ...props }) => {
	const { watch } = useFormContext<CreateDeliveryFormValues | UpdateDeliveryFormValues>()
	const { t } = useTranslation()

	const currentOutboundQty = watch(name)

	const currentPurchaseOrder = watch(
		typeof props['data-index'] === 'number' ? `outbound_purchase_orders.${props['data-index']}.po` : 'po'
	)

	const actualMaxOutboundQty = useMemo(() => {
		const currentMaxOutboundQty = watch('max_outbound_qty')
		if (!currentMaxOutboundQty) return 0
		if (props['data-action'] === CommonActions.UPDATE) return currentMaxOutboundQty + (currentOutboundQty ?? 0)
		return currentMaxOutboundQty
	}, [currentPurchaseOrder, currentOutboundQty])

	return (
		<InputFieldControl
			name={name}
			type='number'
			placeholder={t('ns_inoutbound:placeholders.max_qty', { qty: actualMaxOutboundQty, defaultValue: null })}
			{...props}
		/>
	)
}

export default OutboundQtyInputFieldControl
