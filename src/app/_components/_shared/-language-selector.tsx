import {
	Button,
	ButtonProps,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Tooltip
} from '@/components/ui'
import { locales } from '@/i18n'
import { useLocalStorageState } from 'ahooks'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

function useTranslate() {
	const { i18n } = useTranslation()
	const [i18nextLng, setI18nextLng] = useLocalStorageState('i18nextLng', { defaultValue: i18n.language })

	useEffect(() => setI18nextLng(i18n.language), [i18n.language])

	return {
		i18n,
		i18nextLng
	}
}

export const LanguageSelect: React.FC = () => {
	const { i18n, i18nextLng } = useTranslate()

	return (
		<Select onValueChange={(value) => i18n.changeLanguage(value)} defaultValue={i18nextLng}>
			<SelectTrigger>
				<SelectValue placeholder='Choose language' />
			</SelectTrigger>
			<SelectContent>
				{locales.map((item) => (
					<SelectItem key={item.value} value={item.value}>
						{item.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

export const LanguageDropdown: React.FC<{ triggerProps?: ButtonProps }> = ({ triggerProps = { variant: 'ghost' } }) => {
	const { t, i18n } = useTranslation()

	return (
		<DropdownMenu>
			<Tooltip content={t('ns_common:language')}>
				<DropdownMenuTrigger asChild>
					<Button {...triggerProps} size='icon' type='button'>
						<Icon name='Languages' />
					</Button>
				</DropdownMenuTrigger>
			</Tooltip>
			<DropdownMenuContent className='w-48' align='end'>
				<DropdownMenuLabel>Languages</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup value={i18n.language} onValueChange={(value) => i18n.changeLanguage(value)}>
					{locales.map((item) => (
						<DropdownMenuRadioItem value={item.value} key={item.value}>
							{item.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
