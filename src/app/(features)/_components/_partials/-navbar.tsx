import { LanguageDropdown } from '@/app/_components/_shared/-language-selector'
import { PresetBreakPoints } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import { Badge, Button, Div, Icon, Separator, Tooltip, Typography, useSidebar } from '@/components/ui'
import { useKeyPress } from 'ahooks'
import React, { Fragment, memo } from 'react'
import { useTranslation } from 'react-i18next'
import ThemeToggle from '../../../_components/_shared/-theme-toggle'
import NavBreadcrumb from './-nav-breadcrumb'
import NavUserControl from './-nav-user-controller'
import Notification from './-notifications'
import SearchDialog from './-search-dialog'

const Navbar: React.FC = () => {
	const [open, setOpen] = React.useState<boolean>(false)
	const { logout } = useAuth()
	const { t } = useTranslation()
	const { toggleSidebar } = useSidebar()
	const isSmallScreen = useMediaQuery(PresetBreakPoints.SMALL)

	useKeyPress('ctrl.q', (e) => {
		e.preventDefault()
		logout()
	})

	return (
		<Fragment>
			<Div
				as='header'
				role='menubar'
				className='sticky top-0 z-50 flex items-center bg-background/80 px-6 backdrop-blur sm:px-4'>
				<Div
					as='nav'
					role='menu'
					className='flex w-full basis-full items-center justify-between rounded-md border border-border bg-background px-3 py-2'>
					<Div role='group' className='flex items-center gap-x-4'>
						<Tooltip
							message={`${t('ns_common:actions.toggle_sidebar')} (ctrl+b)`}
							triggerProps={{ asChild: true }}
							contentProps={{ side: 'bottom', align: 'start' }}>
							<Button variant='ghost' size='icon' onClick={toggleSidebar} role='button' aria-label='Menu'>
								<Icon name='Menu' />
							</Button>
						</Tooltip>
						{/* <NavDrawerSidebar /> */}
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
						<Notification />
						<NavUserControl />
					</Div>
				</Div>
			</Div>

			<SearchDialog open={open} onOpenChange={setOpen} />
		</Fragment>
	)
}

export default memo(Navbar)
