import useAuth from '@/common/hooks/use-auth'
import env from '@/common/utils/env'
import { isIPv4 } from '@/common/utils/ip'
import { Div, Typography } from '@/components/ui'
import { __hostRegistry } from '@/configs/host-registry.config'
import { HttpStatusCode } from 'axios'
import React from 'react'
import { useTranslation } from 'react-i18next'

const IpPolicyGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { t } = useTranslation()
	const { user } = useAuth()
	const currentHostRegistry = __hostRegistry.get(user.company_code)

	const shouldCheck = env('VITE_NODE_ENV') === 'production'
	const isNotCompatible = shouldCheck && !isIPv4(window.location.hostname)
	const movedPermanentlyURL = `http://${currentHostRegistry.ip}:${env('VITE_APP_PORT')}${window.location.pathname}`

	if (isNotCompatible)
		return (
			<Div className='flex min-h-[var(--outlet-wrapper-height)] w-full flex-1 flex-col items-center justify-center gap-y-3'>
				<Typography variant='code' color='destructive' className='font-semibold'>
					{HttpStatusCode.BadGateway}
				</Typography>
				<Typography variant='h1'>{t('ns_common:errors.502')}</Typography>
				<Typography
					variant='p'
					color='muted'
					className='mx-auto max-w-2xl text-pretty text-center'
					dangerouslySetInnerHTML={{
						__html: t('ns_common:errors.502_message', {
							url: /* html */ `<a href='${movedPermanentlyURL}' style='font-weight: 600; color:hsl(var(--active));'>URL</a>`,
							factoryCode: t(`ns_common:factory.${user.company_code}`, { defaultValue: user.company_code }),
							defaultValue: null
						})
					}}
				/>
			</Div>
		)

	return children
}

export default IpPolicyGuard
