import { AutoCompleteFieldControl } from '@components/forms/auto-complete'
import { useGetSewingProductLineQuery } from '@features/department/hooks/use-department-request'
import { capitalize } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { DefAutoCompleteFieldControlProps } from './type'

const SewingLineFieldControl: React.FC<DefAutoCompleteFieldControlProps> = (props) => {
	const { data } = useGetSewingProductLineQuery()
	const { t } = useTranslation()

	const datalist = useMemo(() => {
		if (!Array.isArray(data)) return []
		return data.map(({ name }) => ({ label: name, value: name }))
	}, [data])

	return (
		<AutoCompleteFieldControl
			datalist={datalist}
			label={t('ns_erp:fields.sewing_line')}
			labelField='label'
			name='sewing_line'
			valueField='value'
			placeholder={capitalize(
				t('ns_common:form_placeholder.fill', {
					object: t('ns_erp:fields.sewing_line'),
					defaultValue: null
				})
			)}
			{...props}
		/>
	)
}

export default SewingLineFieldControl
