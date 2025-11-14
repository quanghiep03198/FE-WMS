'use no memo'

import { InputFieldControl, InputFieldControlProps } from '@/components/ui/@field-control/input'
import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CreateTruckloadDeliveryFormValues } from '../-schemas'

const OutboundQtyInputFieldControl: React.FC<
	InputFieldControlProps<CreateTruckloadDeliveryFormValues> & { ['data-index']: number }
> = (props) => {
	const fieldName = `outbound_purchase_orders.${props['data-index']}.outbound_qty`
	const { control } = useFormContext<CreateTruckloadDeliveryFormValues>()
	const { t } = useTranslation()
	const maxOutboundQty = useWatch({
		control,
		name: `outbound_purchase_orders.${props['data-index']}.max_outbound_qty`
	})

	return (
		<InputFieldControl
			name={fieldName}
			type='number'
			placeholder={t('ns_inoutbound:placeholders.max_qty', { qty: maxOutboundQty ?? 0, defaultValue: null })}
			{...props}
		/>
	)
}

export default OutboundQtyInputFieldControl
