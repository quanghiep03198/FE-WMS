import { Theme } from '@/common/constants/enums'
import useTheme from '@/common/hooks/use-theme'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'

const ThemeDropdownSelect: React.FC = () => {
	const { theme, setTheme } = useTheme()

	return (
		<Select value={theme} defaultValue={theme} onValueChange={(value) => setTheme(value as Theme)}>
			<SelectTrigger>
				<SelectValue placeholder='Select theme' />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={Theme.LIGHT}>Light</SelectItem>
				<SelectItem value={Theme.DARK}>Dark</SelectItem>
				<SelectItem value={Theme.SYSTEM}>System</SelectItem>
			</SelectContent>
		</Select>
	)
}

export default ThemeDropdownSelect
