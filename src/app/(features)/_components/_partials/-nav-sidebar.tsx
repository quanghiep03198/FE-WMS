import { BreakPoints } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import { Div, Icon, Separator, Tooltip, Typography, buttonVariants } from '@/components/ui'
import { navigationConfig, type NavigationConfig } from '@/configs/navigation.config'
import { Link, useNavigate } from '@tanstack/react-router'
import { useKeyPress } from 'ahooks'
import { KeyType } from 'ahooks/lib/useKeyPress'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import AppLogo from '../../../_components/_shared/-app-logo'

type NavSidebarProps = {
	isCollapsed: boolean
	onCollapsedChange: React.Dispatch<React.SetStateAction<boolean>>
}

type NavLinkProps = { isCollapsed: boolean } & Pick<NavigationConfig, 'path' | 'title' | 'icon'>

const NavSidebar: React.FC<NavSidebarProps> = ({ isCollapsed, onCollapsedChange: toggleCollapseSidebar }) => {
	const navigate = useNavigate()
	const isSmallScreen = useMediaQuery(BreakPoints.SMALL)
	const isMediumScreen = useMediaQuery(BreakPoints.MEDIUM)
	const isLargeScreen = useMediaQuery(BreakPoints.LARGE)
	const { user } = useAuth()

	const keyCallbackMap = useMemo<Record<KeyType, () => void>>(
		() => ({
			'ctrl.b': function () {
				toggleCollapseSidebar(!isCollapsed)
			},
			...navigationConfig.reduce<{ [key: string]: () => void }>((acc, curr) => {
				acc[String(curr.keybinding)] = function () {
					return navigate({ to: curr.path })
				}
				return acc
			}, {})
		}),
		[isCollapsed]
	)

	useKeyPress(Object.keys(keyCallbackMap), (e, key) => {
		e.preventDefault()
		keyCallbackMap[key]()
	})

	/**
	 * @private
	 */
	const _isCollapsed = useMemo(() => isCollapsed || isLargeScreen, [isCollapsed, isLargeScreen])

	if (isSmallScreen || isMediumScreen) return null

	return (
		<Div
			as='aside'
			className={cn(
				'z-50 flex h-screen flex-col overflow-y-auto overflow-x-hidden bg-background px-3 pb-6 shadow transition-width duration-200 ease-in-out scrollbar-none sm:hidden md:hidden',
				_isCollapsed ? 'w-16 items-center' : 'items-stretch xl:w-80 xxl:w-88'
			)}>
			<Link
				to='/dashboard'
				className={cn('flex h-20 items-center', !_isCollapsed ? 'gap-x-3 px-2' : 'aspect-square justify-center')}>
				<Icon name='Boxes' size={36} stroke='hsl(var(--primary))' strokeWidth={1} />
				<Div
					className={cn(
						'space-y-0.5 transition-[width_opacity]',
						_isCollapsed ? 'w-0 opacity-0 duration-150' : 'w-auto opacity-100 duration-200'
					)}>
					<AppLogo />
					<Typography variant='small' className='mt-auto flex items-center gap-x-2 text-xs text-muted-foreground'>
						{user?.company_name}
					</Typography>
				</Div>
			</Link>

			<Menu aria-expanded={_isCollapsed} role='menu'>
				{navigationConfig
					.filter((item) => item.type === 'main')
					.map((item) => (
						<MenuItem key={item.id}>
							<NavLink isCollapsed={_isCollapsed} {...item} />
						</MenuItem>
					))}
				<Separator className='my-4' />
				{navigationConfig
					.filter((item) => {
						const matches = ['/account', '/profile']
						return item.type === 'preference' && !matches.includes(item.path)
					})
					.map((item) => (
						<MenuItem role='menuItem' tabIndex={0} key={item.id}>
							<NavLink isCollapsed={_isCollapsed} {...item} />
						</MenuItem>
					))}
			</Menu>
		</Div>
	)
}

const NavLink: React.FC<NavLinkProps> = ({ isCollapsed, path, title, icon }) => {
	const { t } = useTranslation('ns_common')

	return (
		<Tooltip
			message={t(title, { defaultValue: title })}
			contentProps={{ side: 'right', hidden: !isCollapsed, sideOffset: 8, className: 'z-50' }}>
			<Link
				to={path}
				role='link'
				activeProps={{ className: 'text-primary hover:text-primary bg-primary/10' }}
				preload={false}
				className={cn(
					buttonVariants({
						variant: 'ghost',
						size: isCollapsed ? 'icon' : 'default',
						className: 'flex px-2 text-base font-normal'
					}),
					!isCollapsed ? 'justify-start gap-x-3' : 'aspect-square size-9'
				)}>
				<Icon name={icon} size={20} className='size-5 basis-5' />
				<Typography
					className={cn(
						'text-left font-medium transition-[width_opacity]',
						isCollapsed ? 'w-0 opacity-0 duration-150' : 'w-auto flex-1 opacity-100 duration-150'
					)}>
					{t(title, { defaultValue: title })}
				</Typography>
			</Link>
		</Tooltip>
	)
}

const Menu = tw.ul`flex flex-col gap-y-2 items-stretch py-6 overflow-x-hidden overflow-y-auto scrollbar-none`
const MenuItem = tw.li`whitespace-nowrap font-normal w-full [&>:first-child]:w-full`

export default NavSidebar
