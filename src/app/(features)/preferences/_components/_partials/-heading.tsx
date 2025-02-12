import { Button, Div, Icon, Tooltip, Typography } from '@/components/ui'
import { Link } from '@tanstack/react-router'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Heading: React.FC = () => {
	const { t } = useTranslation('ns_common')

	return (
		<Div className='sticky top-0 z-20 mx-auto flex w-full max-w-7xl basis-40 items-start justify-between border-b border-border bg-background/85 py-10 backdrop-blur xxl:max-w-8xl'>
			<Div className='space-y-2'>
				<Typography variant='h3' className='font-bold tracking-tight'>
					{t('ns_common:navigation.settings')}
				</Typography>
				<Typography color='muted'>{t('ns_preference:captions.header')}</Typography>
			</Div>
			<Tooltip
				message={t('ns_common:navigation.dashboard')}
				triggerProps={{ asChild: true }}
				contentProps={{ side: 'left' }}>
				<Button variant='ghost' size='icon' asChild>
					<Link to='/dashboard'>
						<Icon name='ArrowRight' />
					</Link>
				</Button>
			</Tooltip>
		</Div>
	)
}

export default Heading
