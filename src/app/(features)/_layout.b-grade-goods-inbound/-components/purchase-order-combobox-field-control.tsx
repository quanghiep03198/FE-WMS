import { ComboboxFieldControl } from '@/components/ui'
import { debounce } from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchPurchaseOrderQuery } from '../../-hooks/use-order-asm'

const PurchaseOrderComboboxFieldControl: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState<string>('')
	const { data } = useSearchPurchaseOrderQuery(searchTerm)
	const { t } = useTranslation()

	return (
		<ComboboxFieldControl
			name='po'
			label={t('ns_erp:fields.po')}
			onInput={debounce((value: string) => setSearchTerm(value), 200)}
			shouldFilter={false}
			datalist={data}
			labelField='po'
			valueField='po'
		/>
	)
}

export default PurchaseOrderComboboxFieldControl
