import { ResourceKeys } from 'i18next'

export enum DefectiveType {
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

export const DefectiveCategoryI18n: Record<DefectiveType, ResourceKeys['ns_inoutbound']> = {
	[DefectiveType.B_GRADE]: 'shoes_category.b_grade',
	[DefectiveType.C_GRADE]: 'shoes_category.c_grade',
	[DefectiveType.RESEARCH_DEVELOPMENT]: 'shoes_category.research_development'
}
