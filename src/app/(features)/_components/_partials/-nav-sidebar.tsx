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
				'flex h-screen w-[inherit] flex-col overflow-y-auto overflow-x-hidden px-3 pb-6 transition-width duration-200 ease-in-out scrollbar-thin sm:hidden md:hidden',
				isCollapsed ? 'w-16 items-center' : 'w-80 items-stretch xl:max-w-96'
			)}>
			<Link
				to='/dashboard'
				className={cn('flex h-20 items-center py-8', {
					'gap-x-3 xl:px-5': !isCollapsed,
					'justify-center': isCollapsed
				})}>
				<Icon name='Box' size={32} strokeWidth={1.5} />
				<Div
					className={cn(
						'transition-[width_opacity]',
						isCollapsed ? 'w-0  opacity-0 duration-100' : 'w-full opacity-100 duration-300'
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
						const matches = ['/account', '/account']
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
			content={title}
			triggerProps={{ asChild: true }}
			contentProps={{ side: 'right', hidden: !isCollapsed, sideOffset: 8 }}>
			<Link
				to={path}
				activeProps={{ className: 'text-primary hover:text-primary bg-primary/10' }}
				className={cn(
					buttonVariants({
						variant: 'ghost',
						size: isCollapsed ? 'icon' : 'default',
						className: 'flex w-full px-2 text-base font-normal'
					}),
					!isCollapsed && 'justify-start ',
					isCollapsed && 'aspect-square'
				)}>
				<Icon name={icon} size={20} className={cn(isCollapsed ? 'basis-full' : 'basis-1/6')} />
				<Typography
					className={cn(
						'transition-[width_opacity]',
						isCollapsed
							? 'w-0 basis-0 opacity-0 duration-200'
							: 'w-full flex-1 basis-5/6 opacity-100 duration-300'
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
