import { navigationConfig, type NavigationConfig } from '@/app/(features)/-configs/navigation.config'
import AppLogo from '@/app/-components/-shared/app-logo'
import { UserRole } from '@/common/constants/enums'
import useAuth from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import {
	Button,
	Collapsible,
	CollapsibleContent,
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
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
	SidebarSeparator,
	useSidebar
} from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useRouterState } from '@tanstack/react-router'
import { useUpdateEffect } from 'ahooks'
import { Fragment, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { v4 as uuid } from 'uuid'

type NavLinkProps = Pick<NavigationConfig, 'url' | 'title' | 'icon' | 'authorizedRoles'> & {
	indice: `${number}` | `${number}.${number}` | 'none'
	viewTransition?: boolean
}

const NavSidebar: React.FC = () => {
	const { user } = useAuth()
	const { t } = useTranslation('ns_common')
	const isMobile = useMediaQuery('(min-width: 320px) and (max-width: 1365px)')
	const { setOpen } = useSidebar()

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
					<ScrollShadow
						className={cn(
							'overflow-y-auto overflow-x-hidden !scrollbar-none',
							user.roles.includes(UserRole.ADMIN) ? 'max-h-[35vh] xxl:max-h-[45vh]' : 'max-h-[55vh]'
						)}>
						<SidebarMenu role='menu' aria-label='Main menu'>
							{navigationConfig.main.map((item, index) => {
								if (!Array.isArray(item.items))
									return <SidebarMenuLink indice={`${index + 1}`} key={index.toString()} {...item} />
								return (
									<Collapsible key={uuid()} defaultOpen={true} className='group/collapsible w-full'>
										<CollapsibleTrigger asChild={true}>
											<SidebarMenuButton
												tooltip={t(item.title, { ns: 'ns_common', defaultValue: item.title })}
												size='sm'
												className='w-full font-medium'
												aria-disabled={item.items.every(
													(subItem) =>
														subItem.authorizedRoles !== '*' &&
														!user.roles.some((role) => subItem.authorizedRoles.includes(role))
												)}
												onClick={() => {
													if (isMobile) return
													setOpen(true)
												}}>
												{item.icon && (
													<Icon name={item.icon} size={18} className='!size-[18px]' strokeWidth={2} />
												)}
												<SidebarMenuTitle data-indice={index + 1}>
													{t(item.title, { ns: 'ns_common', defaultValue: item.title })}
												</SidebarMenuTitle>
												<Icon
													name='ChevronRight'
													className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90'
												/>
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent className='w-full overflow-auto transition-none !scrollbar-none data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
											<SidebarMenuSub>
												{item.items?.map((subItem, subIndex) => (
													<SidebarMenuSubLink
														indice={`${index + 1}.${subIndex + 1}`}
														key={`${index + 1}.${subIndex + 1}`}
														{...subItem}
													/>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</Collapsible>
								)
							})}
						</SidebarMenu>
					</ScrollShadow>
				</SidebarGroup>
				{user.roles.includes(UserRole.ADMIN) && (
					<Fragment>
						<SidebarSeparator />
						<SidebarGroup>
							<SidebarGroupLabel>
								{t('ns_common:navigation.administration', { defaultValue: 'Administration' })}
							</SidebarGroupLabel>
							<SidebarMenu role='menu' aria-label='Administration'>
								{navigationConfig.administration.map((item) => {
									return <SidebarMenuLink indice='none' key={uuid()} {...item} />
								})}
							</SidebarMenu>
						</SidebarGroup>
					</Fragment>
				)}
				<SidebarSeparator />
				<SidebarGroup>
					<SidebarGroupLabel>{t('ns_common:navigation.preference_menu_label')}</SidebarGroupLabel>
					<SidebarMenu role='menu' aria-label='Preferences menu'>
						{navigationConfig.preferences
							.filter((item) => item.url !== '/preferences/account')
							.map((item, index) => (
								<SidebarMenuLink indice='none' key={index.toString()} {...item} />
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

const SidebarMenuLink: React.FC<NavLinkProps> = ({ indice, url, title, icon, viewTransition, authorizedRoles }) => {
	const { t } = useTranslation('ns_common')
	const isMobile = useMediaQuery('(min-width: 320px) and (max-width: 1365px)')
	const { open, openMobile, setOpenMobile } = useSidebar()
	const location = useRouterState({ select: (s) => s.location })
	const ref = useRef<HTMLLIElement>(null)
	const { user } = useAuth()

	const isAccessible = user.roles.some((role) => authorizedRoles.includes(role)) || authorizedRoles === '*'

	useEffect(() => {
		if (open && location.href.match(new RegExp(`^${url}$`)) && ref.current) {
			ref.current.scrollIntoView({ behavior: 'auto', block: 'center' })
		}
	}, [open, location.pathname])

	return (
		<SidebarMenuItem
			role='menuitem'
			aria-disabled={!isAccessible}
			className='group/menuitem aria-disabled:opacity-50'
			ref={ref}
			onClick={() => {
				if (isMobile) setOpenMobile(!openMobile)
			}}>
			<SidebarMenuButton
				asChild
				size='sm'
				className='group-aria-disabled/menuitem:cursor-not-allowed'
				tooltip={t(title, { defaultValue: title })}>
				<Link
					to={url}
					preload='intent'
					viewTransition={viewTransition}
					activeProps={{
						className: 'text-primary hover:text-primary bg-primary/10 '
					}}>
					<Icon name={icon} size={18} className='!size-[18px]' />
					<SidebarMenuTitle data-indice={indice}>{t(title, { defaultValue: title })}</SidebarMenuTitle>
					{!isAccessible && (
						<Icon name='Lock' size={14} className='ml-auto !size-[14px] stroke-muted-foreground' />
					)}
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}

const SidebarMenuSubLink: React.FC<Omit<NavLinkProps, 'icon'>> = ({
	indice,
	url,
	title,
	viewTransition,
	authorizedRoles
}) => {
	const { t } = useTranslation('ns_common')
	const ref = useRef<HTMLLIElement>(null)
	const isSmallScreen = useMediaQuery('(min-width: 320px) and (max-width: 1365px)')
	const { open, openMobile, setOpenMobile } = useSidebar()
	const location = useRouterState({ select: (s) => s.location })
	const { user } = useAuth()

	const isAccessible = user.roles.some((role) => authorizedRoles.includes(role)) || authorizedRoles === '*'

	useEffect(() => {
		if (open && location.href.match(new RegExp(`^${url}$`)) && ref.current) {
			ref.current.scrollIntoView({ behavior: 'auto', block: 'center' })
		}
	}, [open, location.pathname])

	return (
		<SidebarMenuSubItem
			role='menuitem'
			ref={ref}
			aria-disabled={!isAccessible}
			className='group/menuitem relative aria-disabled:cursor-help aria-disabled:opacity-50'
			onClick={() => {
				if (isSmallScreen) setOpenMobile(!openMobile)
			}}>
			<SidebarMenuSubButton asChild size='md' className='group-aria-disabled/menuitem:cursor-not-allowed'>
				<Link
					to={url}
					preload='intent'
					viewTransition={viewTransition}
					activeProps={{
						className: 'text-primary hover:text-primary bg-primary/10'
					}}>
					<SidebarMenuTitle data-indice={indice}>
						{t(title, { ns: 'ns_common', defaultValue: title })}
					</SidebarMenuTitle>
				</Link>
			</SidebarMenuSubButton>
			{!isAccessible && (
				<Icon
					name='Lock'
					size={14}
					className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-3.5 stroke-muted-foreground'
				/>
			)}
		</SidebarMenuSubItem>
	)
}

const SwitchUserCompany: React.FC = () => {
	const { user, setCurrentFactory } = useAuth()
	const { t } = useTranslation()
	const { open } = useSidebar()
	const queryClient = useQueryClient()

	useUpdateEffect(() => {
		queryClient.invalidateQueries({ type: 'all', refetchType: 'all' })
	}, [user?.current_factory_code])

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
							{t(`ns_common:factory.${user?.current_factory_code}`, {
								defaultValue: user?.current_factory_code
							})}

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
				{Array.isArray(user?.authorized_factory_codes) &&
					user.authorized_factory_codes.map((item) => (
						<DropdownMenuCheckboxItem
							key={item}
							checked={user?.current_factory_code === item}
							onCheckedChange={() => setCurrentFactory(item)}>
							{t(`ns_common:factory.${item}`, { defaultValue: item })}
						</DropdownMenuCheckboxItem>
					))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const SidebarMenuTitle = tw.span`
	font-medium 
	before:mr-2
	before:text-xs
	before:text-muted-foreground 
	before:content-[attr(data-indice)'.'] 
	data-[indice='none']:before:hidden 
	data-[indice='none']:before:content-['']
`

export default NavSidebar
