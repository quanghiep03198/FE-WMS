import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { v4 as uuid } from 'uuid'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../@core/hover-card'
import { Div } from './div'
import { Typography } from './typography'

type EllipsisListProps<T> = {
	threshhold: number
	data: Array<T>
	template: React.FC<{ data: T }>
}

export default function EllipsisList<T>({ threshhold, data, template: ListItemTemplate }: EllipsisListProps<T>) {
	const { t } = useTranslation()
	const visibleData = data.slice(0, threshhold)
	const truncatedData = data.slice(threshhold)

	const isTruncated = data.length > threshhold

	return (
		<Div className='space-x-1'>
			{isTruncated ? (
				<Fragment>
					{visibleData.map((item) => (
						<ListItemTemplate key={uuid()} data={item} />
					))}
					{
						<HoverCard>
							<HoverCardTrigger className='inline-flex cursor-pointer items-center gap-x-2 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline'>
								<Typography variant='small' className='whitespace-nowrap'>
									{t('ns_common:pagination.ellipsis_count', {
										count: truncatedData.length,
										defaultValue: `... and ${truncatedData.length}`
									})}
								</Typography>{' '}
							</HoverCardTrigger>
							<HoverCardContent side='bottom' align='end' className='flex flex-wrap gap-2'>
								{truncatedData.map((item) => (
									<ListItemTemplate key={uuid()} data={item} />
								))}
							</HoverCardContent>
						</HoverCard>
					}
				</Fragment>
			) : (
				data.map((item) => <ListItemTemplate key={uuid()} data={item} />)
			)}
		</Div>
	)
}
