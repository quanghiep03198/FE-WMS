import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
	Dialog,
	DialogContent,
	Icon,
	ScrollArea,
	Typography
} from '@/components/ui'
import { navigationConfig } from '@/configs/navigation.config'
import { GearIcon, PersonIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { useKeyPress } from 'ahooks'
import React from 'react'
import { useTranslation } from 'react-i18next'

type SearchDialogProps = Required<Pick<React.ComponentProps<typeof Dialog>, 'open' | 'onOpenChange'>>

const SearchDialog: React.FC<SearchDialogProps> = ({ open, onOpenChange: handleOpenChange }) => {
	const { t } = useTranslation('ns_common')

	useKeyPress('ctrl.k', (e) => {
		e.preventDefault()
		handleOpenChange(true)
	})

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='rounded border-none p-0 text-foreground sm:max-w-md'>
				<Command className='rounded-lg border !text-foreground'>
					<CommandInput className='h-12' placeholder='Type a command or search...' />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<ScrollArea className='max-h-80'>
							<CommandGroup heading='Suggestions'>
								{navigationConfig.slice(0, 5).map((item) => (
									<CommandItem key={item.id} className='text-foreground' asChild>
										<Link to={item.path} onClick={() => handleOpenChange(false)}>
											<Icon name={item.icon} className='mr-2' />
											{t(item.title, { defaultValue: item.title })}
											<CommandShortcut>{String(item.keybinding).split('.').join('+')}</CommandShortcut>
										</Link>
									</CommandItem>
								))}
							</CommandGroup>
							<CommandSeparator />
							<CommandGroup heading='Settings'>
								<CommandItem asChild>
									<Link to='/profile'>
										<PersonIcon className='mr-2 h-4 w-4' />
										<Typography variant='small'>{t('ns_common:navigation.profile')}</Typography>
										<CommandShortcut>ctrl+alt+P</CommandShortcut>
									</Link>
								</CommandItem>
								<CommandItem asChild>
									<Link to='/appearance-settings'>
										<GearIcon className='mr-2 h-4 w-4' />
										<Typography variant='small'>{t('ns_common:navigation.settings')}</Typography>
										<CommandShortcut>ctrl+alt+S</CommandShortcut>
									</Link>
								</CommandItem>
							</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</DialogContent>
		</Dialog>
	)
}

export default SearchDialog
