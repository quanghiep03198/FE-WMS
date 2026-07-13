import { Avatar, AvatarImage, Div, Icon, Typography } from '@/components/ui'
import generateAvatar from '@common/utils/generate-avatar'
import { useDateLocale } from '@hooks/use-date-locale'
import { format, formatRelative, isValid } from 'date-fns'
import { ErrorBoundary } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'

type UserActivityInfoProps = { createdBy: string; createdAt: Date | string; lastUpdatedAt: Date | string | null }

const UserActivityInfo: React.FC<UserActivityInfoProps> = ({ createdBy, createdAt, lastUpdatedAt }) => {
	const { t } = useTranslation()
	const dateLocale = useDateLocale()

	return (
		<ErrorBoundary fallbackRender={() => <Typography color='destructive'>Error</Typography>}>
			<Div className='flex h-[var(--bar-height)] items-center gap-x-2 border-b px-6 py-2'>
				<Avatar className='size-9'>
					<AvatarImage src={generateAvatar({ name: createdBy })} />
				</Avatar>
				<Div className='flex flex-col space-y-0.5'>
					<Typography variant='small' className='font-medium'>
						@{createdBy}
					</Typography>
					<Typography variant='small' color='muted' className='text-xs first-letter:uppercase'>
						{format(new Date(createdAt), 'MMM dd, YYY - hh:mm:ss ', {
							locale: dateLocale
						})}
					</Typography>
				</Div>

				{isValid(lastUpdatedAt) && (
					<Typography
						variant='small'
						color='muted'
						className='ml-auto inline-flex items-center gap-x-2 self-start'>
						<Icon name='FileCog' size={18} />

						{t('ns_common:timestamps.last_updated', {
							timestamp: formatRelative(new Date(lastUpdatedAt), new Date(), {
								locale: dateLocale
							}),
							defaultValue: null
						})}
					</Typography>
				)}
			</Div>
		</ErrorBoundary>
	)
}

export default UserActivityInfo
