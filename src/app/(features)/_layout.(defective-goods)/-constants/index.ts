import { ResourceKeys } from 'i18next'

export enum DefectiveCategory {
	B_GRADE = 'B',
	C_GRADE = 'C',
	RESEARCH_DEVELOPMENT = 'RD'
}

export enum DefectiveLocation {
	ALL = 'A',
	UPPER = 'B',
	BOTTOM = 'C',
	OTHER = 'D'
}

export const DefectiveCategoryI18n: Record<DefectiveCategory, ResourceKeys['ns_inoutbound']> = {
	[DefectiveCategory.B_GRADE]: 'shoes_category.b_grade',
	[DefectiveCategory.C_GRADE]: 'shoes_category.c_grade',
	[DefectiveCategory.RESEARCH_DEVELOPMENT]: 'shoes_category.research_development'
}

export enum ReaderAntenna {
	ANT_1 = '1',
	ANT_2 = '2',
	ANT_3 = '4',
	ANT_4 = '8'
}
