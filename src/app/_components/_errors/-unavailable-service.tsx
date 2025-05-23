import { Div, Typography } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

const UnavailableService: React.FC = () => {
	const { t } = useTranslation('ns_common')

	return (
		<Div className='flex h-[var(--outlet-wrapper-height)] w-full flex-1 flex-col items-center justify-evenly gap-2 md:justify-center md:gap-10 lg:flex-row xl:flex-row xl:gap-0'>
			<Div className='flex flex-col gap-2 md:items-center'>
				<Typography variant='code' color='destructive' className='mb-3 text-xl font-bold'>
					503
				</Typography>
				<Typography variant='h1'>{t('ns_common:errors.503')}</Typography>
				<Typography variant='p' color='muted' className='w-full xl:max-w-md xxl:max-w-full'>
					{t('ns_common:errors.503_message')}
				</Typography>
			</Div>
			<Image src='/not-implemented.svg' />
		</Div>
	)
}

const Image = tw.img`xxl:max-w-4xl xl:max-w-2xl max-w-lg object-center object-contain w-full select-none`

export default UnavailableService
