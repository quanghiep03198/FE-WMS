import { BreakPoints } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import { Icon, IconProps, Separator, Tooltip, Typography, buttonVariants } from '@/components/ui'
import { navigationConfig, type NavigationConfig } from '@/configs/navigation.config'
import { routeTree } from '@/route-tree.gen'
import { Link, ParseRoute, useNavigate } from '@tanstack/react-router'
import { useKeyPress } from 'ahooks'
import { KeyType } from 'ahooks/lib/useKeyPress'
import { debounce, pick } from 'lodash'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useShallow } from 'zustand/react/shallow'
import AppLogo from '../../../_components/_shared/-app-logo'
import { useLayoutStore } from '../../_stores/layout.store'

type NavLinkProps = { open: boolean } & Pick<NavigationConfig, 'path' | 'title' | 'icon'>

const NavSidebar: React.FC = () => {
	const navigate = useNavigate()
	const { navSidebarOpen, toggleNavSidebarOpen } = useLayoutStore(
		useShallow((state) => pick(state, ['navSidebarOpen', 'toggleNavSidebarOpen']))
	)
	const isSmallScreen = useMediaQuery(BreakPoints.SMALL)
	const isMediumScreen = useMediaQuery(BreakPoints.MEDIUM)
	const isLargeScreen = useMediaQuery(BreakPoints.LARGE)
	const { user } = useAuth()

	const keyCallbackMap = useMemo<Record<KeyType, () => void>>(
		() => ({
			'ctrl.b': debounce(toggleNavSidebarOpen, 50),
			...navigationConfig.reduce<{ [key: string]: () => void }>((acc, curr) => {
				acc[String(curr.keybinding)] = function () {
					return navigate({ to: curr.path })
				}
				return acc
			}, {})
		}),
		[navSidebarOpen]
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
			const matches: Array<ParseRoute<typeof routeTree>['fullPath']> = ['/account', '/profile']
			return item.type === 'preference' && !matches.includes(item.path)
		})
	}, [])

	const expanded = useMemo(() => navSidebarOpen || isLargeScreen, [navSidebarOpen, isLargeScreen])

	if (isSmallScreen || isMediumScreen) return null

	return (
		<Aside aria-expanded={expanded}>
			<LogoLink to='/dashboard' preload={false} aria-expanded={expanded}>
				<Icon name='Boxes' size={36} stroke='hsl(var(--primary))' strokeWidth={1} />
				<LogoWrapper aria-expanded={expanded}>
					<AppLogo />
					<Typography variant='small' className='text-xs text-muted-foreground'>
						{user?.company_name}
					</Typography>
				</LogoWrapper>
			</LogoLink>

			<Menu aria-expanded={expanded} role='menu'>
				{mainMenu.map((item) => (
					<MenuItem key={item.id}>
						<NavLink open={expanded} {...item} />
					</MenuItem>
				))}
				<Separator className='my-4' />
				{preferenceMenu.map((item) => (
					<MenuItem role='menuItem' tabIndex={0} key={item.id}>
						<NavLink open={expanded} {...item} />
					</MenuItem>
				))}
			</Menu>
		</Aside>
	)
}

const NavLink: React.FC<NavLinkProps> = ({ open, path, title, icon }) => {
	const { t } = useTranslation('ns_common')

	return (
		<Tooltip
			message={t(title, { defaultValue: title })}
			contentProps={{ side: 'right', hidden: open === true, sideOffset: 8, className: 'z-50' }}>
			<MenuLink
				to={path}
				role='link'
				preload={false}
				activeProps={{ className: 'text-primary hover:text-primary bg-primary/10' }}
				aria-expanded={open}
				className={buttonVariants({
					variant: 'ghost',
					size: open ? 'icon' : 'default',
					className: 'p-2'
				})}>
				<NavLinkIcon size={20} aria-expanded={open} name={icon} />
				<NavlinkText aria-expanded={open}>{t(title, { defaultValue: title })}</NavlinkText>
			</MenuLink>
		</Tooltip>
	)
}

const Menu = tw.ul`flex flex-col gap-y-2 items-stretch py-6 overflow-x-hidden overflow-y-auto scrollbar-none`
const MenuItem = tw.li`whitespace-nowrap font-normal w-full [&>:first-child]:w-full`
const Aside = tw.aside`z-50 flex h-screen flex-col overflow-y-auto overflow-x-hidden bg-background px-3 pb-6 w-16 items-center shadow transition-width duration-200 ease-in-out scrollbar-none sm:hidden md:hidden aria-expanded:items-stretch aria-expanded:@xl:w-80 aria-expanded:@[1920px]:w-88`
const NavlinkText = tw.span`text-left font-medium transition-[width_opacity] size-0 opacity-0 aria-expanded:size-auto aria-expanded:flex-1 aria-expanded:opacity-100 duration-150`
const NavLinkIcon = tw(Icon)<IconProps>`aria-expanded:basis-5 basis-full size-5`
const MenuLink = tw(Link)<React.ComponentProps<typeof Link>>`
	group text-base font-normal duration-0 focus-within:outline-none justify-center focus:ring-0 focus:ring-offset-transparent size-9 aria-expanded:flex aria-expanded:size-auto aria-expanded:justify-start aria-expanded:gap-x-3 aria-expanded:aspect-auto aspect-square
`
const LogoWrapper = tw.div`space-y-0.5 transition-[width_opacity] aria-expanded:w-auto aria-expanded:opacity-100 w-0 opacity-0 duration-200`
const LogoLink = tw(Link)<React.ComponentProps<typeof Link>>`
	flex h-20 items-center aria-expanded:gap-x-3 aria-expanded:justify-start aria-expanded:aspect-auto px-2 aspect-square justify-center
`

export default memo(NavSidebar)
