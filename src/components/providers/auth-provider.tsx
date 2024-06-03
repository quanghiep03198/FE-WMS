import React, { createContext } from 'react';
import { IUser } from '../../common/types/entities';
import { useLocalStorage } from '@/common/hooks/use-storage';

export type TAuthState = {
	authenticated: boolean;
	user: IUser | null;
	company_code: string | null;
	department_code: string | null;
	accessToken: string | null;
};
type TAuthContext = {
	authenticated: boolean;
	user: IUser | null;
	company_code: string | null;
	department_code: string | null;
	accessToken: string | null;
	setAuthState: React.Dispatch<React.SetStateAction<TAuthState | undefined>>;
	removeAuthState: () => void;
};

const initialState: TAuthState = {
	authenticated: false,
	user: null,
	company_code: null,
	department_code: null,
	accessToken: null
};

export const AuthContext = createContext<TAuthContext>({
	...initialState,
	setAuthState: () => undefined,
	removeAuthState: () => undefined
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [persistedAuthState, setAuthState, removeAuthState] = useLocalStorage<TAuthState>('auth', initialState);

	return (
		<AuthContext.Provider value={{ ...persistedAuthState!, setAuthState, removeAuthState }}>
			{children}
		</AuthContext.Provider>
	);
};
