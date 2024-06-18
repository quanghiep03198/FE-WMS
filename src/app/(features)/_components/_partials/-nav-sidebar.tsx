import { cn } from '@/common/utils/cn'
import { Div, Icon, Separator, Tooltip, Typography, buttonVariants } from '@/components/ui'
import { navigationConfig, type NavigationConfig } from '@/configs/navigation.config'
import { Link, Route, ToPathOption, redirect, useNavigate } from '@tanstack/react-router'
import { useKeyPress } from 'ahooks'
import { KeyType } from 'ahooks/lib/useKeyPress'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import AppLogo from '../../../_components/_shared/-app-logo'

type SidebarProps = {
	isCollapsed: boolean
	onCollapsedChange: React.Dispatch<React.SetStateAction<boolean>>
}

type NavLinkProps = { isCollapsed: boolean } & Pick<NavigationConfig, 'path' | 'title' | 'icon'>

const NavSidebar: React.FC<SidebarProps> = ({ isCollapsed, onCollapsedChange: toggleCollapseSidebar }) => {
	const navigate = useNavigate()

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

	return (
		<Div
			as='aside'
			className={cn(
				'z-30 flex h-screen flex-col overflow-y-auto overflow-x-hidden px-3 pb-6 transition-width duration-200 ease-in-out scrollbar-thin sm:hidden md:hidden',
				isCollapsed ? 'w-16 items-center' : 'w-80 items-stretch'
			)}>
			<Link
				to='/dashboard'
				className={cn('flex h-20 items-center', !isCollapsed ? 'gap-x-3 px-2' : 'aspect-square justify-center')}>
				<Icon name='Boxes' size={32} stroke='hsl(var(--primary))' className='size-8' strokeWidth={1} />
				<Div
					className={cn(
						'transition-[width_opacity]',
						isCollapsed ? 'w-0 opacity-0 duration-150' : 'w-auto opacity-100 duration-200'
					)}>
					<AppLogo />
				</Div>
			</Link>
			<Menu>
				{navigationConfig
					.filter((item) => item.type === 'main')
					.map((item) => (
						<MenuItem key={item.id}>
							<NavLink isCollapsed={isCollapsed} {...item} />
						</MenuItem>
					))}
				<Separator className='my-4' />
				{navigationConfig
					.filter((item) => {
						const matches = ['/account', '/profile']
						return item.type === 'preference' && !matches.includes(item.path)
					})
					.map((item) => (
						<MenuItem key={item.id}>
							<NavLink isCollapsed={isCollapsed} {...item} />
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
			contentProps={{ side: 'right', hidden: !isCollapsed, sideOffset: 8 }}>
			<Link
				to={path}
				activeProps={{ className: 'text-primary hover:text-primary bg-primary/10' }}
				className={cn(
					buttonVariants({
						variant: 'ghost',
						size: isCollapsed ? 'icon' : 'default',
						className: 'flex px-2 text-base font-normal'
					}),
					!isCollapsed ? 'justify-start gap-x-3' : 'aspect-square size-9'
				)}>
				<Icon name={icon} size={20} />
				<Typography
					className={cn(
						'text-left font-medium transition-[width_opacity]',
						isCollapsed ? 'w-0 opacity-0 duration-150' : 'w-auto opacity-100 duration-300'
					)}>
					{t(title, { defaultValue: title })}
				</Typography>
			</Link>
		</Tooltip>
	)
}

const Menu = tw.ul`flex flex-col gap-y-2 items-stretch py-6`
const MenuItem = tw.li`whitespace-nowrap font-normal w-full [&>:first-child]:w-full`

export default NavSidebar
