import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger
} from '@components/ui/dropdown-menu'
import { Icon } from '@components/ui/icon'
import { navigationConfig } from '@configs/navigation.config'
import useAuth from '@hooks/use-auth'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import type { FileRouteTypes } from '../../../route-tree.gen'

const NavUserControl: React.FC = () => {
	const { user, logout } = useAuth()
	const { t } = useTranslation(['ns_common', 'ns_auth'])

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='inline-flex h-full items-center justify-center ring-0 outline-none focus:border-none'>
				<Avatar className='size-8'>
					<AvatarImage alt={user?.display_name} src={user?.avatar} />
					<AvatarFallback>G</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-64' sideOffset={8}>
				<DropdownMenuLabel className='capitalize'>{user?.display_name ?? 'Unknown'}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{navigationConfig.preferences
					.filter((item) => item.url !== '/preferences/keybindings')
					.map((item) => (
						<DropdownMenuItem asChild key={item.title}>
							<Link className='whitespace-nowrap' to={item.url as FileRouteTypes['to']}>
								{item.icon && <Icon className='mr-2' name={item.icon} />}
								{t(item.title as any)}
								{item.keybinding && (
									<DropdownMenuShortcut>{item.keybinding.split('.').join('+')}</DropdownMenuShortcut>
								)}
							</Link>
						</DropdownMenuItem>
					))}

				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => logout()}>
					<Icon className='mr-2' name='LogOut' /> {t('ns_common:actions.logout')}
					<DropdownMenuShortcut>{'ctrl+q'}</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default NavUserControl
