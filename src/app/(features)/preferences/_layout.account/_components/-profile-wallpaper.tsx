import { useAuth } from '@/common/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage, Div, Icon, Typography } from '@/components/ui'

type Props = {}

const ProfileWallpaper = (props: Props) => {
	const { user } = useAuth()

	return (
		<Div className='grid grid-cols-[128px_auto] items-center gap-x-10 rounded-xl bg-gradient-to-r from-secondary/50 to-secondary/25 p-4'>
			<Div className='relative row-span-full aspect-square w-full'>
				<Avatar className='inset-0 h-full w-full'>
					<AvatarImage src={user.picture} />
					<AvatarFallback>Unknown</AvatarFallback>
				</Avatar>
				<Icon
					name='BadgeCheck'
					size={24}
					className='absolute bottom-1 right-0 -translate-x-1/2 fill-blue-500 stroke-primary-foreground'
				/>
			</Div>
			<Div className='flex flex-col gap-y-1'>
				<Typography variant='h5' className='row-span-1'>
					{user.display_name}
				</Typography>
				<Typography color='muted' className='row-span-1 block'>
					{user.email ?? 'example@email.com'}
				</Typography>
			</Div>
		</Div>
	)
}

export default ProfileWallpaper
