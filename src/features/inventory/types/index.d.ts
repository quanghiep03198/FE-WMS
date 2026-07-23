import type { IMonthlyInventoryAudit } from '@common/types/entities'

export declare type BaseUpdateUpdateQuery = Pick<
	IMonthlyInventoryAudit,
	'actual_po' | 'mo_no' | 'factory_shoes_style' | 'cust_shoes_style' | 'inv_type' | 'inv_year_month'
> & { size_numcode: string }
