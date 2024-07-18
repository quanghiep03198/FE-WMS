import { useAuth } from '@/common/hooks/use-auth'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
	Icon
} from '@/components/ui'
import { navigationConfig } from '@/configs/navigation.config'
import { Link } from '@tanstack/react-router'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

const NavUserControl: React.FC = () => {
	const { user, logout } = useAuth()
	const { t } = useTranslation(['ns_common', 'ns_auth'])

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='inline-flex h-full items-center justify-center outline-none ring-0 focus:border-none'>
				<Avatar className='size-8'>
					<AvatarImage src={user?.picture} alt={user?.display_name} />
					<AvatarFallback>G</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' sideOffset={8} className='w-64'>
				<DropdownMenuLabel className='capitalize'>{user?.display_name ?? 'Unknown'}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{navigationConfig
					.filter((item) => item.type === 'preference' && item.path !== '/keybindings')
					.map((item) => (
						<DropdownMenuItem asChild key={item.id}>
							<Link to={item.path} className='whitespace-nowrap'>
								<Icon name={item.icon} className='mr-2' /> {t(item.title as any)}
								<DropdownMenuShortcut>{(item.keybinding as string).split('.').join('+')}</DropdownMenuShortcut>
							</Link>
						</DropdownMenuItem>
					))}

				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => logout()}>
					<Icon name='LogOut' className='mr-2' /> {t('ns_common:actions.logout')}
					<DropdownMenuShortcut>{'ctrl+q'}</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default memo(NavUserControl)
