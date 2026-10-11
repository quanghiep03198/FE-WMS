import { Div } from '@components/customs/div'
import { LanguageSelect } from '@components/shared/language-selector'
import { Label } from '@components/ui/label'
import { useTranslation } from 'react-i18next'

const LanguageDropdownSelect: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='space-y-2'>
			<Label htmlFor='language'>{t('ns_common:settings.language')}</Label>
			<LanguageSelect />
		</Div>
	)
}

export default LanguageDropdownSelect
