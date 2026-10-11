import { LOCALES } from '@common/constants/constants'
import { Tooltip } from '@components/customs/tooltip'
import type { ButtonProps } from '@components/ui/button'
import { Button } from '@components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@components/ui/dropdown-menu'
import { Icon } from '@components/ui/icon'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select'

import { useTranslation } from 'react-i18next'

export const LanguageSelect: React.FC = () => {
	const { i18n } = useTranslation()

	return (
		<Select value={i18n.language} onValueChange={(value) => i18n.changeLanguage(value)}>
			<SelectTrigger aria-label='Languages' className='bg-background' id='language'>
				<SelectValue placeholder='Choose language' />
			</SelectTrigger>
			<SelectContent>
				{LOCALES.map((item) => (
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
					<Button {...triggerProps} aria-label='Languages' size='icon' type='button'>
						<Icon name='Languages' />
					</Button>
				</DropdownMenuTrigger>
			</Tooltip>
			<DropdownMenuContent align='end' className='w-48'>
				<DropdownMenuLabel>Languages</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup value={i18n.language} onValueChange={(value) => i18n.changeLanguage(value)}>
					{LOCALES.map((item) => (
						<DropdownMenuRadioItem key={item.value} value={item.value}>
							{item.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
