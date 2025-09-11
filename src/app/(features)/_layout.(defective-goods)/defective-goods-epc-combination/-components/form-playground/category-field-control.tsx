import { SelectFieldControl } from '@/components/ui'
import { SelectFieldControlProps } from '@/components/ui/@field-control/select'
import { omit } from 'lodash'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DefectiveGoodsCombinationFormValues } from '../../-schemas/defective-goods.schema'
import { DefectiveCategory, DefectiveCategoryI18n } from '../../../-constants'

type CategoryFieldControlProps = Partial<
	SelectFieldControlProps<DefectiveGoodsCombinationFormValues, Record<'label' | 'value', string>>
>

const CategoryFieldControl: React.FC<CategoryFieldControlProps> = ({ disabled, ...props }) => {
	const { t } = useTranslation()
	const { reset, getValues } = useFormContext<DefectiveGoodsCombinationFormValues>()

	return (
		<SelectFieldControl
			{...props}
			name='category'
			label={t('ns_erp:fields.category')}
			datalist={[
				{
					label: t(DefectiveCategoryI18n['B'], {
						ns: 'ns_inoutbound',
						defaultValue: DefectiveCategory.B_GRADE
					}),
					value: DefectiveCategory.B_GRADE
				},
				{
					label: t(DefectiveCategoryI18n['C'], {
						ns: 'ns_inoutbound',
						defaultValue: DefectiveCategory.C_GRADE
					}),
					value: DefectiveCategory.C_GRADE
				},
				{
					label: t(DefectiveCategoryI18n['RD'], {
						ns: 'ns_inoutbound',
						defaultValue: DefectiveCategory.RESEARCH_DEVELOPMENT
					}),
					value: DefectiveCategory.RESEARCH_DEVELOPMENT
				}
			]}
			disabled={disabled}
			onValueChange={(value) => {
				if (value === DefectiveCategory.RESEARCH_DEVELOPMENT) {
					reset(omit(getValues(), ['po', 'mo_no']))
				}
			}}
			labelField='label'
			valueField='value'
		/>
	)
}

export default CategoryFieldControl
