import { useAuth } from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import { buttonVariants, Div, Icon, IconProps, Separator, Tooltip, Typography } from '@/components/ui'
import { navigationConfig, type NavigationConfig } from '@/configs/navigation.config'
import { routeTree } from '@/route-tree.gen'
import { Link, ParseRoute, useNavigate } from '@tanstack/react-router'
import { useKeyPress } from 'ahooks'
import { KeyType } from 'ahooks/lib/useKeyPress'
import { debounce } from 'lodash'
import { Fragment, memo, useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import AppLogo from '../../../_components/_shared/-app-logo'
import { SIDEBAR_TOGGLE_CHANGE } from '../../_constants/event.const'

type NavLinkProps = Pick<NavigationConfig, 'path' | 'title' | 'icon'>

const NavSidebar: React.FC = () => {
	const navigate = useNavigate()
	const isMobileScreen = useMediaQuery('(min-width: 320px) and (max-width: 1365px)')
	const checkboxRef = useRef<HTMLInputElement>(null)
	const { user } = useAuth()

	const keyCallbackMap = useMemo<Record<KeyType, () => void>>(
		() => ({
			'ctrl.b': debounce(() => {
				checkboxRef.current.checked = !checkboxRef.current.checked
				dispatchSidebarToggleEvent(checkboxRef.current.checked)
			}, 50),
			...navigationConfig.reduce<{ [key: string]: () => void }>((acc, curr) => {
				acc[String(curr.keybinding)] = function () {
					return navigate({ to: curr.path })
				}
				return acc
			}, {})
		}),
		[checkboxRef.current]
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

	useLayoutEffect(() => {
		if (isMobileScreen) {
			checkboxRef.current.checked = false
		}
	}, [isMobileScreen])

	window['navbarTogglerEl'] = checkboxRef.current

	const dispatchSidebarToggleEvent = useCallback(
		(value: boolean) => window.dispatchEvent(new CustomEvent(SIDEBAR_TOGGLE_CHANGE, { detail: value })),
		[]
	)

	return (
		<Aside>
			<SidebarToggleTrigger
				id='sidebar-toggle'
				type='checkbox'
				defaultChecked={true}
				ref={checkboxRef}
				onChange={(e) => dispatchSidebarToggleEvent(e.target.checked)}
			/>
			<LogoLink to='/dashboard' preload='intent'>
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
		<Fragment>
			<Div className='block group-has-[:checked]/sidebar:hidden'>
				<Tooltip
					message={t(title, { defaultValue: title })}
					contentProps={{
						side: 'right',
						sideOffset: 8,
						className: 'z-50'
					}}>
					<Link
						to={path}
						role='link'
						preload='intent'
						aria-label={t(title, { defaultValue: title })}
						className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
						activeProps={{ className: 'text-primary hover:text-primary bg-primary/10' }}>
						<Icon size={20} name={icon} role='img' />
					</Link>
				</Tooltip>
			</Div>
			<Div className='hidden group-has-[:checked]/sidebar:block'>
				<Link
					to={path}
					role='link'
					preload='intent'
					className={cn(buttonVariants({ variant: 'ghost', className: 'w-full' }))}
					activeProps={{
						className: 'text-primary hover:text-primary bg-primary/10'
					}}>
					<Icon size={20} name={icon} role='img' />
					<NavlinkText>{t(title, { defaultValue: title })}</NavlinkText>
				</Link>
			</Div>
		</Fragment>
	)
}

const Menu = tw.ul`flex flex-col gap-y-1 items-stretch py-6 overflow-x-hidden overflow-y-auto !scrollbar-none`
const MenuItem = tw.li`whitespace-nowrap font-normal w-full [&>:first-child]:w-full`
const Aside = tw.aside`group/sidebar z-50 flex h-screen flex-col overflow-y-auto overflow-x-hidden bg-background px-3 pb-6 w-16 items-center shadow transition-width duration-200 ease-in-out scrollbar-none sm:hidden md:hidden has-[:checked]:items-stretch has-[:checked]:@xl:w-80 has-[:checked]:@[1920px]:w-88`
const NavlinkText = tw.span`text-left text-base font-medium transition-[width_opacity] size-0 opacity-0 group-has-[:checked]/sidebar:size-auto group-has-[:checked]/sidebar:flex-1 group-has-[:checked]/sidebar:opacity-100 duration-150`
const LogoWrapper = tw.div`space-y-0.5 transition-[width_opacity] group-has-[:checked]/sidebar:w-auto group-has-[:checked]/sidebar:opacity-100 w-0 opacity-0 duration-200`
const SidebarToggleTrigger = tw.input`hidden appearance-none`

const NavLinkIcon = tw(Icon)<IconProps>`
	group-has-[:checked]/sidebar:basis-5 basis-full size-5
`

const LogoLink = tw(Link)<React.ComponentProps<typeof Link>>`
	flex h-20 items-center group-has-[:checked]/sidebar:gap-x-3 group-has-[:checked]/sidebar:justify-start group-has-[:checked]/sidebar:aspect-auto px-2 aspect-square justify-center
`

export default memo(NavSidebar)
