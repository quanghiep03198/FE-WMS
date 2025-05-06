import { Div, Typography } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

const UnavailableService: React.FC = () => {
	const { t } = useTranslation('ns_common')

	return (
		<Div className='flex h-[var(--outlet-wrapper-height)] w-full flex-1 flex-col items-center justify-center gap-2'>
			<Typography variant='code' color='destructive' className='mb-3 text-xl font-bold'>
				503
			</Typography>
			<Typography variant='h3'>{t('ns_common:errors.503')}</Typography>
			<Typography variant='p' color='muted' className='mb-4'>
				{t('ns_common:errors.503_message')}
			</Typography>
			<Image src='/onboarding.svg' />
		</Div>
	)
}

const Image = tw.img`max-w-md object-center object-contain w-full select-none`

export default UnavailableService
