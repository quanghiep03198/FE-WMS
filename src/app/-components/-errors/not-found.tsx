import { Button, Div, Icon, Typography } from '@/components/ui'
import { useRouter } from '@tanstack/react-router'
import { HttpStatusCode } from 'axios'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
	const { t } = useTranslation()
	const router = useRouter()

	return (
		<Div className='min-h-screen place-content-center px-6 py-24 sm:py-32 xl:px-8'>
			<Div className='text-center'>
				<Typography variant='code' color='destructive' className='font-semibold'>
					{HttpStatusCode.NotFound}
				</Typography>
				<Typography variant='h1' className='mt-4'>
					{t('ns_common:errors.404')}
				</Typography>
				<Typography variant='p' className='mb-6 mt-2 text-base leading-7' color='muted'>
					{t('ns_common:errors.404_message')}
				</Typography>
				<Button onClick={() => router.history.back()}>
					{t('ns_common:actions.back')} <Icon name='ArrowRight' />
				</Button>
			</Div>
		</Div>
	)
}
