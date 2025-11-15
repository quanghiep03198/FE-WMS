'use no memo'

import { InputFieldControl, InputFieldControlProps } from '@/components/ui/@field-control/input'
import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CreateDeliveryFormValues, UpdateDeliveryFormValues } from '../-schemas'

const OutboundQtyInputFieldControl: React.FC<
	InputFieldControlProps<CreateDeliveryFormValues> & { ['data-index']?: number }
> = ({ name, ...props }) => {
	const { control } = useFormContext<CreateDeliveryFormValues | UpdateDeliveryFormValues>()
	const { t } = useTranslation()
	const maxOutboundQty = useWatch({
		control,
		name:
			typeof props['data-index'] === 'number'
				? `outbound_purchase_orders.${props['data-index']}.max_outbound_qty`
				: 'max_outbound_qty'
	})

	return (
		<InputFieldControl
			name={name}
			type='number'
			placeholder={t('ns_inoutbound:placeholders.max_qty', { qty: maxOutboundQty ?? 0, defaultValue: null })}
			{...props}
		/>
	)
}

export default OutboundQtyInputFieldControl
