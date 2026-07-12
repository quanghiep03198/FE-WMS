import { useTranslation } from 'react-i18next'
import { DefectiveCategory, TRANSLATED_DEFECTIVE_CATEGORY } from '../constants/enums'

export const useDefectiveCategoryList = () => {
	const { t } = useTranslation('ns_inoutbound')

	return [
		{
			label: t(TRANSLATED_DEFECTIVE_CATEGORY['B'], {
				ns: 'ns_inoutbound',
				defaultValue: DefectiveCategory.B_GRADE
			}),
			value: DefectiveCategory.B_GRADE
		},
		{
			label: t(TRANSLATED_DEFECTIVE_CATEGORY['C'], {
				ns: 'ns_inoutbound',
				defaultValue: DefectiveCategory.C_GRADE
			}),
			value: DefectiveCategory.C_GRADE
		},
		{
			label: t(TRANSLATED_DEFECTIVE_CATEGORY['RD'], {
				ns: 'ns_inoutbound',
				defaultValue: DefectiveCategory.RESEARCH_DEVELOPMENT
			}),
			value: DefectiveCategory.RESEARCH_DEVELOPMENT
		}
	]
}
