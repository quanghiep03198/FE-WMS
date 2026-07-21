import { navigationConfig, type NavigationConfig } from '@/app/(features)/-configs/navigation.config'
import AppLogo from '@/components/shared/app-logo'
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
import { UserRole } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import useAuth from '@hooks/use-auth'
import useMediaQuery from '@hooks/use-media-query'
import { CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useRouterState } from '@tanstack/react-router'
import { useUpdateEffect } from 'ahooks'
import React, { Fragment, useEffect, useRef } from 'react'
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
					<div className='scroll-fade max-h-[40vh] scrollbar-none! overflow-x-hidden overflow-y-auto'>
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
														!user?.roles?.some((role) => subItem.authorizedRoles.includes(role))
												)}
												onClick={() => {
													if (isMobile) return
													setOpen(true)
												}}>
												{item.icon && (
													<Icon name={item.icon} size={18} className='size-[18px]!' strokeWidth={2} />
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
										<CollapsibleContent className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down w-full scrollbar-none! overflow-auto transition-none'>
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
					</div>
				</SidebarGroup>
				<SidebarSeparator />
				<SidebarGroup>
					<SidebarGroupLabel>{t('ns_common:navigation.integration_menu_label')}</SidebarGroupLabel>
					<SidebarMenu role='menu' aria-label='Administration'>
						{navigationConfig.integrations.map((item) => {
							return <SidebarMenuLink indice='none' key={uuid()} {...item} />
						})}
					</SidebarMenu>
				</SidebarGroup>
				{user?.roles?.includes(UserRole.ADMIN) && (
					<Fragment>
						<SidebarSeparator />
						<SidebarGroup>
							<SidebarGroupLabel>{t('ns_common:navigation.administration_menu_label')}</SidebarGroupLabel>
							<SidebarMenu role='menu' aria-label='Administration'>
								{navigationConfig.administration.map((item) => {
									return <SidebarMenuLink indice='none' key={uuid()} {...item} />
								})}
							</SidebarMenu>
						</SidebarGroup>
					</Fragment>
				)}
				<SidebarSeparator className={cn(user?.roles?.includes(UserRole.ADMIN) && 'xxl:block hidden')} />
				<SidebarGroup className={cn(user?.roles?.includes(UserRole.ADMIN) && 'xxl:flex hidden')}>
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

	const isLinkActive =
		(user && Array.isArray(user.roles) && user.roles.some((role) => authorizedRoles.includes(role))) ||
		authorizedRoles === '*'

	const isActive = location.pathname.match(new RegExp(`^${url}$`))

	useEffect(() => {
		if (open && isActive && ref.current) {
			ref.current.scrollIntoView({ behavior: 'auto', block: 'center' })
		}
	}, [open, location.pathname])

	return (
		<SidebarMenuItem
			role='menuitem'
			aria-disabled={!isLinkActive}
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
					search={isActive && location.search}
					viewTransition={viewTransition}
					activeProps={{
						className: 'text-primary hover:text-primary bg-primary/10 '
					}}>
					<Icon name={icon} size={18} className='size-[18px]!' />
					<SidebarMenuTitle data-indice={indice}>{t(title, { defaultValue: title })}</SidebarMenuTitle>
					{!isLinkActive && (
						<Icon name='Lock' size={14} className='stroke-muted-foreground ml-auto size-[14px]!' />
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

	const isAccessible =
		(user && Array.isArray(user?.roles) && user?.roles?.some((role) => authorizedRoles.includes(role))) ||
		authorizedRoles === '*'

	const isActive = location.pathname.match(new RegExp(`^${url}$`))

	useEffect(() => {
		if (open && isActive && ref.current) {
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
					search={isActive && location.search}
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
					className='stroke-muted-foreground absolute top-1/2 right-0 translate-x-3.5 -translate-y-1/2'
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
				<Button variant='ghost' size={open ? 'default' : 'icon'} className={cn(open ? 'justify-start' : 'size-8')}>
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
				className='w-(--radix-dropdown-menu-trigger-width) min-w-60'
				side={open ? 'top' : 'right'}
				align='end'>
				<DropdownMenuLabel>{t('ns_company:factory')}</DropdownMenuLabel>
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
