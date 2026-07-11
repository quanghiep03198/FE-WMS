import { CommonActions } from '@/common/constants/enums'
import type { AutoCompleteFieldControlProps } from '@/components/forms/auto-complete'
import { AutoCompleteFieldControl } from '@/components/ui'
import type { ITruckloadDeliveryDetail } from '@/services/truckload-delivery.service'
import { useDebounce, useUpdateEffect } from 'ahooks'
import React, { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSearchDispatchPurchaseOrder } from '../-hooks/use-truckload-delivery-asm'
import type { CreateDeliveryFormValues, UpsertPurchaseOrdersFormValues } from '../-schemas'

type PurchaseOrderFieldControlProps = Partial<
	Omit<
		AutoCompleteFieldControlProps<{
			po: string
			po_qty: number
			accumulated_outbound_qty: number
			is_completed: boolean
		}>,
		'onSelect'
	>
> & {
	onValueChange?: (
		selectedItem: Pick<
			ITruckloadDeliveryDetail,
			'po' | 'brand_name' | 'factory_shoes_style' | 'color_sn' | 'max_outbound_qty'
		>
	) => any
	['data-action']: CommonActions.CREATE | CommonActions.UPDATE
	['data-index']?: number
}

const PurchaseOrderFieldControl: React.FC<PurchaseOrderFieldControlProps> = ({ name, onValueChange, ...props }) => {
	const fieldIndex: number | undefined = props['data-index']
	const fieldAction: CommonActions.CREATE | CommonActions.UPDATE = props['data-action']

	const { t } = useTranslation()
	const { control, setValue } = useFormContext<CreateDeliveryFormValues | UpsertPurchaseOrdersFormValues>()
	const currentPurchaseOrderValue = useWatch({ control, name })
	const currentOutboundQty = useWatch({ control, name: `outbound_purchase_orders.${fieldIndex}.outbound_qty` })
	const [searchTerm, setSearchTerm] = useState(typeof fieldIndex === 'number' ? (currentPurchaseOrderValue ?? '') : '')
	const debouncedSearchTerm = useDebounce(searchTerm, { wait: 500 })
	const { data: purchaseOrders, isLoading } = useSearchDispatchPurchaseOrder(debouncedSearchTerm)

	useEffect(() => {
		if (!currentPurchaseOrderValue) return

		const matchPurchaseOrder = purchaseOrders?.find?.((item) => item.po === currentPurchaseOrderValue)
		if (!matchPurchaseOrder) return

		const maxOutboundQty =
			fieldAction === CommonActions.UPDATE
				? matchPurchaseOrder.max_outbound_qty + currentOutboundQty
				: matchPurchaseOrder.max_outbound_qty

		setValue(`outbound_purchase_orders.${fieldIndex}.max_outbound_qty`, Math.max(0, maxOutboundQty))
	}, [purchaseOrders, currentPurchaseOrderValue])

	useUpdateEffect(() => {
		if (typeof onValueChange === 'function') onValueChange(purchaseOrders?.find((item) => item?.po === searchTerm))
	}, [searchTerm, purchaseOrders])

	return (
		<AutoCompleteFieldControl
			name={name}
			placeholder={t('ns_common:common_fields.quantiy_with_limit', { limit: 'PO', defaultValue: 'PO' })}
			className='!bg-transparent'
			labelField='po'
			valueField='po'
			loading={isLoading}
			datalist={purchaseOrders}
			errorMessageVariant='tooltip'
			onInput={(value) => setSearchTerm(value)}
			onSelect={(value) => {
				if (typeof onValueChange === 'function') onValueChange(purchaseOrders?.find((item) => item?.po === value))
			}}
			{...props}
		/>
	)
}

export default PurchaseOrderFieldControl
