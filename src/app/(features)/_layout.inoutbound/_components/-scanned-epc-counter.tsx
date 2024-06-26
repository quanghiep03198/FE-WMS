import { Typography } from '@/components/ui'
import Skeleton from '@/components/ui/@custom/skeleton'
import React, { Fragment, memo, useContext, useMemo } from 'react'
import { useCountUp } from 'react-countup'
import { useTranslation } from 'react-i18next'
import { PageContext } from '../_context/-page-context'

const ScannedEPCsCounter: React.FC = () => {
	const { data, scanningStatus } = useContext(PageContext)
	const { t } = useTranslation()

	const count = useMemo(() => data?.length ?? 0, [data])

	useCountUp({
		ref: 'counter',
		duration: 1,
		end: count,
		useEasing: false,
		formattingFn(value) {
			return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(value)
		}
	})

	return (
		<Fragment>
			{scanningStatus === 'scanning' && <Skeleton className='absolute inset-0 z-0 h-full' />}
			<Typography variant='h6' className='relative z-10'>
				{t('ns_inoutbound:counter_box.label')}
			</Typography>
			<Typography id='counter' variant='h2' className='relative z-10'>
				{count}
			</Typography>
			<Typography variant='small' className='relative z-10 text-xs xl:text-sm' color='muted'>
				{t('ns_inoutbound:counter_box.caption', { value: 5, defaultValue: null })}
			</Typography>
		</Fragment>
	)
}

export default memo(ScannedEPCsCounter)
