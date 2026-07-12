import { Div, Separator, Typography } from '@/components/ui'
import { __hostRegistry } from '@/configs/host-registry.config'
import useAuth from '@/hooks/use-auth'
import env from '@common/utils/env'
import { isIPv4 } from '@common/utils/ip'
import { HttpStatusCode } from 'axios'
import React from 'react'
import { useTranslation } from 'react-i18next'

const IpPolicyGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { t } = useTranslation()
	const { user } = useAuth()
	const currentHostRegistry = __hostRegistry.get(user?.current_factory_code)

	const shouldCheck = env('VITE_NODE_ENV') === 'production'
	const isNotCompatible = shouldCheck && !isIPv4(window.location.hostname)
	const movedPermanentlyURL = `http://${currentHostRegistry.ip}:${env('VITE_APP_PORT')}${window.location.pathname}`

	if (isNotCompatible)
		return (
			<Div className='grid min-h-[var(--outlet-wrapper-height)] w-full place-items-center gap-y-3'>
				<Div>
					<Div className='flex items-center gap-x-4'>
						<Typography color='destructive' className='font-semibold'>
							{HttpStatusCode.BadGateway}
						</Typography>
						<Separator orientation='vertical' className='h-5 w-0.5' />
						<Typography variant='h4'>{t('ns_common:errors.502')}</Typography>
					</Div>
					<Typography
						variant='p'
						className='mb-6 mt-2 max-w-3xl text-pretty text-base leading-7'
						color='muted'
						dangerouslySetInnerHTML={{
							__html: t('ns_common:errors.502_message', {
								url: /* html */ `<a href='${movedPermanentlyURL}' style='font-weight: 600; color:hsl(var(--active));'>URL</a>`,
								factoryCode: t(`ns_common:factory.${user?.current_factory_code}`, {
									defaultValue: user?.current_factory_code
								}),
								defaultValue: null
							})
						}}
					/>
				</Div>
			</Div>
		)

	return children
}

export default IpPolicyGuard
