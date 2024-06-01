import { Theme } from '@/common/constants/enums';
import { useLocalStorage } from '@/common/hooks/use-storage';
import _ from 'lodash';
import React, { createContext, useEffect } from 'react';

declare type ThemeProviderProps = {
	children: React.ReactNode;
};

declare type ThemeProviderState = {
	theme: Theme;
	setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};

const initialState: ThemeProviderState = {
	theme: Theme.SYSTEM,
	setTheme: function () {}
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

const defaultTheme = (() => {
	const currentTheme = localStorage.getItem('theme');
	return !_.isNil(currentTheme) ? JSON.parse(currentTheme) : Theme.SYSTEM;
})();

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, ...props }: ThemeProviderProps) => {
	const [theme, setTheme] = useLocalStorage<Theme>('theme', defaultTheme);

	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove('light', 'dark');
		if (theme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			root.classList.add(systemTheme);
			return;
		}
		root.classList.add(theme as Theme);
	}, [theme]);

	return (
		<ThemeProviderContext.Provider
			{...props}
			value={
				{
					theme: theme,
					setTheme
				} as ThemeProviderState
			}>
			{children}
		</ThemeProviderContext.Provider>
	);
};

export { ThemeProvider, ThemeProviderContext };
