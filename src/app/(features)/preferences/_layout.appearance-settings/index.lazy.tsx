import { Div } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageSeparator, PageTitle, PageWrapper } from '../../-components/shared/page'
import FontSelect from './-components/font-select'

import LanguageSelect from './-components/language-select'
import ThemeRadioGroup from './-components/theme-radio-group'

export const Route = createLazyFileRoute('/(features)/preferences/_layout/appearance-settings/')({
	component: Page
})

function Page() {
	const { t } = useTranslation()

	return (
		<Fragment>
			<title>{t('ns_common:navigation.settings')}</title>
			<meta name='description' content={t('ns_preference:captions.appearance')} />

			<PageWrapper className='space-y-6'>
				<PageHeader>
					<PageTitle>{t('ns_common:navigation.settings')}</PageTitle>
					<PageDescription>{t('ns_preference:captions.appearance')}</PageDescription>
				</PageHeader>
				<PageSeparator className='!block' />
				<Div className='max-w-sm space-y-8'>
					<FontSelect />
					<LanguageSelect />
					<ThemeRadioGroup />
				</Div>
			</PageWrapper>
		</Fragment>
	)
}
