import { useSearchCommandNumberQuery } from '@/features/order/hooks/use-order-request'
import { AutoCompleteFieldControl, type AutoCompleteFieldControlProps } from '@components/ui'
import { useDebounce } from 'ahooks'
import { capitalize } from 'lodash-es'
import React from 'react'
import type { FieldValues } from 'react-hook-form'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type CommandNumberFieldControlProps = Partial<AutoCompleteFieldControlProps<FieldValues, Record<'mo_no', string>>>

const CommandNumberFieldControl: React.FC<CommandNumberFieldControlProps> = (props) => {
	const { control } = useFormContext()
	const { t } = useTranslation()
	const value = useWatch({ control, name: 'mo_no' })
	const debouncedSearchTerm = useDebounce(value, { wait: 200 })
	const { data, isLoading } = useSearchCommandNumberQuery(debouncedSearchTerm)

	return (
		<AutoCompleteFieldControl
			name='mo_no'
			label={t('ns_erp:fields.mo_no')}
			placeholder={capitalize(
				t('ns_common:form_placeholder.fill', {
					object: t('ns_erp:fields.mo_no'),
					defaultValue: 'Search purchase command number ...'
				})
			)}
			datalist={data}
			labelField='mo_no'
			valueField='mo_no'
			shouldFilter={false}
			loading={isLoading}
			{...props}
		/>
	)
}

export default CommandNumberFieldControl
