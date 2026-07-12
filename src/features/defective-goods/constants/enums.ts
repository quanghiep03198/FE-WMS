import type { ResourceKeys } from 'i18next'

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

export enum DefectiveGoodsSource {
	FINAL_INSPECTION = 'A',
	ASSEMBLY = 'B',
	REPACKING = 'C',
	OVERRUN = 'D'
}

export enum DefectiveGoodsOutboundPurpose {
	SHIPPING = 'SHIPPING',
	LAB = 'LAB',
	RUIN = 'RUIN',
	DOWNGRADE = 'B_TO_C'
}

export const TRANSLATED_DEFECTIVE_CATEGORY: Record<DefectiveCategory, ResourceKeys['ns_inoutbound']> = {
	[DefectiveCategory.B_GRADE]: 'shoes_category.b_grade',
	[DefectiveCategory.C_GRADE]: 'shoes_category.c_grade',
	[DefectiveCategory.RESEARCH_DEVELOPMENT]: 'shoes_category.research_development'
}
