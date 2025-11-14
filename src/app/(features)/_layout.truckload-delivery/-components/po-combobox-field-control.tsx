'use no memo'

import { useSearchPurchaseOrderQuery } from '@/app/(features)/-hooks/use-order-asm'
import { ComboboxFieldControl } from '@/components/ui'
import { ComboboxFieldControlProps } from '@/components/ui/@field-control/combobox'
import { useDebounce } from 'ahooks'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CreateTruckloadDeliveryFormValues } from '../-schemas'

type PoComboboxFieldControlProps = Partial<
	ComboboxFieldControlProps<{
		po: string
		po_qty: number
		accumulated_outbound_qty: number
		is_completed: boolean
	}>
> & { ['data-index']: number }

const PoComboboxFieldControl: React.FC<PoComboboxFieldControlProps> = ({ name, ...props }) => {
	const { t } = useTranslation()
	const { setValue } = useFormContext<CreateTruckloadDeliveryFormValues>()
	const [searchTerm, setSearchTerm] = useState('')
	const debouncedSearchTerm = useDebounce(searchTerm, { wait: 500 })
	const { data: purchaseOrders, isLoading } = useSearchPurchaseOrderQuery(debouncedSearchTerm)

	return (
		<ComboboxFieldControl
			name={name}
			shouldFilter={false}
			placeholder={t('ns_common:form_placeholder.fill', { object: 'PO', defaultValue: 'PO' })}
			labelField='po'
			valueField='po'
			loading={isLoading}
			datalist={purchaseOrders}
			onInput={setSearchTerm}
			onSelect={(value) => {
				const matchPurchaseOrder = purchaseOrders.find((item) => item.po === value)
				if (matchPurchaseOrder)
					setValue(
						`outbound_purchase_orders.${props['data-index']}.max_outbound_qty`,
						matchPurchaseOrder.po_qty - matchPurchaseOrder.accumulated_outbound_qty
					)
			}}
			{...props}
		/>
	)
}

export default PoComboboxFieldControl
