import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { Icon } from '@components/ui/icon'
import useAuth from '@hooks/use-auth'

const ProfileWallpaper: React.FC = () => {
	const { user } = useAuth()

	return (
		<Div className='from-secondary/50 to-secondary/25 grid grid-cols-[128px_auto] items-center gap-x-10 rounded-xl bg-linear-to-r p-4'>
			<Div className='relative row-span-full aspect-square w-full'>
				<Avatar className='inset-0 h-full w-full'>
					<AvatarImage src={user?.avatar} />
					<AvatarFallback>Unknown</AvatarFallback>
				</Avatar>
				<Icon
					className='stroke-primary-foreground absolute right-0 bottom-1 -translate-x-1/2 fill-blue-500'
					name='BadgeCheck'
					size={24}
				/>
			</Div>
			<Div className='flex flex-col gap-y-1'>
				<Typography className='row-span-1' variant='h4'>
					{user?.display_name}
				</Typography>
				<Typography className='row-span-1 block' color='muted'>
					{user?.email ?? 'example@email.com'}
				</Typography>
			</Div>
		</Div>
	)
}

export default ProfileWallpaper
