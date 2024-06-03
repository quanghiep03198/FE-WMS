import { IUser } from '@/common/types/entities';
import axiosInstance from '@/configs/axios.config';
import { LoginFormValues } from '@/schemas/auth.schema';

export class AuthService {
	public static async login(data: any) {
		return await axiosInstance.post<LoginFormValues, { user: IUser; accessToken: string }>('/login', data);
	}

	public static async logout() {
		return await axiosInstance.post('/logout');
	}

	public static async refreshToken() {
		return await axiosInstance.get<void, string>('/refresh-token');
	}
}
