import { Avatar, AvatarFallback, AvatarImage, Div, Icon, Typography } from '@components/ui'
import useAuth from '@hooks/use-auth'

const ProfileWallpaper: React.FC = () => {
	const { user } = useAuth()

	return (
		<Div className='from-secondary/50 to-secondary/25 grid grid-cols-[128px_auto] items-center gap-x-10 rounded-xl bg-linear-to-r p-4'>
			<Div className='relative row-span-full aspect-square w-full'>
				<Avatar className='inset-0 h-full w-full'>
					<AvatarImage src={user?.picture} />
					<AvatarFallback>Unknown</AvatarFallback>
				</Avatar>
				<Icon
					name='BadgeCheck'
					size={24}
					className='stroke-primary-foreground absolute right-0 bottom-1 -translate-x-1/2 fill-blue-500'
				/>
			</Div>
			<Div className='flex flex-col gap-y-1'>
				<Typography variant='h4' className='row-span-1'>
					{user?.display_name}
				</Typography>
				<Typography color='muted' className='row-span-1 block'>
					{user?.email ?? 'example@email.com'}
				</Typography>
			</Div>
		</Div>
	)
}

export default ProfileWallpaper
