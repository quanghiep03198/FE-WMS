import { useTranslation } from 'react-i18next'
import { DefectiveCategory, DefectiveCategoryI18n } from '../../../../features/defective-goods/constants'

export const useDefectiveCategoryList = () => {
	const { t } = useTranslation('ns_inoutbound')

	return [
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
	]
}
