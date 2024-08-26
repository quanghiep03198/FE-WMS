import AppLogo from '@/app/_components/_shared/-app-logo'
import { LanguageDropdown, LanguageSelect } from '@/app/_components/_shared/-language-selector'
import ThemeDropdownSelect from '@/app/_components/_shared/-theme-dropdown-select'
import ThemeToggle from '@/app/_components/_shared/-theme-toggle'
import { PresetBreakPoints } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import env from '@/common/utils/env'
import {
	Badge,
	Button,
	Div,
	Icon,
	Label,
	Separator,
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
	Tooltip,
	buttonVariants
} from '@/components/ui'
import { Link } from '@tanstack/react-router'
import { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { navigationConfig, usePageContext } from '../_contexts/-page-context'

const Header: React.FunctionComponent = () => {
	return (
		<Div className='sticky top-0 z-20 h-16 border-b bg-gradient-to-r from-transparent via-background/95 to-transparent backdrop-blur-sm'>
			<Div
				as='nav'
				className='mx-auto flex h-full max-w-7xl items-center justify-between p-6 sm:p-4 xxl:max-w-8xl'
				aria-label='Global'>
				<Div className='inline-flex items-center gap-x-2'>
					<NavHeaderDrawerMenu />
					<NavHeaderLogo />
				</Div>
				<NavHeaderMenu />
				<NavHeaderActions />
			</Div>
		</Div>
	)
}

const NavHeaderLogo: React.FC = memo(() => {
	return (
		<Div className='flex items-center gap-x-3'>
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
			<Div className='hidden lg:block xl:block'>
				<Tooltip
					message={t('ns_common:actions.toggle_theme')}
					triggerProps={{ className: buttonVariants({ size: 'icon', variant: 'ghost' }) }}>
					<ThemeToggle />
				</Tooltip>
			</Div>
			<Div className='hidden lg:block xl:block'>
				<LanguageDropdown />
			</Div>
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

const NavHeaderDrawerMenu: React.FC = memo(() => {
	const { handleMenuClick } = usePageContext()
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
			<SheetContent className='max-w-sm'>
				<SheetHeader>
					<Link to='/' className='inline-flex items-center gap-x-3'>
						<Icon name='Boxes' strokeWidth={1} stroke='hsl(var(--primary))' size={24} />
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
									handleMenuClick(index)
									setOpen(!open)
								}}
								key={index}>
								{item.title}
							</Button>
						))}
					</Div>
					<Separator />
					<Div className='items-center gap-x-2 space-y-1.5'>
						<Div className='grid grid-cols-[35%_auto] items-center gap-x-6'>
							<Label className='inline-flex items-center gap-x-2 text-sm'>
								<Icon name='Languages' className='size-4' />
								Language
							</Label>
							<LanguageSelect />
						</Div>
						<Div className='grid grid-cols-[35%_auto] items-center gap-x-6'>
							<Label className='inline-flex items-center gap-x-2 text-sm'>
								<Icon name='SunMoon' className='size-4' />
								Theme
							</Label>
							<ThemeDropdownSelect />
						</Div>
					</Div>
				</Div>
			</SheetContent>
		</Sheet>
	)
})

export default memo(Header)
