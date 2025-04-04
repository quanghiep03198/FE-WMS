import { useSearchPurchaseOrderQuery } from '@/app/(features)/_apis/use-order.api'
import { AutoCompleteFieldControl } from '@/components/ui'
import { useDebounce } from 'ahooks'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const PurchaseOrderAutoComplete: React.FC = () => {
	const { t } = useTranslation()
	const { watch } = useFormContext()
	const debouncedSearchTerm = useDebounce(watch('po'), { wait: 500 })
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
