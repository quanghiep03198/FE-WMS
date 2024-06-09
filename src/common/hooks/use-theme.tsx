import { ThemeProviderContext } from '@/components/providers/theme-provider'
import { useContext } from 'react'

export default function useTheme() {
	return useContext(ThemeProviderContext)
}
