import { useAuth } from '@/common/hooks/use-auth'
import {
	Icon,
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
	Typography
} from '@/components/ui'
import { navigationConfig, type NavigationConfig } from '@/configs/navigation.config'
import { routeTree } from '@/route-tree.gen'
import { Link, ParseRoute, useNavigate } from '@tanstack/react-router'
import { useKeyPress } from 'ahooks'
import { KeyType } from 'ahooks/lib/useKeyPress'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import AppLogo from '../../../_components/_shared/-app-logo'

type NavLinkProps = Pick<NavigationConfig, 'path' | 'title' | 'icon'>

const NavSidebar: React.FC = () => {
	const navigate = useNavigate()
	const { user } = useAuth()

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
			<SidebarHeader>
				<Link
					to='/dashboard'
					preload='intent'
					className='flex items-center gap-x-3 group-data-[state=expanded]:gap-x-3 xl:gap-x-0'>
					<Icon name='Boxes' className='size-9 stroke-primary stroke-[1px] transition-all duration-200' />
					<LogoWrapper>
						<AppLogo />
						<Typography variant='small' className='whitespace-nowrap text-xs text-muted-foreground'>
							{user?.company_name}
						</Typography>
					</LogoWrapper>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Main</SidebarGroupLabel>
					<SidebarMenu>
						{mainMenu.map((item) => (
							<NavLink key={item.id} {...item} />
						))}
					</SidebarMenu>
				</SidebarGroup>
				<SidebarSeparator />
				<SidebarGroup role='menu'>
					<SidebarGroupLabel>Preferences</SidebarGroupLabel>
					<SidebarMenu>
						{preferenceMenu.map((item) => (
							<NavLink key={item.id} {...item} />
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	)
}

const NavLink: React.FC<NavLinkProps> = ({ path, title, icon }) => {
	const { t } = useTranslation('ns_common')

	return (
		<SidebarMenuItem role='menuItem' tabIndex={0}>
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

const LogoWrapper = tw.div`space-y-0 transition-[width_opacity] group-data-[state=expanded]:w-auto group-data-[state=expanded]:opacity-100 xl:w-0 xl:opacity-0 duration-50`

export default memo(NavSidebar)
