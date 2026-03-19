import AppLogo from '@/app/-components/-shared/app-logo'
import { ThemeSwitcher } from '@/app/-components/-shared/theme-switcher'
import { PresetBreakPoints } from '@/common/constants/enums'
import useAuth from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import {
	Button,
	Div,
	Icon,
	Label,
	Separator,
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
	buttonVariants
} from '@/components/ui'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { navigationConfig, usePageContext } from '../-contexts/page-context'

const Header: React.FunctionComponent = () => {
	return (
		<Div
			className={cn(
				'peer sticky top-10 z-40 h-20 border-b bg-background/90 p-6 bg-blend-screen backdrop-blur-2xl sm:top-16 sm:p-4'
			)}>
			<Div
				as='nav'
				className='mx-auto flex h-full max-w-7xl items-center justify-between xxl:max-w-8xl'
				aria-label='Global'>
				<Div className='inline-flex items-center gap-x-2'>
					<NavHeaderDrawerMenu />
					<Link to='/' className='group sm:[zoom:0.8]' data-state='expanded'>
						<AppLogo />
					</Link>
				</Div>
				<NavHeaderMenu />
				<NavHeaderActions />
			</Div>
		</Div>
	)
}

const NavHeaderMenu: React.FC = () => {
	const pageContext = usePageContext()

	return (
		<Div className='flex flex-1 items-center justify-center gap-x-1 rounded-full sm:hidden md:hidden'>
			{navigationConfig.map((item, index) => (
				<Button
					variant='link'
					key={index}
					onClick={() => {
						if (typeof pageContext?.handleMenuClick === 'function') pageContext.handleMenuClick(index)
					}}
					className={cn(
						'text-sm text-muted-foreground transition-[colors,opacity] duration-500 hover:no-underline hover:opacity-80',
						pageContext?.activeMenu === item.href && 'text-[var(--primary-alt)]'
					)}>
					{item.title}
				</Button>
			))}
		</Div>
	)
}

const NavHeaderActions: React.FC = () => {
	const { isAuthenticated } = useAuth()

	return (
		<Div className='flex items-center justify-end gap-x-1 self-center *:text-sm sm:gap-0 md:gap-0'>
			{isAuthenticated ? (
				<Link
					to='/dashboard'
					className={buttonVariants({
						variant: 'ghost',
						className: 'gap-x-2'
					})}>
					<Icon name='Blocks' size={20} strokeWidth={1.5} />
					Dashboard
					<ArrowRightIcon />
				</Link>
			) : (
				<Link
					to='/login'
					className={buttonVariants({
						variant: 'ghost',
						className: 'gap-x-2'
					})}>
					<Icon name='User' size={18} />
					Log in
					<Icon name='ArrowRight' size={12} />
				</Link>
			)}
		</Div>
	)
}

const NavHeaderDrawerMenu: React.FC = () => {
	const pageContext = usePageContext()
	const [open, setOpen] = useState(false)
	const isSmallScreen = useMediaQuery(PresetBreakPoints.SMALL)

	useEffect(() => {
		if (!isSmallScreen) setOpen(false)
	}, [isSmallScreen])

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant='ghost' size='icon' className='hidden sm:inline-flex md:inline-flex'>
					<Icon name='Menu' />
				</Button>
			</SheetTrigger>
			<SheetContent className='max-w-full' side='top'>
				<SheetHeader>
					<Link to='/' className='text-left'>
						<AppLogo />
					</Link>
				</SheetHeader>
				<Div className='space-y-6'>
					<Div className='flex flex-col items-stretch gap-y-1 py-4'>
						{navigationConfig.map((item, index) => (
							<Button
								variant='ghost'
								className='justify-start'
								onClick={() => {
									if (typeof pageContext?.handleMenuClick === 'function') pageContext.handleMenuClick(index)
									setOpen(!open)
								}}
								key={index}>
								{item.title}
							</Button>
						))}
					</Div>
					<Separator />
					<Div className='flex items-center gap-x-6'>
						<Label className='inline-flex items-center gap-x-2'>
							<Icon name='SunMoon' className='size-4' />
							Theme
						</Label>
						<ThemeSwitcher />
					</Div>
				</Div>
			</SheetContent>
		</Sheet>
	)
}

export default Header
