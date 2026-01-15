import { AutoCompleteFieldControl, type AutoCompleteFieldControlProps } from '@/components/ui'
import { useDebounce } from 'ahooks'
import { omit } from 'lodash-es'
import { useMemo } from 'react'
import { FieldValues, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DefectiveCategory } from '../../-constants'
import { useSearchPurchaseOrderQuery } from '../../../-hooks/use-order-asm'

type PurchaseOrderFieldControlProps = Partial<
	AutoCompleteFieldControlProps<
		FieldValues,
		{
			po: string
			is_completed: boolean
		}
	>
>

const PurchaseOrderFieldControl: React.FC<PurchaseOrderFieldControlProps> = (props) => {
	const { control } = useFormContext()
	const { t } = useTranslation()
	const value = useWatch({ control, name: 'po' }) ?? ''
	const currentCategory = useWatch({ control, name: 'defective_category' })
	const debouncedSearchTerm = useDebounce(value, { wait: 200 })
	const { data, isLoading } = useSearchPurchaseOrderQuery(
		debouncedSearchTerm,
		currentCategory === DefectiveCategory.B_GRADE || currentCategory === DefectiveCategory.C_GRADE,
		false
	)

	const datalist = useMemo(() => {
		return Array.isArray(data) ? data.map((item) => omit(item, ['disabled'])) : []
	}, [data])

	return (
		<AutoCompleteFieldControl
			name='po'
			label={t('ns_erp:fields.po')}
			loading={isLoading}
			shouldFilter={false}
			datalist={datalist}
			labelField='po'
			valueField='po'
			placeholder={t('ns_common:form_placeholder.fill', {
				object: t('ns_erp:fields.po'),
				defaultValue: 'Search purchase order ...'
			})}
			{...props}
		/>
	)
}

export default PurchaseOrderFieldControl
