import generateAvatar from '@common/utils/generate-avatar'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { buttonVariants } from '@components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@components/ui/hover-card'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemSeparator, ItemTitle } from '@components/ui/item'
import type { IUser } from '@features/auth/types'
import { format } from 'date-fns'
import { t } from 'i18next'

const UserHoverCard: React.FC<{ user: IUser }> = ({ user }) => {
	return (
		<HoverCard>
			<HoverCardTrigger className={buttonVariants({ variant: 'link', className: 'p-0! h-fit!' })}>
				{user.display_name}
			</HoverCardTrigger>
			<HoverCardContent align='start' className='w-fit p-0'>
				<Item size='sm'>
					<ItemMedia>
						<Avatar className='size-8'>
							<AvatarImage src={generateAvatar({ name: user.display_name })} />
							<AvatarFallback>{user.display_name.charAt(0).toUpperCase()}</AvatarFallback>
						</Avatar>
					</ItemMedia>
					<ItemContent>
						<ItemTitle className='before:content-["@"] gap-0'>{user.username}</ItemTitle>
						<ItemDescription className='text-foreground text-xs'>
							{t(`ns_auth:roles.${user.roles[0]}`)}
						</ItemDescription>
						{user.created_at && (
							<>
								<ItemSeparator />
								<ItemDescription className='whitespace-nowrap'>
									{t('ns_auth:fields.joined_system_date')}: {format(user.created_at!, 'yyyy-MM-dd')}
								</ItemDescription>{' '}
							</>
						)}
					</ItemContent>
				</Item>
			</HoverCardContent>
		</HoverCard>
	)
}

UserHoverCard.displayName = 'UserHoverCard'

export default UserHoverCard
