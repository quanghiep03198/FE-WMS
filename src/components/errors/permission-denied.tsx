import React from 'react'

import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { Separator } from '@components/ui/separator'
import { HttpStatusCode } from 'axios'
import { useTranslation } from 'react-i18next'

const PermissionDenied: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='grid min-h-(--outlet-wrapper-height) w-full place-items-center gap-y-3'>
			<Div>
				<Div className='flex items-center gap-x-4'>
					<Typography className='font-semibold' color='destructive'>
						{HttpStatusCode.Forbidden}
					</Typography>
					<Separator className='h-5 w-0.5' orientation='vertical' />
					<Typography variant='h4'>{t('ns_common:errors.403')}</Typography>
				</Div>
				<Typography className='mt-2 mb-6 text-base leading-7' color='muted' variant='p'>
					{t('ns_common:errors.403_message')}
				</Typography>
			</Div>
		</Div>
	)
}

export default PermissionDenied
