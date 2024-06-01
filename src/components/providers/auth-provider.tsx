import { createContext } from 'react';
import { IUser } from '../../common/types/entities';
import { useLocalStorage } from '@/common/hooks/use-storage';

type TAuthState = {
	authenticated: boolean;
	user: IUser | null;
	accessToken: string | null;
};
type TAuthContext = {
	persistedAuthState: TAuthState | undefined;
	setAuthState: React.Dispatch<TAuthState | undefined>;
	removeAuthState: () => void;
};

const initialState: TAuthState = {
	authenticated: true,
	user: null,
	accessToken: null
};

const AuthContext = createContext<TAuthContext>({
	persistedAuthState: initialState,
	setAuthState: () => {},
	removeAuthState: () => {}
});

export default function AuthProvider(props: React.PropsWithChildren) {
	const [persistedAuthState, setAuthState, removeAuthState] = useLocalStorage<TAuthState>('auth', initialState);

	return <AuthContext.Provider value={{ persistedAuthState, setAuthState, removeAuthState }}>{props.children}</AuthContext.Provider>;
}
