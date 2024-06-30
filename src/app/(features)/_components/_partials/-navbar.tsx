import { Badge, Button, Div, Icon, Separator, Tooltip, Typography, buttonVariants } from '@/components/ui'
import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageDropdown } from '@/app/_components/_shared/-language-selector'
import NavUserControl from './-nav-user-controller'
import SearchDialog from './-search-dialog'
import ThemeToggle from '../../../_components/_shared/-theme-toggle'
import { NavBreadcrumb } from './-nav-breadcrumb'
import NavDrawerSidebar from './-nav-drawer-sidebar'
import useMediaQuery from '@/common/hooks/use-media-query'
import { BreakPoints } from '@/common/constants/enums'
import { useKeyPress, useResponsive } from 'ahooks'
import useAuth from '@/common/hooks/use-auth'

type NavbarProps = {
	isCollapsed: boolean
	onCollapseStateChange: React.Dispatch<React.SetStateAction<boolean>>
}

const Navbar: React.FC<NavbarProps> = ({ isCollapsed, onCollapseStateChange }) => {
	const [open, setOpen] = React.useState<boolean>(false)
	const { t } = useTranslation()
	const { logout } = useAuth()
	const isSmallScreen = useMediaQuery(BreakPoints.SMALL)
	const isLargeScreen = useMediaQuery(BreakPoints.LARGE)

	useKeyPress('ctrl.q', (e) => {
		e.preventDefault()
		logout()
	})

	return (
		<Fragment>
			<Div as='header' role='menubar' className='sticky top-0 z-50 bg-background/80 px-6 py-4 backdrop-blur sm:px-2'>
				<Div
					as='nav'
					role='menu'
					className='flex items-center justify-between rounded border border-border bg-background px-3 py-2 shadow'>
					<Div role='group' className='flex items-center gap-x-4'>
						<Tooltip
							message={`${t('ns_common:actions.toggle_sidebar')} (ctrl+b)`}
							triggerProps={{ asChild: true }}
							contentProps={{ side: 'bottom', align: 'start' }}>
							<Button
								size='icon'
								role='searchbox'
								variant='ghost'
								disabled={isLargeScreen}
								aria-expanded={isCollapsed}
								onClick={() => onCollapseStateChange(!isCollapsed)}>
								<Icon name='Menu' />
							</Button>
						</Tooltip>
						<Separator orientation='vertical' className='h-5 w-1 sm:hidden md:hidden' />
						<NavBreadcrumb />
					</Div>

					<Div role='group' className='flex flex-1 items-center justify-end gap-x-2'>
						<Button
							variant='outline'
							size={isSmallScreen ? 'icon' : 'default'}
							className='basis-56 gap-x-2 px-2 sm:basis-auto'
							onClick={() => setOpen(!open)}>
							<Icon name='Search' />
							<Typography variant='small' className='sm:hidden'>
								Search ...
							</Typography>
							<Badge variant='secondary' className='ml-auto font-mono font-normal tracking-widest sm:hidden'>
								ctrl+k
							</Badge>
						</Button>
						<LanguageDropdown triggerProps={{ variant: 'ghost' }} />
						<ThemeToggle />
						<NavUserControl />
					</Div>
				</Div>
			</Div>

			<NavDrawerSidebar open={!isCollapsed} onOpenStateChange={onCollapseStateChange} />
			<SearchDialog open={open} onOpenChange={setOpen} />
		</Fragment>
	)
}

export default Navbar
