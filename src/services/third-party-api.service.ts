import { RequestHeaders } from '@/common/constants/enums'
import axiosInstance from '@/configs/axios.config'

export class ThirdPartyApiService {
	static async syncDeckerData(tenantId: string, factoryCode: string) {
		return await axiosInstance.put(
			`/third-party-api/sync-decker-data`,
			{},
			{
				headers: {
					[RequestHeaders.TENANT_ID]: tenantId,
					[RequestHeaders.USER_COMPANY]: factoryCode
				}
			}
		)
	}
}
