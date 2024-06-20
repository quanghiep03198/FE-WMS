import { CommonActions } from '@/common/constants/enums'
import { IWarehouse } from '@/common/types/entities'
import { PartialWarehouseFormValue, WarehouseFormValue } from '@/schemas/warehouse.schema'
import { WarehouseService } from '@/services/warehouse.service'
import { UseMutationOptions, keepPreviousData, queryOptions } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export const warehouseQuery = (searchParams: Record<string, any>) =>
	queryOptions({
		queryKey: ['warehouses', searchParams],
		queryFn: () => WarehouseService.getWarehouseList(searchParams),
		select: (data) => data.metadata,
		placeholderData: keepPreviousData
	})
