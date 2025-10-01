import { Div, Separator, Typography } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

const ReportTableSummary: React.FC<{ total: number }> = ({ total }) => {
	const { t } = useTranslation()

	return (
		<Div role='row' className='flex w-full items-center justify-center gap-x-4 px-4 py-2'>
			<Typography color='muted' className='font-medium'>
				{t('ns_common:common_fields.total')}
			</Typography>
			<Separator orientation='horizontal' className='h-0.5 basis-4' />
			<Typography className='inline-flex items-baseline gap-x-1 font-medium'>
				{total}
				<Typography as='small' variant='small'>
					prs
				</Typography>
			</Typography>
		</Div>
	)
}

export default ReportTableSummary
