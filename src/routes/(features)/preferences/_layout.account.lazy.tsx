import { Div, Separator } from '@components/ui'
import ChangePasswordForm from '@features/account/components/change-password-form'
import ProfileForm from '@features/account/components/profile-form'
import ProfileWallpaper from '@features/account/components/profile-wallpaper'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/(features)/preferences/_layout/account')({
	component: Page
})

function Page() {
	const { t } = useTranslation()

	return (
		<Fragment>
			<title>{t('ns_common:navigation.account')}</title>

			<Div className='flex flex-col items-stretch gap-y-10'>
				<ProfileWallpaper />
				<ProfileForm />
				<Separator />
				<ChangePasswordForm />
			</Div>
		</Fragment>
	)
}
