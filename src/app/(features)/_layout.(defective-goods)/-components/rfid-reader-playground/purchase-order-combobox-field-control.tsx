'use no memo'

import { AutoCompleteFieldControl } from '@/components/ui'
import { ComboboxFieldControlProps } from '@/components/ui/@field-control/combobox'
import { debounce, omit } from 'lodash'
import { useMemo, useState } from 'react'
import { FieldValues, useFormContext } from 'react-hook-form'
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
	const { watch } = useFormContext()
	const [searchTerm, setSearchTerm] = useState<string>(watch('po') || '')
	const { data } = useSearchPurchaseOrderQuery(searchTerm)
	const { t } = useTranslation()

	const datalist = useMemo(() => {
		return Array.isArray(data) ? data.map((item) => omit(item, ['disabled'])) : []
	}, [data])

	return (
		<AutoCompleteFieldControl
			name='po'
			label={t('ns_erp:fields.po')}
			onInput={debounce((value: string) => setSearchTerm(value), 200)}
			shouldFilter={false}
			datalist={datalist}
			labelField='po'
			valueField='po'
			{...props}
		/>
	)
}

export default PurchaseOrderComboboxFieldControl
