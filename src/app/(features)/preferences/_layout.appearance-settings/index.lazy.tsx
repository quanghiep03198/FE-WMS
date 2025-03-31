import { LanguageSelect } from '@/app/_components/_shared/-language-selector'
import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../../_components/_shared/-page-header'
import FontSelect from './_components/-font-select'
import ThemeRadioGroup from './_components/-theme-radio-group'

export const Route = createLazyFileRoute('/(features)/preferences/_layout/appearance-settings/')({
	component: Page
})

function Page() {
	const { t } = useTranslation()

	return (
		<Div className='space-y-6'>
			<PageHeader>
				<PageTitle>{t('ns_common:navigation.settings')}</PageTitle>
				<PageDescription>{t('ns_preference:captions.appearance')}</PageDescription>
			</PageHeader>
			<Separator />

			<Div className='max-w-sm space-y-8'>
				<FontSelect />
				<LanguageSelect />
				<ThemeRadioGroup />
			</Div>
		</Div>
	)
}
