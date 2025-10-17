import { useGetUserCompany } from '@/app/(auth)/-hooks/use-department-asm'
import { navigationConfig, type NavigationConfig } from '@/app/(features)/-configs/navigation.config'
import AppLogo from '@/app/-components/-shared/app-logo'
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
import { Link } from '@tanstack/react-router'
import { useUpdateEffect } from 'ahooks'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { v4 as uuid } from 'uuid'

type NavLinkProps = Pick<NavigationConfig, 'url' | 'title' | 'icon'> & {
	indice: string
	viewTransition?: boolean
}

const NavSidebar: React.FC = () => {
	const { t } = useTranslation('ns_common')
	const isSmallScreen = useMediaQuery('(min-width: 320px) and (max-width: 1365px)')
	const { open, setOpen } = useSidebar()

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
					<ScrollShadow className='max-h-[50vh] overflow-y-auto overflow-x-hidden !scrollbar-none'>
						<SidebarMenu role='menu' aria-label='Main menu'>
							{navigationConfig.main.map((item, index) => {
								if (!Array.isArray(item.items))
									return <SidebarMenuLink indice={String(index + 1)} key={index.toString()} {...item} />
								return (
									<Collapsible key={uuid()} defaultOpen={true} className='group/collapsible w-full'>
										<CollapsibleTrigger asChild={true}>
											<SidebarMenuButton
												tooltip={t(item.title, { ns: 'ns_common', defaultValue: item.title })}
												size='sm'
												className='w-full font-medium'
												onClick={() => {
													if (!isSmallScreen && !open) setOpen(true)
												}}>
												{item.icon && (
													<Icon name={item.icon} size={18} className='!size-[18px]' strokeWidth={2} />
												)}
												<span
													data-indice={index + 1}
													className='font-medium before:mr-2 before:content-[attr(data-indice)]'>
													{t(item.title, { ns: 'ns_common', defaultValue: item.title })}
												</span>
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
														indice={`${(index + 1 + (subIndex + 1) / 10).toFixed(1)}`}
														key={subIndex.toString()}
														title={subItem.title}
														url={subItem.url}
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
				<SidebarSeparator />
				<SidebarGroup>
					<SidebarGroupLabel>{t('ns_common:navigation.preference_menu_label')}</SidebarGroupLabel>
					<SidebarMenu role='menu' aria-label='Preferences menu'>
						{navigationConfig.preferences
							.filter((item) => item.url !== '/preferences/account')
							.map((item, index) => (
								<SidebarMenuLink indice={`${index + 1}.`} key={index.toString()} {...item} />
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

const SidebarMenuLink: React.FC<NavLinkProps> = ({ indice, url, title, icon, viewTransition }) => {
	const { t } = useTranslation('ns_common')
	const isSmallScreen = useMediaQuery('(min-width: 320px) and (max-width: 1365px)')
	const { openMobile, setOpenMobile } = useSidebar()

	return (
		<SidebarMenuItem
			role='menuitem'
			onClick={() => {
				if (isSmallScreen) setOpenMobile(!openMobile)
			}}>
			<SidebarMenuButton asChild size='sm' tooltip={t(title, { defaultValue: title })}>
				<Link
					to={url}
					preload='intent'
					viewTransition={viewTransition}
					activeProps={{
						className: 'text-primary hover:text-primary bg-primary/10'
					}}>
					<Icon name={icon} size={18} className='!size-[18px]' />
					<span data-indice={indice} className='font-medium before:mr-2 before:content-[attr(data-indice)]'>
						{t(title, { defaultValue: title })}
					</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}

const SidebarMenuSubLink: React.FC<Omit<NavLinkProps, 'icon'>> = ({ indice, url, title, viewTransition }) => {
	const { t } = useTranslation('ns_common')
	const isSmallScreen = useMediaQuery('(min-width: 320px) and (max-width: 1365px)')
	const { openMobile, setOpenMobile } = useSidebar()

	return (
		<SidebarMenuSubItem
			role='menuitem'
			onClick={() => {
				if (isSmallScreen) setOpenMobile(!openMobile)
			}}>
			<SidebarMenuSubButton asChild size='md'>
				<Link
					to={url}
					data-indice={indice}
					preload='intent'
					viewTransition={viewTransition}
					className='font-medium before:mr-2 before:content-[attr(data-indice)]'
					activeProps={{
						className: 'text-primary hover:text-primary bg-primary/10'
					}}>
					{t(title, { ns: 'ns_common', defaultValue: title })}
				</Link>
			</SidebarMenuSubButton>
		</SidebarMenuSubItem>
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
