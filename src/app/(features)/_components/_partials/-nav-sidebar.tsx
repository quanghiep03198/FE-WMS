import { useAuth } from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
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
	Typography,
	useSidebar
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
			<SidebarHeader className='py-4'>
				<Link
					to='/dashboard'
					preload='intent'
					className='flex items-center gap-x-3 group-data-[state=expanded]:gap-x-3 xl:gap-x-0'>
					<Icon name='Boxes' className='size-9 stroke-primary stroke-[1px] transition-all duration-200' />
					<LogoWrapper>
						<AppLogo />
						<Typography variant='small' className='text-xs text-muted-foreground'>
							{user?.company_name}
						</Typography>
					</LogoWrapper>
				</Link>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Main</SidebarGroupLabel>
					<SidebarMenu role='menu' aria-label='Main menu'>
						{mainMenu.map((item) => (
							<SidebarMenuLink key={item.id} {...item} />
						))}
					</SidebarMenu>
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

const LogoWrapper = tw.div`space-y-0.5 transition-[width_opacity] group-data-[state=expanded]:w-auto group-data-[state=expanded]:opacity-100 xl:w-0 xl:opacity-0 duration-50`

export default memo(NavSidebar)

/**
	 @deprecated	
		const mainMenuRef = useRef<typeof SidebarMenu.prototype>(null)
		const mainMenuScroll = useScroll(mainMenuRef)
		const isScrolledToTop = mainMenuScroll?.top === 0
		const isScrolledToBottom =
		mainMenuRef.current?.scrollHeight - mainMenuRef.current?.scrollTop - mainMenuRef.current?.clientHeight < 1
		const isScrollTopBottom = !isScrolledToTop && !isScrolledToBottom

		* * This is a sample code for handling scroll event on the sidebar menu
		<SidebarMenu>
			style={{ '--scroll-shadow-size': '320px' } as React.CSSProperties}
			data-top-scroll={isScrolledToTop}
			data-bottom-scroll={isScrolledToBottom}
			data-top-bottom-scroll={isScrollTopBottom}
			className={cn(
				'h-[var(--scroll-shadow-size)] overflow-y-auto transition-colors duration-200 !scrollbar-none',
				'data-[bottom-scroll=true]:[mask-image:linear-gradient(0deg,hsl(var(--sidebar-background))_calc(100%_-_var(--scroll-shadow-size)/2),transparent)]',
				'data-[top-scroll=true]:[mask-image:linear-gradient(180deg,hsl(var(--sidebar-background))_calc(100%_-_var(--scroll-shadow-size)/2),transparent)]',
				'data-[top-bottom-scroll=true]:[mask-image:linear-gradient(180deg,transparent,hsl(var(--sidebar-background))_calc(var(--scroll-shadow-size)/4),hsl(var(--sidebar-background))_calc(100%_-_var(--scroll-shadow-size)/4),transparent)]'
				)}
		</SidebarMenu>
*/
