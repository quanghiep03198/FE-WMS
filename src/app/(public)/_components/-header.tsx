import AppLogo from '@/app/_components/_shared/-app-logo'
import { LanguageDropdown } from '@/app/_components/_shared/-language-selector'
import ThemeToggle from '@/app/_components/_shared/-theme-toggle'
import { useAuth } from '@/common/hooks/use-auth'
import { cn } from '@/common/utils/cn'
import env from '@/common/utils/env'
import {
	Badge,
	Button,
	Div,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon,
	Tooltip,
	buttonVariants
} from '@/components/ui'
import { Link } from '@tanstack/react-router'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { navigationConfig, usePageContext } from '../_contexts/-page-context'

const Header: React.FunctionComponent = () => {
	return (
		<Div className='sticky top-0 z-20 h-16 border-b bg-gradient-to-r from-transparent via-background/95 to-transparent backdrop-blur-sm'>
			<Div
				as='nav'
				className='mx-auto flex h-full max-w-7xl items-center justify-between p-6 sm:p-4 xxl:max-w-8xl'
				aria-label='Global'>
				<NavHeaderMenuDropdown />
				<NavHeaderLogo />
				<NavHeaderMenu />
				<NavHeaderActions />
			</Div>
		</Div>
	)
}

const NavHeaderLogo: React.FC = memo(() => {
	return (
		<Div className='flex items-center gap-x-3 sm:hidden md:hidden'>
			<Icon name='Boxes' strokeWidth={1} stroke='hsl(var(--primary))' size={28} />
			<Link
				to='/'
				className='inline-flex items-center gap-x-3 text-xs font-bold transition-colors duration-200 hover:text-primary'>
				i-WMS
			</Link>
			<Badge variant='default' className='select-none'>
				{env('VITE_APP_VERSION')}
			</Badge>
		</Div>
	)
})

const NavHeaderMenu: React.FC = memo(() => {
	const { activeMenu, handleMenuClick } = usePageContext()

	return (
		<Div className='flex flex-1 items-center justify-center gap-x-2 rounded-full text-sm font-medium sm:hidden md:hidden'>
			{navigationConfig.map((item, index) => (
				<Button
					variant='link'
					key={index}
					onClick={() => handleMenuClick(index)}
					className={cn(activeMenu === item.href && 'underline')}>
					{item.title}
				</Button>
			))}
		</Div>
	)
})

const NavHeaderActions: React.FC = memo(() => {
	const { isAuthenticated } = useAuth()
	const { t } = useTranslation()

	return (
		<Div className='flex items-center justify-end gap-x-1 self-center'>
			<Tooltip
				message={t('ns_common:actions.toggle_theme')}
				triggerProps={{ className: buttonVariants({ size: 'icon', variant: 'ghost' }) }}>
				<ThemeToggle />
			</Tooltip>
			<LanguageDropdown />
			{isAuthenticated ? (
				<Link
					to='/dashboard'
					className={buttonVariants({
						variant: 'ghost',
						className: 'gap-x-2'
					})}>
					Dashboard
					<Icon name='ArrowRight' size={12} />
				</Link>
			) : (
				<Link
					to='/login'
					className={buttonVariants({
						variant: 'ghost',
						className: 'gap-x-2'
					})}>
					Log in
					<Icon name='ArrowRight' size={12} />
				</Link>
			)}
		</Div>
	)
})

const NavHeaderMenuDropdown: React.FC = memo(() => {
	const { handleMenuClick } = usePageContext()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='icon' className='hidden sm:inline-flex md:inline-flex'>
					<Icon name='Menu' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='start' className='w-60'>
				<DropdownMenuLabel asChild>
					<Link to='/' className='inline-flex items-center gap-x-3'>
						<Icon name='Boxes' strokeWidth={1} stroke='hsl(var(--primary))' size={28} />
						<AppLogo />
					</Link>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{navigationConfig.map((item, index) => (
					<DropdownMenuItem onClick={() => handleMenuClick(index)} key={index}>
						{item.title}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
})

export default memo(Header)
