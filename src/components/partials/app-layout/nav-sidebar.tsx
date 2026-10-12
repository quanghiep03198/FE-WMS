import { UserRole } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import AppLogo from '@components/shared/app-logo'
import { Collapsible, CollapsibleContent } from '@components/ui/collapsible'
import { Icon } from '@components/ui/icon'
import {
	Sidebar,
	SidebarContent,
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
} from '@components/ui/sidebar'
import { navigationConfig, type NavigationConfig } from '@configs/navigation.config'
import useAuth from '@hooks/use-auth'
import useMediaQuery from '@hooks/use-media-query'
import { CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { Link, useRouterState } from '@tanstack/react-router'
import React, { Fragment, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { v4 as uuid } from 'uuid'
import type { FileRouteTypes } from '../../../route-tree.gen'

type NavLinkProps = Pick<NavigationConfig, 'url' | 'title' | 'icon' | 'authorizedRoles'> & {
	indice: `${number}` | `${number}.${number}` | 'none'
	viewTransition?: React.ComponentProps<typeof Link>['viewTransition']
}

const NavSidebar: React.FC = () => {
	const { user } = useAuth()
	const { t } = useTranslation('ns_common')
	const isMobile = useMediaQuery('(min-width: 320px) and (max-width: 1365px)')
	const { setOpen } = useSidebar()

	return (
		<Sidebar className='max-w-96' collapsible='icon' side='left' variant='sidebar'>
			<SidebarHeader className='overflow-hidden'>
				<Link className='max-w-full' preload='intent' to='/dashboard'>
					<AppLogo />
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>{t('navigation.main_menu_label')}</SidebarGroupLabel>
					<div className='scroll-fade max-h-[40vh] scrollbar-none! overflow-x-hidden overflow-y-auto'>
						<SidebarMenu aria-label='Main menu' role='menu'>
							{navigationConfig.main.map((item, index) => {
								if (!Array.isArray(item.items))
									return (
										<SidebarMenuLink
											indice={`${index + 1}`}
											key={index.toString()}
											// viewTransition={{ types: ['fade'] }}
											{...item}
										/>
									)
								return (
									<Collapsible className='group/collapsible w-full' defaultOpen={true} key={uuid()}>
										<CollapsibleTrigger asChild={true}>
											<SidebarMenuButton
												className='w-full font-medium'
												size='sm'
												tooltip={t(item.title, { ns: 'ns_common', defaultValue: item.title })}
												aria-disabled={item.items.every(
													(subItem) =>
														subItem.authorizedRoles !== '*' &&
														!user?.roles?.some(
															(role) =>
																Array.isArray(subItem.authorizedRoles) &&
																subItem.authorizedRoles.includes(role)
														)
												)}
												onClick={() => {
													if (isMobile) return
													setOpen(true)
												}}>
												{item.icon && (
													<Icon className='size-4.5!' name={item.icon} size={18} strokeWidth={2} />
												)}
												<SidebarMenuTitle data-indice={index + 1}>
													{t(item.title, { ns: 'ns_common', defaultValue: item.title })}
												</SidebarMenuTitle>
												<Icon
													className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90'
													name='ChevronRight'
												/>
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down w-full scrollbar-none! overflow-auto transition-none'>
											<SidebarMenuSub>
												{item.items?.map((subItem, subIndex) => (
													<SidebarMenuSubLink
														// viewTransition={{ types: ['fade'] }}
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
					<SidebarGroupLabel>{t('navigation.integration_menu_label')}</SidebarGroupLabel>
					<SidebarMenu aria-label='Administration' role='menu'>
						{navigationConfig.integrations.map((item) => {
							return (
								<SidebarMenuLink indice='none' key={uuid()} {...item} viewTransition={{ types: ['fade'] }} />
							)
						})}
					</SidebarMenu>
				</SidebarGroup>
				{user?.roles?.includes(UserRole.ADMIN) && (
					<Fragment>
						<SidebarSeparator />
						<SidebarGroup>
							<SidebarGroupLabel>{t('navigation.administration_menu_label')}</SidebarGroupLabel>
							<SidebarMenu aria-label='Administration' role='menu'>
								{navigationConfig.administration.map((item) => {
									return (
										<SidebarMenuLink
											indice='none'
											key={uuid()}
											viewTransition={{ types: ['fade'] }}
											{...item}
										/>
									)
								})}
							</SidebarMenu>
						</SidebarGroup>
					</Fragment>
				)}
				<SidebarSeparator className={cn(user?.roles?.includes(UserRole.ADMIN) && 'xxl:block hidden')} />
				<SidebarGroup className={cn(user?.roles?.includes(UserRole.ADMIN) && 'xxl:flex hidden')}>
					<SidebarGroupLabel>{t('navigation.preference_menu_label')}</SidebarGroupLabel>
					<SidebarMenu aria-label='Preferences menu' role='menu'>
						{navigationConfig.preferences
							.filter((item) => item.url !== '/preferences/account')
							.map((item, index) => (
								<SidebarMenuLink indice='none' key={index.toString()} {...item} />
							))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			{/* <SidebarFooter>
				<SwitchUserCompany />
			</SidebarFooter> */}
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
		(user &&
			Array.isArray(user.roles) &&
			user.roles.some((role) => Array.isArray(authorizedRoles) && authorizedRoles.includes(role))) ||
		authorizedRoles === '*'

	const isActive = location.pathname.match(new RegExp(`^${url}$`))

	useEffect(() => {
		if (open && isActive && ref.current) {
			ref.current.scrollIntoView({ behavior: 'auto', block: 'center' })
		}
	}, [open, location.pathname])

	return (
		<SidebarMenuItem
			aria-disabled={!isLinkActive}
			className='group/menuitem aria-disabled:opacity-50'
			ref={ref}
			role='menuitem'
			onClick={() => {
				if (isMobile) setOpenMobile(!openMobile)
			}}>
			<SidebarMenuButton
				asChild
				className='group-aria-disabled/menuitem:cursor-not-allowed'
				size='sm'
				tooltip={t(title, { defaultValue: title })}>
				<Link
					search={isActive ? location.search : {}}
					to={url as FileRouteTypes['to']}
					viewTransition={viewTransition}
					activeProps={{
						className: 'text-primary hover:text-primary bg-primary/10 '
					}}>
					<Icon className='size-4.5!' name={icon!} size={18} />
					<SidebarMenuTitle data-indice={indice}>{t(title, { defaultValue: title })}</SidebarMenuTitle>
					{!isLinkActive && <Icon className='stroke-muted-foreground ml-auto size-3.5!' name='Lock' size={14} />}
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}

const SidebarMenuSubLink: React.FC<Omit<NavLinkProps, 'icon'>> = ({
	viewTransition,
	indice,
	url,
	title,
	authorizedRoles
}) => {
	const { t } = useTranslation('ns_common')
	const ref = useRef<HTMLLIElement>(null)
	const isSmallScreen = useMediaQuery('(min-width: 320px) and (max-width: 1365px)')
	const { open, openMobile, setOpenMobile } = useSidebar()
	const location = useRouterState({ select: (s) => s.location })
	const { user } = useAuth()

	const isAccessible =
		(user &&
			Array.isArray(user?.roles) &&
			user?.roles?.some((role) => Array.isArray(authorizedRoles) && authorizedRoles.includes(role))) ||
		authorizedRoles === '*'

	const isActive = location.pathname.match(new RegExp(`^${url}$`))

	useEffect(() => {
		if (open && isActive && ref.current) {
			ref.current.scrollIntoView({ behavior: 'auto', block: 'center' })
		}
	}, [open, location.pathname])

	return (
		<SidebarMenuSubItem
			aria-disabled={!isAccessible}
			className='group/menuitem relative aria-disabled:cursor-help aria-disabled:opacity-50'
			ref={ref}
			role='menuitem'
			onClick={() => {
				if (isSmallScreen) setOpenMobile(!openMobile)
			}}>
			<SidebarMenuSubButton asChild className='group-aria-disabled/menuitem:cursor-not-allowed' size='md'>
				<Link
					preload='intent'
					search={isActive ? location.search : {}}
					to={url as FileRouteTypes['to']}
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
					className='stroke-muted-foreground absolute top-1/2 right-0 translate-x-3.5 -translate-y-1/2'
					name='Lock'
					size={14}
				/>
			)}
		</SidebarMenuSubItem>
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
