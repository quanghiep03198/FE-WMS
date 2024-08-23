import { useAuth } from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import { $mediaQuery } from '@/common/utils/media-query'
import { Icon, IconProps, Separator, Tooltip, Typography } from '@/components/ui'
import { navigationConfig, type NavigationConfig } from '@/configs/navigation.config'
import { routeTree } from '@/route-tree.gen'
import { Link, ParseRoute, useNavigate } from '@tanstack/react-router'
import { useKeyPress } from 'ahooks'
import { KeyType } from 'ahooks/lib/useKeyPress'
import { debounce } from 'lodash'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import AppLogo from '../../../_components/_shared/-app-logo'

type NavLinkProps = Pick<NavigationConfig, 'path' | 'title' | 'icon'>

const NavSidebar: React.FC = () => {
	const navigate = useNavigate()
	const isExtraLargeScreen = useMediaQuery($mediaQuery({ minWidth: 1366 }))
	const [open, setOpen] = useState<boolean>(isExtraLargeScreen)
	const checkboxRef = useRef<HTMLInputElement>(null)
	const { user } = useAuth()

	const keyCallbackMap = useMemo<Record<KeyType, () => void>>(
		() => ({
			'ctrl.b': debounce(() => setOpen(!open), 50),
			...navigationConfig.reduce<{ [key: string]: () => void }>((acc, curr) => {
				acc[String(curr.keybinding)] = function () {
					return navigate({ to: curr.path })
				}
				return acc
			}, {})
		}),
		[open]
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

	useEffect(() => {
		setOpen(isExtraLargeScreen)
	}, [isExtraLargeScreen])

	return (
		<Aside>
			<input
				type='checkbox'
				id='sidebar-toggle'
				className='hidden appearance-none'
				checked={open}
				ref={checkboxRef}
				onChange={(e) => setOpen(e.target.checked)}
			/>
			<LogoLink to='/dashboard' preload={false}>
				<Icon name='Boxes' size={36} stroke='hsl(var(--primary))' strokeWidth={1} />
				<LogoWrapper>
					<AppLogo />
					<Typography variant='small' className='text-xs text-muted-foreground'>
						{user?.company_name}
					</Typography>
				</LogoWrapper>
			</LogoLink>
			<Menu role='menu'>
				{mainMenu.map((item) => (
					<MenuItem key={item.id}>
						<NavLink {...item} />
					</MenuItem>
				))}
				<Separator className='my-4' />
				{preferenceMenu.map((item) => (
					<MenuItem role='menuItem' tabIndex={0} key={item.id}>
						<NavLink {...item} />
					</MenuItem>
				))}
			</Menu>
		</Aside>
	)
}

const NavLink: React.FC<NavLinkProps> = ({ path, title, icon }) => {
	const { t } = useTranslation('ns_common')

	return (
		<Tooltip
			message={t(title, { defaultValue: title })}
			contentProps={{ side: 'right', sideOffset: 8, className: 'z-50 group-has-[:checked]:hidden' }}>
			<MenuLink
				to={path}
				role='link'
				preload={false}
				activeProps={{ className: 'text-primary hover:text-primary bg-primary/10' }}>
				<NavLinkIcon size={20} name={icon} />
				<NavlinkText>{t(title, { defaultValue: title })}</NavlinkText>
			</MenuLink>
		</Tooltip>
	)
}

const Menu = tw.ul`flex flex-col gap-y-1 items-stretch py-6 overflow-x-hidden overflow-y-auto !scrollbar-none`
const MenuItem = tw.li`whitespace-nowrap font-normal w-full [&>:first-child]:w-full`
const Aside = tw.aside`group z-50 flex h-screen flex-col overflow-y-auto overflow-x-hidden bg-background px-3 pb-6 w-16 items-center shadow transition-width duration-200 ease-in-out scrollbar-none sm:hidden md:hidden has-[:checked]:items-stretch has-[:checked]:@xl:w-80 has-[:checked]:@[1920px]:w-88`
const NavlinkText = tw.span`text-left text-base font-medium transition-[width_opacity] size-0 opacity-0 group-has-[:checked]:size-auto group-has-[:checked]:flex-1 group-has-[:checked]:opacity-100 duration-150`
const LogoWrapper = tw.div`space-y-0.5 transition-[width_opacity] group-has-[:checked]:w-auto group-has-[:checked]:opacity-100 w-0 opacity-0 duration-200`

const NavLinkIcon = tw(Icon)<IconProps>`
	group-has-[:checked]:basis-5 basis-full size-5
`
const MenuLink = tw(Link)<React.ComponentProps<typeof Link>>`
	flex py-2 px-2 group-has-[:checked]:px-4 items-center justify-center whitespace-nowrap hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors duration-0 focus-within:outline-none focus:ring-0 focus:ring-offset-transparent size-9 group-has-[:checked]:flex group-has-[:checked]:size-auto group-has-[:checked]:justify-start group-has-[:checked]:gap-x-3 group-has-[:checked]:aspect-auto aspect-square
`
const LogoLink = tw(Link)<React.ComponentProps<typeof Link>>`
	flex h-20 items-center group-has-[:checked]:gap-x-3 group-has-[:checked]:justify-start group-has-[:checked]:aspect-auto px-2 aspect-square justify-center
`

export default memo(NavSidebar)
