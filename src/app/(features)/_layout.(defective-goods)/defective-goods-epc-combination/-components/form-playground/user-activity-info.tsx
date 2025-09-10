import { useDateLocale } from '@/common/hooks/use-date-locale'
import generateAvatar from '@/common/utils/generate-avatar'
import { Avatar, AvatarImage, Div, Icon, Typography } from '@/components/ui'
import { format, formatRelative } from 'date-fns'
import { useTranslation } from 'react-i18next'

type UserActivityInfoProps = { createdBy: string; createdAt: string; lastUpdatedAt: string }

const UserActivityInfo: React.FC<UserActivityInfoProps> = ({ createdBy, createdAt, lastUpdatedAt }) => {
	const { t } = useTranslation()
	const dateLocale = useDateLocale()

	return (
		<Div className='flex items-center gap-x-2 border-b p-6'>
			<Avatar>
				<AvatarImage
					src={generateAvatar({
						name: createdBy
					})}
				/>
			</Avatar>
			<Div className='flex flex-col space-y-1'>
				<Typography variant='small' className='font-medium'>
					{createdBy}
				</Typography>
				<Typography variant='small' color='muted' className='first-letter:uppercase'>
					{format(new Date(createdAt), 'MMM dd, YYY - hh:mm:ss ', {
						locale: dateLocale
					})}
				</Typography>
			</Div>
			{lastUpdatedAt && (
				<Typography variant='small' color='muted' className='ml-auto inline-flex items-center gap-x-2 self-start'>
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
	)
}

export default UserActivityInfo
