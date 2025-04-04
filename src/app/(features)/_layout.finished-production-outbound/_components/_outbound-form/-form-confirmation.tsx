import { Checkbox, Div, Icon, Label, Separator, Typography } from '@/components/ui'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'

type FormConfirmationProps = {
	isConfirmed: boolean
	onConfirm: (value: boolean) => void
}

const FormConfirmation: React.FC<FormConfirmationProps> = ({ isConfirmed, onConfirm }) => {
	const checkboxId = useId()
	const { t } = useTranslation()

	return (
		<Div className='col-span-full space-y-3'>
			<Div className='space-y-1.5 leading-none'>
				<Typography className='inline-flex items-center gap-x-2 font-semibold text-warning'>
					<Icon name='TriangleAlert' /> {t('ns_common:titles.caution')}
				</Typography>
				<Typography variant='small'>{t('ns_inoutbound:notification.stock_out_submission_caution')}</Typography>
			</Div>
			<Separator />
			<Div className='inline-flex items-center gap-x-2'>
				<Checkbox id={checkboxId} checked={isConfirmed} onCheckedChange={(value) => onConfirm(Boolean(value))} />
				<Label htmlFor={checkboxId}>{t('ns_common:confirmation.understand_and_proceed')}</Label>
			</Div>
		</Div>
	)
}

export default FormConfirmation
