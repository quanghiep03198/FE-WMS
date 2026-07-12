import type { ChartConfig } from '@/components/ui'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DefectiveCategory, TRANSLATED_DEFECTIVE_CATEGORY } from '../../../../features/defective-goods/constants/enums'

export const useDefectiveCategoryChartConfig = () => {
	const { t, i18n } = useTranslation()

	return useMemo(
		() => ({
			[DefectiveCategory.B_GRADE]: {
				label: t(TRANSLATED_DEFECTIVE_CATEGORY[DefectiveCategory.B_GRADE], {
					ns: 'ns_inoutbound',
					defaultValue: DefectiveCategory.B_GRADE
				}),
				color: 'hsl(var(--chart-1))'
			},
			[DefectiveCategory.C_GRADE]: {
				label: t(TRANSLATED_DEFECTIVE_CATEGORY[DefectiveCategory.C_GRADE], {
					ns: 'ns_inoutbound',
					defaultValue: DefectiveCategory.C_GRADE
				}),
				color: 'hsl(var(--chart-2))'
			},
			[DefectiveCategory.RESEARCH_DEVELOPMENT]: {
				label: t(TRANSLATED_DEFECTIVE_CATEGORY[DefectiveCategory.RESEARCH_DEVELOPMENT], {
					ns: 'ns_inoutbound',
					defaultValue: DefectiveCategory.RESEARCH_DEVELOPMENT
				}),
				color: 'hsl(var(--chart-3))'
			}
		}),
		[i18n.language]
	) satisfies ChartConfig
}
