import { LanguageDropdown } from '@/app/_components/_shared/-language-selector'
import { PresetBreakPoints } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import { Badge, Button, buttonVariants, Div, Icon, Separator, Tooltip, Typography } from '@/components/ui'
import { useKeyPress } from 'ahooks'
import React, { Fragment, memo } from 'react'
import { useTranslation } from 'react-i18next'
import ThemeToggle from '../../../_components/_shared/-theme-toggle'
import NavBreadcrumb from './-nav-breadcrumb'
import NavDrawerSidebar from './-nav-drawer-sidebar'
import NavUserControl from './-nav-user-controller'
import SearchDialog from './-search-dialog'

const Navbar: React.FC = () => {
	const [open, setOpen] = React.useState<boolean>(false)
	const { logout } = useAuth()

	const isSmallScreen = useMediaQuery(PresetBreakPoints.SMALL)

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
					className='flex items-center justify-between rounded-md border border-border bg-background px-3 py-2'>
					<Div role='group' className='flex items-center gap-x-4'>
						<ToggleSidebarButton />
						<NavDrawerSidebar />
						<Separator orientation='vertical' className='hidden h-5 w-1 xl:block' />
						<NavBreadcrumb />
					</Div>

					<Div role='group' className='flex flex-1 items-center justify-end gap-x-2'>
						<Button
							variant={isSmallScreen ? 'ghost' : 'outline'}
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

			<SearchDialog open={open} onOpenChange={setOpen} />
		</Fragment>
	)
}

const ToggleSidebarButton = memo(() => {
	const { t } = useTranslation()

	return (
		<Tooltip
			message={`${t('ns_common:actions.toggle_sidebar')} (ctrl+b)`}
			triggerProps={{ asChild: true }}
			contentProps={{ side: 'bottom', align: 'start' }}>
			<label
				htmlFor='sidebar-toggle'
				className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'hidden xl:inline-flex')}>
				<Icon name='Menu' />
			</label>
		</Tooltip>
	)
})

export default memo(Navbar)
