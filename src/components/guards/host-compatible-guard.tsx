import { Div, Typography } from '@/components/ui'
import { __hostRegistry } from '@/configs/host-registry.config'
import env from '@common/utils/env'
import { isIPv4 } from '@common/utils/ip'
import useAuth from '@hooks/use-auth'
import { HttpStatusCode } from 'axios'

import React from 'react'
import { useTranslation } from 'react-i18next'

const HostCompatibleGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { t } = useTranslation()
	const { user } = useAuth()
	const currentHostRegistry = __hostRegistry.get(user?.current_factory_code)

	const shouldCheck = env('VITE_NODE_ENV') === 'production'

	const isNotCompatible =
		shouldCheck &&
		(isIPv4(window.location.hostname)
			? window.location.hostname !== currentHostRegistry.ip
			: window.location.hostname !== currentHostRegistry.domain)

	const movedPermanentlyURL = isIPv4(window.location.hostname)
		? `${window.location.protocol}//${currentHostRegistry.ip}:${window.location.port}${window.location.pathname}`
		: `${window.location.protocol}//${currentHostRegistry.domain}${window.location.pathname}`

	if (isNotCompatible)
		return (
			<Div className='flex min-h-(--outlet-wrapper-height) w-full flex-1 flex-col items-center justify-center gap-y-3'>
				<Typography variant='code' color='destructive' className='font-semibold'>
					{HttpStatusCode.SeeOther}
				</Typography>
				<Typography variant='h1'>{t('ns_common:errors.303')}</Typography>
				<Typography
					variant='p'
					color='muted'
					dangerouslySetInnerHTML={{
						__html: t('ns_common:errors.303_message', {
							url: /* html */ `<a href='${movedPermanentlyURL}' style='font-weight: 600; color: var(--active);'>URL</a>`,
							factoryCode: t(`ns_common:factory.${user?.current_factory_code}`, {
								defaultValue: user?.current_factory_code
							}),
							defaultValue: null
						})
					}}
				/>
			</Div>
		)

	return children
}

export default HostCompatibleGuard
