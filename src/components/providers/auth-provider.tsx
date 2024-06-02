import { createContext } from 'react';
import { IUser } from '../../common/types/entities';
import { useLocalStorage } from '@/common/hooks/use-storage';

type TAuthState = {
	authenticated: boolean;
	user: IUser | null;
	accessToken: string | null;
};
type TAuthContext = {
	authenticated: boolean;
	user: IUser | null;
	accessToken: string | null;
	setAuthState: React.Dispatch<TAuthState | undefined>;
	removeAuthState: () => void;
};

const initialState: TAuthState = {
	authenticated: false,
	user: null,
	accessToken: null
};

export const AuthContext = createContext<TAuthContext>({
	...initialState,
	setAuthState: () => {},
	removeAuthState: () => {}
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [persistedAuthState, setAuthState, removeAuthState] = useLocalStorage<TAuthState>('auth', initialState);

	return <AuthContext.Provider value={{ ...persistedAuthState!, setAuthState, removeAuthState }}>{children}</AuthContext.Provider>;
};
