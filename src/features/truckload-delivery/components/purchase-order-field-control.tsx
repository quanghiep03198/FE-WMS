'use no memo'

import { CommonActions } from '@common/constants/enums'
import { type AutoCompleteFieldControlProps, AutoCompleteFieldControl } from '@components/forms/auto-complete'

import { useDebounce } from 'ahooks'
import React, { memo, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSearchDispatchPurchaseOrder } from '../hooks/use-truckload-delivery-request'
import type { CreateDeliveryFormValues, UpsertPurchaseOrdersFormValues } from '../schemas'
import type { ITruckloadDeliveryPacking } from '../types'

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
		selectedItem:
			| Pick<
					ITruckloadDeliveryPacking,
					'po' | 'brand_name' | 'factory_shoes_style' | 'color_sn' | 'max_outbound_qty'
			  >
			| undefined
	) => any
	['data-action']: CommonActions.CREATE | CommonActions.UPDATE
	['data-index']: number
}

const PurchaseOrderFieldControl: React.FC<PurchaseOrderFieldControlProps> = ({ name, onValueChange, ...props }) => {
	const fieldIndex: number = props['data-index']
	const fieldAction: CommonActions.CREATE | CommonActions.UPDATE = props['data-action']

	const { t } = useTranslation()
	const { control, setValue } = useFormContext<CreateDeliveryFormValues | UpsertPurchaseOrdersFormValues>()
	const currentPurchaseOrderValue = useWatch({ control, name })
	const currentOutboundQty = useWatch({ control, name: `outbound_purchase_orders.${fieldIndex}.outbound_qty` }) ?? 0
	const [searchTerm, setSearchTerm] = useState(typeof fieldIndex === 'number' ? (currentPurchaseOrderValue ?? '') : '')
	const debouncedSearchTerm = useDebounce(searchTerm, { wait: 500 })
	const { data: purchaseOrders, isLoading } = useSearchDispatchPurchaseOrder(debouncedSearchTerm)

	useEffect(() => {
		if (!Array.isArray(purchaseOrders) || purchaseOrders.length === 0) return
		const matchPurchaseOrder = purchaseOrders.find((item) => item.po === currentPurchaseOrderValue)
		if (!matchPurchaseOrder) return

		const maxOutboundQty = matchPurchaseOrder.max_outbound_qty
		const discardedQty = fieldAction === CommonActions.UPDATE ? currentOutboundQty : 0
		const nextMaxOutboundQty = typeof maxOutboundQty === 'number' ? maxOutboundQty + discardedQty : 0
		setValue(`outbound_purchase_orders.${fieldIndex}.max_outbound_qty`, nextMaxOutboundQty, {
			shouldValidate: true
		})
	}, [purchaseOrders, currentOutboundQty, currentPurchaseOrderValue, fieldIndex, fieldAction])

	useEffect(() => {
		const purchaseOrder = purchaseOrders.find((item) => item?.po === searchTerm)
		if (typeof onValueChange === 'function') onValueChange(purchaseOrder!)
	}, [searchTerm, purchaseOrders])

	return (
		<AutoCompleteFieldControl
			className='bg-transparent!'
			datalist={purchaseOrders!}
			errorMessageVariant='tooltip'
			labelField='po'
			loading={isLoading}
			name={name}
			placeholder={t('ns_common:common_fields.quantiy_with_limit', { limit: 'PO', defaultValue: 'PO' })}
			valueField='po'
			onInput={(value) => setSearchTerm(value)}
			onSelect={(value) => {
				const purchaseOrder = purchaseOrders.find((item) => item?.po === value)
				if (typeof onValueChange === 'function') onValueChange(purchaseOrder)
			}}
			{...props}
		/>
	)
}

export default memo(PurchaseOrderFieldControl)
