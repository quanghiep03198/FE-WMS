import { Badge, Button, Div, Icon, Separator, Tooltip, Typography, buttonVariants } from '@/components/ui'
import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageDropdown } from '@/app/_components/_shared/-language-selector'
import NavUserControl from './-nav-user-controller'
import SearchDialog from './-search-dialog'
import ThemeToggle from '../../../_components/_shared/-theme-toggle'
import { NavBreadcrumb } from './-nav-breadcrumb'
import NavDrawerSidebar from './-nav-drawer-sidebar'

type NavbarProps = {
	isCollapsed: boolean
	onCollapseStateChange: React.Dispatch<React.SetStateAction<boolean>>
}

const Navbar: React.FC<NavbarProps> = ({ isCollapsed, onCollapseStateChange }) => {
	const [open, setOpen] = React.useState(false)
	const { t } = useTranslation()

	return (
		<Fragment>
			<Div as='nav' className='sticky top-0 z-50 bg-background/80 p-4 backdrop-blur-sm'>
				<Div className='flex items-center justify-between rounded border border-border bg-inherit px-3 py-2'>
					<Div className='flex items-center gap-x-4'>
						<Tooltip
							message={`${t('ns_common:actions.toggle_sidebar')} (ctrl+b)`}
							contentProps={{ side: 'bottom', align: 'start' }}>
							<Button
								size='icon'
								variant='outline'
								aria-expanded={isCollapsed}
								onClick={() => onCollapseStateChange(!isCollapsed)}>
								<Icon name='Menu' />
							</Button>
						</Tooltip>
						<Separator orientation='vertical' className='h-5 w-1' />
						<NavBreadcrumb />
					</Div>

					<Div className='flex flex-1 items-center justify-end gap-x-2'>
						<Button
							variant='outline'
							aria-modal={open}
							className='basis-48 justify-between px-1'
							onClick={() => setOpen(!open)}>
							<Typography variant='small' className='inline-flex flex-1 items-center gap-x-2 px-2'>
								<Icon name='Search' />
								Search ...
							</Typography>

							<Badge variant='secondary' className='font-mono font-normal tracking-widest'>
								ctrl+k
							</Badge>
						</Button>

						<LanguageDropdown triggerProps={{ variant: 'outline' }} />
						<Tooltip
							message={t('ns_common:actions.toggle_theme')}
							triggerProps={{ className: buttonVariants({ size: 'icon', variant: 'outline' }) }}>
							<ThemeToggle variant='outline' />
						</Tooltip>
						<NavUserControl />
					</Div>
				</Div>
			</Div>
			<NavDrawerSidebar open={isCollapsed} onOpenStateChange={onCollapseStateChange} />
			<SearchDialog open={open} onOpenChange={setOpen} />
		</Fragment>
	)
}

export default Navbar
