import axiosInstance from '@/configs/axios.config'

export class OtpService {
	static async createOtp(payload: { employee_code: string }) {
		return await axiosInstance.put<unknown, ResponseBody<Record<'otp', string>>, { employee_code: string }>(
			'/otp/create-employee-otp',
			payload
		)
	}
}
