import { useGetUserCompany } from '@/app/(auth)/_apis/department.api'
import AppLogo from '@/app/_components/_shared/-app-logo'
import { PresetBreakPoints } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
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
import { routeTree } from '@/route-tree.gen'
import { Link, ParseRoute, useNavigate } from '@tanstack/react-router'
import { useKeyPress } from 'ahooks'
import { KeyType } from 'ahooks/lib/useKeyPress'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type NavLinkProps = Pick<NavigationConfig, 'path' | 'title' | 'icon'>

const NavSidebar: React.FC = () => {
	const navigate = useNavigate()

	const keyCallbackMap = useMemo<Record<KeyType, () => void>>(
		() => ({
			...navigationConfig.reduce<{ [key: string]: () => void }>((acc, curr) => {
				acc[String(curr.keybinding)] = function () {
					return navigate({ to: curr.path })
				}
				return acc
			}, {})
		}),
		[]
	)

	useKeyPress(Object.keys(keyCallbackMap), (e, key) => {
		e.preventDefault()
		keyCallbackMap[key]()
	})

	const isUltimateLargeScreen = useMediaQuery(PresetBreakPoints.ULTIMATE_LARGE)

	const mainMenuSize = useMemo(() => (isUltimateLargeScreen ? 384 : 320), [isUltimateLargeScreen])

	const mainMenu = useMemo(() => {
		return navigationConfig.filter((item) => item.type === 'main')
	}, [])

	const preferenceMenu = useMemo(() => {
		return navigationConfig.filter((item) => {
			const matches: Array<ParseRoute<typeof routeTree>['fullPath']> = [
				'/preferences/keybindings',
				'/preferences/appearance-settings'
			]
			return item.type === 'preference' && matches.includes(item.path)
		})
	}, [])

	return (
		<Sidebar variant='sidebar' side='left' collapsible='icon' className='z-50 !bg-background'>
			<SidebarHeader className='overflow-hidden'>
				<Link to='/dashboard' preload='intent'>
					<AppLogo />
				</Link>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Main</SidebarGroupLabel>
					<ScrollShadow size={mainMenuSize}>
						<SidebarMenu role='menu' aria-label='Main menu'>
							{mainMenu.map((item) => (
								<SidebarMenuLink key={item.id} {...item} />
							))}
						</SidebarMenu>
					</ScrollShadow>
				</SidebarGroup>
				<SidebarSeparator />
				<SidebarGroup>
					<SidebarGroupLabel>Preferences</SidebarGroupLabel>
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

const SidebarMenuLink: React.FC<NavLinkProps> = ({ path, title, icon }) => {
	const { t } = useTranslation('ns_common')
	const isSmallScreen = useMediaQuery('(min-width: 320px) and (max-width: 1365px)')
	const { setOpenMobile } = useSidebar()

	return (
		<SidebarMenuItem role='menuitem' onClick={() => setOpenMobile(!isSmallScreen)}>
			<SidebarMenuButton
				asChild
				size='default'
				className='w-full gap-x-3'
				tooltip={t(title, { defaultValue: title })}>
				<Link
					to={path}
					role='link'
					preload='intent'
					activeProps={{
						className: 'text-primary hover:text-primary bg-primary/10'
					}}>
					<Icon className='!size-[18px] !stroke-[2px]' name={icon} role='img' />
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

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					size={open ? 'default' : 'icon'}
					className={cn(open ? 'justify-start' : 'size-8')}>
					<Icon name='Factory' role='img' />
					{open && (
						<Fragment>
							{user?.company_name}
							<Icon name='ChevronsUpDown' role='img' className='ml-auto' />
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
