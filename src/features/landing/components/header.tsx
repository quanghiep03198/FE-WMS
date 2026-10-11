import { PresetBreakPoints } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import { Div } from '@components/customs/div'
import AppLogo from '@components/shared/app-logo'
import { InstallPwaDialog } from '@components/shared/install-pwa-dialog'
import { ThemeSwitcher } from '@components/shared/theme-switcher'
import { Button, buttonVariants } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import { Label } from '@components/ui/label'
import { Separator } from '@components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@components/ui/sheet'
import useAuth from '@hooks/use-auth'
import useMediaQuery from '@hooks/use-media-query'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { navigationConfig, usePageContext } from '../contexts/page-context'

const Header: React.FunctionComponent = () => {
	return (
		<Div
			className={cn(
				'peer bg-background/90 sticky top-10 z-40 h-20 border-b p-6 bg-blend-screen backdrop-blur-2xl sm:top-16 sm:p-4'
			)}>
			<Div
				aria-label='Global'
				as='nav'
				className='xxl:max-w-8xl mx-auto flex h-full max-w-7xl items-center justify-between'>
				<Div className='inline-flex items-center gap-x-2'>
					<NavHeaderDrawerMenu />
					<Link className='group sm:zoom-[0.8]' data-state='expanded' to='/'>
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
					key={index}
					variant='link'
					className={cn(
						'text-muted-foreground text-sm transition-[colors,opacity] duration-500 hover:no-underline hover:opacity-80',
						pageContext?.activeMenu === item.href && 'text-(--primary-alt)'
					)}
					onClick={() => {
						if (typeof pageContext?.handleMenuClick === 'function') pageContext.handleMenuClick(index)
					}}>
					{item.title}
				</Button>
			))}
			<InstallPwaDialog />
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
				<Button className='hidden sm:inline-flex md:inline-flex' size='icon' variant='ghost'>
					<Icon name='Menu' />
				</Button>
			</SheetTrigger>
			<SheetContent className='max-w-full' side='top'>
				<SheetHeader>
					<Link className='text-left' to='/'>
						<AppLogo />
					</Link>
				</SheetHeader>
				<Div className='space-y-6'>
					<Div className='flex flex-col items-stretch gap-y-1 py-4'>
						{navigationConfig.map((item, index) => (
							<Button
								className='justify-start'
								key={index}
								variant='ghost'
								onClick={() => {
									if (typeof pageContext?.handleMenuClick === 'function') pageContext.handleMenuClick(index)
									setOpen(!open)
								}}>
								{item.title}
							</Button>
						))}
					</Div>
					<Separator />
					<Div className='flex items-center gap-x-6'>
						<Label className='inline-flex items-center gap-x-2'>
							<Icon className='size-4' name='SunMoon' />
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
