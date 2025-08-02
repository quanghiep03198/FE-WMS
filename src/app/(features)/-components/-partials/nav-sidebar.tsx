import { useGetUserCompany } from '@/app/(auth)/-hooks/use-department-asm'
import AppLogo from '@/app/-components/-shared/app-logo'
import useAuth from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import {
	Button,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon,
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
	useSidebar
} from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { navigationConfig, type NavigationConfig } from '@/configs/navigation.config'
import { FileRouteTypes } from '@/route-tree.gen'
import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useUpdateEffect } from 'ahooks'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type NavLinkProps = Pick<NavigationConfig, 'path' | 'title' | 'icon'> & { viewTransition?: boolean }

const NavSidebar: React.FC = () => {
	const { t } = useTranslation()

	const mainMenu = useMemo(() => {
		return navigationConfig.filter((item) => item.type === 'main')
	}, [])

	const preferenceMenu = useMemo(() => {
		return navigationConfig.filter((item) => {
			const matches: Array<FileRouteTypes['to']> = ['/preferences/keybindings', '/preferences/appearance-settings']
			return item.type === 'preference' && matches.includes(item.path)
		})
	}, [])

	return (
		<Sidebar variant='sidebar' side='left' collapsible='icon'>
			<SidebarHeader className='overflow-hidden'>
				<Link to='/dashboard' preload='intent' className='max-w-full'>
					<AppLogo />
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>{t('ns_common:navigation.main_menu_label')}</SidebarGroupLabel>
					<ScrollShadow className='max-h-80 overflow-y-auto overflow-x-hidden !scrollbar-none xxl:max-h-96'>
						<SidebarMenu role='menu' aria-label='Main menu'>
							{mainMenu.map((item) => (
								<SidebarMenuLink key={item.id} {...item} />
							))}
						</SidebarMenu>
					</ScrollShadow>
				</SidebarGroup>
				<SidebarSeparator />
				<SidebarGroup>
					<SidebarGroupLabel>{t('ns_common:navigation.preference_menu_label')}</SidebarGroupLabel>
					<SidebarMenu role='menu' aria-label='Preferences menu'>
						{preferenceMenu.map((item) => (
							<SidebarMenuLink key={item.id} {...item} />
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SwitchUserCompany />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}

const SidebarMenuLink: React.FC<NavLinkProps> = ({ path, title, icon, viewTransition }) => {
	const { t } = useTranslation('ns_common')
	const isSmallScreen = useMediaQuery('(min-width: 320px) and (max-width: 1365px)')
	const { openMobile, setOpenMobile } = useSidebar()

	return (
		<SidebarMenuItem
			role='menuitem'
			onClick={() => {
				if (isSmallScreen) setOpenMobile(!openMobile)
			}}>
			<SidebarMenuButton asChild size='default' tooltip={t(title, { defaultValue: title })}>
				<Link
					to={path}
					preload='intent'
					viewTransition={viewTransition}
					activeProps={{
						className: 'text-primary hover:text-primary bg-primary/10'
					}}>
					<Icon className='!size-5' name={icon} size={20} strokeWidth={2} />
					<span className='font-medium'>{t(title, { defaultValue: title })}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}

const SwitchUserCompany: React.FC = () => {
	const { user, setUserCompany } = useAuth()
	const { data } = useGetUserCompany()
	const { t } = useTranslation()
	const { open } = useSidebar()
	const queryClient = useQueryClient()

	useUpdateEffect(() => {
		queryClient.invalidateQueries({ type: 'all', refetchType: 'all' })
	}, [user?.company_code])

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					size={open ? 'default' : 'icon'}
					className={cn(open ? 'justify-start' : 'size-8')}>
					<Icon name='Factory' />
					{open && (
						<Fragment>
							{user?.company_name}
							<Icon name='ChevronsUpDown' className='ml-auto' />
						</Fragment>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className='w-[var(--radix-dropdown-menu-trigger-width)] min-w-60'
				side={open ? 'top' : 'right'}
				align='end'>
				<DropdownMenuLabel>{t('ns_company:company')}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{Array.isArray(data) &&
					data.map((item) => (
						<DropdownMenuCheckboxItem
							key={item.company_code}
							checked={user.company_code === item.company_code}
							onCheckedChange={() => setUserCompany(item)}>
							{item.company_name}
						</DropdownMenuCheckboxItem>
					))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default NavSidebar
