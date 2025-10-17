import useAuth from '@/common/hooks/use-auth'
import env from '@/common/utils/env'
import { Div, Typography } from '@/components/ui'
import { __hostRegistry } from '@/configs/host-registry.config'
import React from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

const HostCompatibleGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { t } = useTranslation()
	const { user } = useAuth()
	const currentHostRegistry = __hostRegistry.get(user.company_code)
	const movedPermanentlyURL = `${window.location.protocol}//${currentHostRegistry}/${window.location.pathname}`

	const isNotCompatible =
		(window.location.hostname !== currentHostRegistry.domain ||
			window.location.hostname !== currentHostRegistry.ip) &&
		env('VITE_NODE_ENV') === 'production'

	if (isNotCompatible)
		return (
			<Div className='flex min-h-[var(--outlet-wrapper-height)] w-full flex-1 flex-col items-center justify-center gap-y-3'>
				<Typography variant='code' color='destructive' className='font-semibold'>
					303
				</Typography>
				<Typography variant='h1'>{t('ns_common:errors.303')}</Typography>
				<Typography
					variant='p'
					color='muted'
					dangerouslySetInnerHTML={{
						__html: t('ns_common:errors.303_message', {
							url: /* html */ `<a href='${movedPermanentlyURL}' style='font-weight: 600; color:hsl(var(--active));'>URL</a>`,
							factoryCode: t(`ns_common:factory.${user.company_code}`, { defaultValue: user.company_code }),
							defaultValue: null
						})
					}}
				/>
				<Image src='/onboarding.svg' />
			</Div>
		)

	return children
}

const Image = tw.img`max-w-md object-center object-contain w-full select-none mt-6`

export default HostCompatibleGuard
