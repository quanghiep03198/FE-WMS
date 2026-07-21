import { Div, Separator, Typography } from '@/components/ui'
import { HttpStatusCode } from 'axios'
import React from 'react'
import { useTranslation } from 'react-i18next'

const UnavailableService: React.FC = () => {
	const { t } = useTranslation('ns_common')

	return (
		<Div className='grid min-h-(--outlet-wrapper-height) w-full place-items-center gap-y-3'>
			<Div>
				<Div className='flex items-center gap-x-4'>
					<Typography color='destructive' className='font-semibold'>
						{HttpStatusCode.ServiceUnavailable}
					</Typography>
					<Separator orientation='vertical' className='h-5 w-0.5' />
					<Typography variant='h4'>{t('ns_common:errors.503')}</Typography>
				</Div>
				<Typography variant='p' className='mt-2 mb-6 text-base leading-7' color='muted'>
					{t('ns_common:errors.503_message')}
				</Typography>
			</Div>
		</Div>
	)
}

export default UnavailableService
