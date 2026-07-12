import type { SelectFieldControlProps } from '@/components/forms/select'
import { SelectFieldControl } from '@/components/ui'
import { omit } from 'lodash-es'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DefectiveCategory } from '../../../constants/enums'
import { useDefectiveCategoryList } from '../../../hooks/use-defective-category-list'
import type { DefectiveGoodsCombinationFormValues } from '../../../schemas/defective-goods.schema'

type CategoryFieldControlProps = Partial<
	SelectFieldControlProps<DefectiveGoodsCombinationFormValues, Record<'label' | 'value', string>>
>

const CategoryFieldControl: React.FC<CategoryFieldControlProps> = ({ disabled, ...props }) => {
	const { t } = useTranslation()
	const { reset, getValues } = useFormContext<DefectiveGoodsCombinationFormValues>()
	const defectiveCategoryList = useDefectiveCategoryList()

	return (
		<SelectFieldControl
			{...props}
			name='defective_category'
			label={t('ns_erp:fields.category')}
			datalist={defectiveCategoryList}
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
