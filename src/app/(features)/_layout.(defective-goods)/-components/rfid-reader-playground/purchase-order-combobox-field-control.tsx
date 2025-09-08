import { ComboboxFieldControl } from '@/components/ui'
import { ComboboxFieldControlProps } from '@/components/ui/@field-control/combobox'
import { debounce } from 'lodash'
import { useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSearchPurchaseOrderQuery } from '../../../-hooks/use-order-asm'

type PurchaseOrderComboboxFieldControlProps = Pick<
	ComboboxFieldControlProps<
		FieldValues,
		{
			po: string
			is_completed: boolean
		}
	>,
	'disabled'
>

const PurchaseOrderComboboxFieldControl: React.FC<PurchaseOrderComboboxFieldControlProps> = (props) => {
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
			{...props}
		/>
	)
}

export default PurchaseOrderComboboxFieldControl
