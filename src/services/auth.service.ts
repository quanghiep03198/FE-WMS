import { IUser } from '@/common/types/entities';
import axiosInstance from '@/configs/axios.config';

export class AuthService {
	public static async login(data: any): Promise<{ user: IUser; accessToken: string }> {
		return await axiosInstance.post('/login', data);
	}

	public static async logout(): Promise<any> {
		return await axiosInstance.post('/logout');
	}

	public static async refreshToken(): Promise<string> {
		return await axiosInstance.get('/refresh-token');
	}
}
