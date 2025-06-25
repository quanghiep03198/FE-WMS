import { Button, Div, Tooltip, Typography } from '@/components/ui'
import { ArrowLeftIcon, ArrowRightIcon, HomeIcon } from '@radix-ui/react-icons'
import { Link, useRouter } from '@tanstack/react-router'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Heading: React.FC = () => {
	const { t } = useTranslation('ns_common')
	const router = useRouter()

	return (
		<Div className='sticky top-0 z-20 mx-auto flex w-full max-w-7xl basis-40 items-start justify-between border-b border-border bg-background/85 py-10 backdrop-blur xxl:max-w-8xl'>
			<Div className='space-y-2'>
				<Typography variant='h1' className='font-bold tracking-tight'>
					{t('ns_common:navigation.settings')}
				</Typography>
				<Typography color='muted'>{t('ns_preference:captions.header')}</Typography>
			</Div>
			<Div className='inline-flex items-center'>
				<Tooltip message={t('ns_common:actions.back')} triggerProps={{ asChild: true }}>
					<Button
						variant='ghost'
						size='icon'
						disabled={!router.history.canGoBack()}
						onClick={() => router.history.back()}>
						<ArrowLeftIcon />
					</Button>
				</Tooltip>
				<Tooltip message='Forward' triggerProps={{ asChild: true }}>
					<Button variant='ghost' size='icon' onClick={() => router.history.forward()}>
						<ArrowRightIcon />
					</Button>
				</Tooltip>
				<Tooltip message='Home' triggerProps={{ asChild: true }}>
					<Button asChild variant='ghost' size='icon' onClick={() => router.history.forward()}>
						<Link to='/dashboard'>
							<HomeIcon />
						</Link>
					</Button>
				</Tooltip>
			</Div>
		</Div>
	)
}

export default Heading
