import { useSearchPurchaseOrderQuery } from '@/app/(features)/_apis/use-order.api'
import { AutoCompleteFieldControl } from '@/components/ui'
import { useDebounce } from 'ahooks'
import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const PurchaseOrderAutoComplete: React.FC = () => {
	const { t } = useTranslation()
	const { control } = useFormContext()
	const value = useWatch({ control, name: 'po' })
	const debouncedSearchTerm = useDebounce(value, { wait: 500 })
	const { data: purchaseOrders } = useSearchPurchaseOrderQuery(debouncedSearchTerm)

	return (
		<AutoCompleteFieldControl
			label={t('ns_erp:fields.po')}
			name='po'
			datalist={purchaseOrders}
			labelField='po'
			valueField='po'
		/>
	)
}

export default PurchaseOrderAutoComplete
