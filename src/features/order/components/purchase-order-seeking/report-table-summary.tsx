import formatIntlNumber from '@common/utils/format-intl-number'
import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { Separator } from '@components/ui/separator'
import type { IPurchaseOrder } from '@features/order/types'
import React from 'react'
import { useTranslation } from 'react-i18next'

const ReportTableSummary: React.FC<{ data: IPurchaseOrder[] }> = ({ data }) => {
	const { t } = useTranslation()

	return (
		<Div className='flex h-10 w-full items-center justify-center gap-x-4 px-4 py-2' role='row'>
			<Typography className='font-medium' color='muted'>
				{t('ns_common:common_fields.total')}
			</Typography>
			<Separator className='h-0.5 basis-4' orientation='horizontal' />
			<Typography className='inline-flex items-baseline gap-x-1 font-medium'>
				{Array.isArray(data) ? formatIntlNumber(data?.reduce((acc, curr) => acc + curr.qty, 0)) : 0}
				<Typography as='small' variant='small'>
					prs
				</Typography>
			</Typography>
		</Div>
	)
}

export default ReportTableSummary
