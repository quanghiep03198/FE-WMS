'use no memo'

import { CommonActions } from '@/common/constants/enums'
import { AutoCompleteFieldControl } from '@/components/ui'
import { AutoCompleteFieldControlProps } from '@/components/ui/@field-control/auto-complete'
import { IPurchaseOrderResult } from '@/services/order.service'
import { useDebounce, useUpdateEffect } from 'ahooks'
import React, { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useGetTruckloadDeliveryQuery, useSearchDispatchPurchaseOrder } from '../-hooks/use-truckload-delivery-asm'
import { CreateDeliveryFormValues, UpsertPurchaseOrdersFormValues } from '../-schemas'

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
	onValueChange?: (selectedItem: IPurchaseOrderResult) => any
	['data-action']: CommonActions.CREATE | CommonActions.UPDATE
	['data-index']?: number
}

const PurchaseOrderFieldControl: React.FC<PurchaseOrderFieldControlProps> = ({ name, onValueChange, ...props }) => {
	const fieldIndex: number | undefined = props['data-index']
	const fieldAction: CommonActions.CREATE | CommonActions.UPDATE = props['data-action']

	const { t } = useTranslation()
	const { control, getValues, setValue } = useFormContext<CreateDeliveryFormValues | UpsertPurchaseOrdersFormValues>()
	const { data } = useGetTruckloadDeliveryQuery()
	const currentPurchaseOrderValue = useWatch({ control, name })
	const [searchTerm, setSearchTerm] = useState(typeof fieldIndex === 'number' ? (currentPurchaseOrderValue ?? '') : '')
	const debouncedSearchTerm = useDebounce(searchTerm, { wait: 500 })
	const { data: purchaseOrders, isLoading } = useSearchDispatchPurchaseOrder(debouncedSearchTerm)
	const currentId = getValues(`outbound_purchase_orders.${fieldIndex}.id`)

	useEffect(() => {
		if (!currentPurchaseOrderValue) return

		const matchPurchaseOrder = purchaseOrders?.find?.((item) => item.po === currentPurchaseOrderValue)
		if (!matchPurchaseOrder) return

		matchPurchaseOrder.max_outbound_qty ??= 0

		setValue(
			`outbound_purchase_orders.${fieldIndex}.max_outbound_qty`,
			Math.max(0, matchPurchaseOrder.max_outbound_qty)
		)
	}, [purchaseOrders, currentPurchaseOrderValue])

	useUpdateEffect(() => {
		if (typeof onValueChange === 'function') onValueChange(purchaseOrders?.find((item) => item?.po === searchTerm))
	}, [searchTerm, purchaseOrders])

	return (
		<AutoCompleteFieldControl
			name={name}
			placeholder={t('ns_common:form_placeholder.fill', { object: 'PO', defaultValue: 'PO' })}
			className='!bg-transparent'
			labelField='po'
			valueField='po'
			loading={isLoading}
			datalist={purchaseOrders}
			errorMessageVariant='tooltip'
			onInput={(value) => {
				setSearchTerm(value)
			}}
			onSelect={(value) => {
				if (typeof onValueChange === 'function') onValueChange(purchaseOrders?.find((item) => item?.po === value))
			}}
			{...props}
		/>
	)
}

export default PurchaseOrderFieldControl
