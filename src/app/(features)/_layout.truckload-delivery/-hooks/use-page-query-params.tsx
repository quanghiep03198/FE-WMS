import useQueryParams from '@/common/hooks/use-query-params'
import { TruckloadDeliveryStatus } from '../-constants'

export const usePageQueryParams = () => {
	return useQueryParams<{ from?: Date | string; to?: Date | string; status?: TruckloadDeliveryStatus }>()
}
