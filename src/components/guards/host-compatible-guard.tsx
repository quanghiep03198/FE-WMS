import type { FactoryCode } from '@common/constants/enums'
import env from '@common/utils/env'
import { isIPv4 } from '@common/utils/ip'
import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { __hostRegistry } from '@configs/host-registry.config'
import { HttpStatusCode } from 'axios'
import React from 'react'
import { useTranslation } from 'react-i18next'

/**
 * @deprecated This guard is no longer necessary as host compatibility is handled elsewhere.
 * @param param0
 * @returns
 */
const HostCompatibleGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { t } = useTranslation()
	const currentHostRegistry = __hostRegistry.get(env<FactoryCode>('VITE_APP_TENANT'))!

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
				<Typography className='font-semibold' color='destructive' variant='code'>
					{HttpStatusCode.SeeOther}
				</Typography>
				<Typography variant='h1'>{t('ns_common:errors.303')}</Typography>
				<Typography
					color='muted'
					variant='p'
					dangerouslySetInnerHTML={{
						__html: t('ns_common:errors.303_message', {
							url: /* html */ `<a href='${movedPermanentlyURL}' style='font-weight: 600; color: var(--active);'>URL</a>`,
							factoryCode: t(`ns_common:factory.${env<FactoryCode>('VITE_APP_TENANT')}`, {
								defaultValue: env<FactoryCode>('VITE_APP_TENANT')
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
