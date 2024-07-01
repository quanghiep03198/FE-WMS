import { Theme } from '@/common/constants/enums'
import { useLocalStorageState } from 'ahooks'
import { SetState } from 'ahooks/lib/createUseStorageState'
import _ from 'lodash'
import React, { createContext, useEffect } from 'react'

type ThemeProviderProps = {
	children: React.ReactNode
}

type ThemeProviderState = {
	theme: Theme
	setTheme: (value?: SetState<Theme>) => void
}

const ThemeProviderContext = createContext<ThemeProviderState>({
	theme: Theme.SYSTEM,
	setTheme: () => undefined
})

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, ...props }: ThemeProviderProps) => {
	const [theme, setTheme] = useLocalStorageState<Theme>('theme', { defaultValue: Theme.SYSTEM })

	useEffect(() => {
		const root = window.document.documentElement
		root.classList.remove('light', 'dark')
		if (theme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
			root.classList.add(systemTheme)
			return
		}
		root.classList.add(theme as Theme)
	}, [theme])

	return (
		<ThemeProviderContext.Provider
			{...props}
			value={{
				theme: theme as Theme,
				setTheme
			}}>
			{children}
		</ThemeProviderContext.Provider>
	)
}

export { ThemeProvider, ThemeProviderContext }
