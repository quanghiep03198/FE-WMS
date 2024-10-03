import { locales } from '@/common/constants/constants'
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

import { useTranslation } from 'react-i18next'

export const LanguageSelect: React.FC = () => {
	const { i18n } = useTranslation()

	return (
		<Select onValueChange={(value) => i18n.changeLanguage(value)} value={i18n.language}>
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
			<Tooltip message={t('ns_common:settings.language')} triggerProps={{ asChild: true }}>
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
