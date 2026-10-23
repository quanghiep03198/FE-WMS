import { SelectFieldControl, type SelectFieldControlProps } from '@components/forms/select'
import type { DefectiveGoodsCombinationFormValues } from '@features/defective-goods/schemas/defective-goods.schema'
import { useGetAssemblyLineQuery } from '@features/department/hooks/use-department-request'
import { capitalize } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const AssemblyLineFieldControl: React.FC<
	Partial<SelectFieldControlProps<DefectiveGoodsCombinationFormValues, Record<'label' | 'value', string>>>
> = (props) => {
	const { data } = useGetAssemblyLineQuery()
	const { t, i18n } = useTranslation()

	const datalist = useMemo(() => {
		if (!Array.isArray(data)) return []
		return data
			.map(({ _id, name }) => ({ label: name[i18n.language], value: _id! }))
			.sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true, alphabetic: true }))
	}, [data, i18n.language])

	return (
		<SelectFieldControl
			datalist={datalist}
			label={t('ns_erp:fields.assembly_line')}
			labelField='label'
			name='assembly_line'
			valueField='value'
			placeholder={capitalize(
				t('ns_common:form_placeholder.fill', {
					object: t('ns_erp:fields.assembly_line'),
					defaultValue: null
				})
			)}
			{...props}
		/>
	)
}

export default AssemblyLineFieldControl
