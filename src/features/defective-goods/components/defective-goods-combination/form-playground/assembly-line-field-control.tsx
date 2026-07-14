import { AutoCompleteFieldControl } from '@/components/ui'
import { useGetShapingProductLineQuery } from '@features/department/hooks/use-department-request'
import { capitalize } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { DefAutoCompleteFieldControlProps } from './type'

const AssemblyLineFieldControl: React.FC<DefAutoCompleteFieldControlProps> = (props) => {
	const { data } = useGetShapingProductLineQuery()
	const { t } = useTranslation()

	const datalist = useMemo(() => {
		if (!Array.isArray(data)) return []
		return data.map(({ dept_name }) => ({ label: dept_name, value: dept_name }))
	}, [data])

	return (
		<AutoCompleteFieldControl
			name='assembly_line'
			label={t('ns_erp:fields.assembly_line')}
			placeholder={capitalize(
				t('ns_common:form_placeholder.fill', {
					object: t('ns_erp:fields.assembly_line'),
					defaultValue: null
				})
			)}
			datalist={datalist}
			labelField='label'
			valueField='value'
			{...props}
		/>
	)
}

export default AssemblyLineFieldControl
