import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import ChangePasswordForm from './_components/-change-password-form'
import ProfileForm from './_components/-profile-form'
import ProfileWallpaper from './_components/-profile-wallpaper'

export const Route = createLazyFileRoute('/(features)/preferences/_layout/account/')({
	component: Page
})

function Page() {
	const { t } = useTranslation()

	return (
		<Fragment>
			<head>
				<title>{t('ns_common:navigation.account')}</title>
			</head>
			<Div className='flex flex-col items-stretch gap-y-10'>
				<ProfileWallpaper />
				<ProfileForm />
				<Separator />
				<ChangePasswordForm />
			</Div>
		</Fragment>
	)
}
