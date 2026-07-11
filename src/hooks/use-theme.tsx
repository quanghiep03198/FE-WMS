import { ThemeProviderContext } from '@/providers/theme-provider'
import { use } from 'react'

export default function useTheme() {
	return use(ThemeProviderContext)
}
