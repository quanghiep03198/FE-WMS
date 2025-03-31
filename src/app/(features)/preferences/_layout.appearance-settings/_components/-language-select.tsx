import { Div, Label } from '@/components/ui'
import { useTranslation } from 'react-i18next'

const LanguageSelect: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='space-y-2'>
			<Label htmlFor='language'>{t('ns_common:settings.language')}</Label>
			<LanguageSelect />
		</Div>
	)
}

export default LanguageSelect
