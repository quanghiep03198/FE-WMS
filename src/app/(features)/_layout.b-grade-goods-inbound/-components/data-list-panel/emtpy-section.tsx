import { cn } from '@/common/utils/cn'
import { Div, Typography } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

const EmptySection: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='h-full place-content-center place-items-center'>
			<Div className='flex flex-col items-center justify-center gap-y-2'>
				<Div className='relative grid h-28 w-full place-content-center place-items-center'>
					<PlaceholderItem className='absolute top-0 z-20' />
					<PlaceholderItem className='absolute top-6 z-10 scale-[85%] opacity-80' />
					<PlaceholderItem className='absolute top-12 z-0 scale-[70%] opacity-60' />
				</Div>
				<Typography>{t('ns_common:table.no_data')}</Typography>
				<Typography variant='small' color='muted' className='text-pretty text-center'>
					{t('ns_inoutbound:description.empty_defect_item_caption')}
				</Typography>
			</Div>
		</Div>
	)
}

const PlaceholderItem: React.FC<React.ComponentProps<'div'>> = ({ className, ...props }) => {
	return (
		<Div
			className={cn(
				'flex w-full max-w-48 items-center gap-x-4 rounded-md border bg-background p-2 shadow-md',
				className
			)}
			{...props}>
			<Div className='aspect-square size-8 rounded bg-accent' />
			<Div className='flex-1 space-y-2'>
				<Div className='aspect-square h-3 w-full rounded bg-accent' />
				<Div className='aspect-square h-3 w-2/3 rounded bg-accent' />
			</Div>
		</Div>
	)
}

export default EmptySection
