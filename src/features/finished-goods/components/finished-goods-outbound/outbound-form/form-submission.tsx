import { cn } from '@common/utils/cn'
import { Div } from '@components/customs/div'
import { Button } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
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
			<Button disabled={isPending} size='lg' type='submit'>
				<Icon className={cn(isPending && 'animate-spin')} name={isPending ? 'LoaderCircle' : 'Check'} />
				{isError ? t('ns_common:actions.retry') : t('ns_common:actions.submit')}
			</Button>
			<Button disabled={isPending} size='lg' type='button' variant='outline' onClick={() => reset()}>
				<Icon name='Undo' />
				{t('ns_common:actions.reset')}
			</Button>
		</Div>
	)
}

export default FormSubmission
