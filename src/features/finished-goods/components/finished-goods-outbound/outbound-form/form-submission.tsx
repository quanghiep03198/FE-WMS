import { Button, Div, Icon } from '@/components/ui'
import { cn } from '@common/utils/cn'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type FormSubmissionProps = {
	isPending: boolean
	isError: boolean
}

const FormSubmission: React.FC<FormSubmissionProps> = ({ isPending, isError }) => {
	const { t } = useTranslation()
	const { reset } = useFormContext()

	return (
		<Div className='grid grid-cols-2 gap-x-2'>
			<Button type='submit' size='lg' disabled={isPending}>
				<Icon name={isPending ? 'LoaderCircle' : 'Check'} className={cn(isPending && 'animate-spin')} />
				{isError ? t('ns_common:actions.retry') : t('ns_common:actions.submit')}
			</Button>
			<Button variant='outline' type='button' size='lg' disabled={isPending} onClick={() => reset()}>
				<Icon name='Undo' />
				{t('ns_common:actions.reset')}
			</Button>
		</Div>
	)
}

export default FormSubmission
