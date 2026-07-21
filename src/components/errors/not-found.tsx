import { Button, Div, Icon, Separator, Typography } from '@/components/ui'
import { useRouter } from '@tanstack/react-router'
import { HttpStatusCode } from 'axios'
import { useTranslation } from 'react-i18next'

export default function NotFoundPage() {
	const { t } = useTranslation()
	const router = useRouter()

	return (
		<Div className='grid min-h-screen place-items-center px-6 py-24 sm:py-32 xl:px-8'>
			<Div>
				<Div className='flex items-center gap-x-4'>
					<Typography color='destructive' className='font-semibold'>
						{HttpStatusCode.NotFound}
					</Typography>
					<Separator orientation='vertical' className='h-5 w-0.5' />
					<Typography variant='h4'> {t('ns_common:errors.404')}</Typography>
				</Div>
				<Typography variant='p' className='mt-2 mb-6 text-base leading-7' color='muted'>
					{t('ns_common:errors.404_message')}
				</Typography>
				<Button variant='link' onClick={() => router.history.back()} className='p-0'>
					<Icon name='ArrowLeft' />
					{t('ns_common:actions.back')}
				</Button>
			</Div>
		</Div>
	)
}
