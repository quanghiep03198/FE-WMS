import type { InputFieldControlProps } from '@/components/forms/input'
import { InputFieldControl } from '@/components/forms/input'
import { CommonActions } from '@common/constants/enums'
import React, { useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { CreateDeliveryFormValues } from '../-schemas'

const OutboundQtyInputFieldControl: React.FC<
	InputFieldControlProps<CreateDeliveryFormValues> & {
		['data-action']: CommonActions.CREATE | CommonActions.UPDATE
		['data-index']?: number
	}
> = ({ name, ...props }) => {
	const { control, setValue } = useFormContext<CreateDeliveryFormValues>()
	const { t } = useTranslation()

	const currentOutboundQty = useWatch({ name, control })
	const currentMaxOutboundQty = useWatch({
		control,
		name: `outbound_purchase_orders.${props['data-index']}.max_outbound_qty`
	})

	const currentPurchaseOrder = useWatch({
		control,
		name: `outbound_purchase_orders.${props['data-index']}.po`
	})

	const actualMaxOutboundQty = useMemo(() => {
		if (!currentMaxOutboundQty && typeof currentMaxOutboundQty !== 'number') return Infinity
		if (props['data-action'] === CommonActions.UPDATE) return currentMaxOutboundQty + (currentOutboundQty ?? 0)
		return currentMaxOutboundQty
	}, [currentPurchaseOrder, currentOutboundQty, currentMaxOutboundQty])

	return (
		<InputFieldControl
			name={name}
			type='number'
			inputMode='numeric'
			min={1}
			// max={actualMaxOutboundQty === Infinity ? undefined : actualMaxOutboundQty}
			step={1}
			errorMessageVariant='tooltip'
			onChange={(e) =>
				setValue(`outbound_purchase_orders.${props['data-index']}.outbound_qty`, Math.abs(+e.currentTarget.value))
			}
			placeholder={
				actualMaxOutboundQty === Infinity
					? 'Unlimited (∞)'
					: t('ns_inoutbound:placeholders.max_qty', { qty: actualMaxOutboundQty, defaultValue: null })
			}
			{...props}
		/>
	)
}

export default OutboundQtyInputFieldControl
