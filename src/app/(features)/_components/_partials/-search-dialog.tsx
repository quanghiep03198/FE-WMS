import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
	Dialog,
	Icon,
	Typography
} from '@/components/ui'
import { navigationConfig } from '@/configs/navigation.config'
import { GearIcon, PersonIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { useKeyPress } from 'ahooks'
import { isEmpty } from 'lodash'
import React, { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'

type SearchDialogProps = Required<Pick<React.ComponentProps<typeof Dialog>, 'open' | 'onOpenChange'>>

const SearchDialog: React.FC<SearchDialogProps> = ({ open, onOpenChange: handleOpenChange }) => {
	const { t } = useTranslation('ns_common')
	const [searchTerm, setSearchTerm] = useState<string>('')

	useKeyPress('ctrl.k', (e) => {
		e.preventDefault()
		handleOpenChange(true)
	})

	return (
		<CommandDialog open={open} onOpenChange={handleOpenChange}>
			<CommandInput placeholder='Type a command or search...' onValueChange={(value) => setSearchTerm(value)} />
			<CommandEmpty>No results found.</CommandEmpty>
			<CommandList className='scrollbar'>
				{isEmpty(searchTerm) ? (
					<Fragment>
						<CommandGroup heading='Suggestions'>
							{navigationConfig.slice(0, 5).map((item) => (
								<CommandItem key={item.id} asChild>
									<Link
										className='flex items-center gap-x-2'
										to={item.path}
										onClick={() => handleOpenChange(false)}>
										<Icon name={item.icon} />
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
					</Fragment>
				) : (
					<CommandGroup heading={`Results`}>
						{navigationConfig
							.filter((item) =>
								String(t(item.title, { defaultValue: item.title }))
									.toLowerCase()
									.includes(searchTerm.toLowerCase())
							)
							.map((item) => (
								<CommandItem key={item.id} asChild>
									<Link
										className='flex items-center gap-x-2'
										to={item.path}
										onClick={() => handleOpenChange(false)}>
										<Icon name={item.icon} />
										{t(item.title, { defaultValue: item.title })}
										<CommandShortcut>{String(item.keybinding).split('.').join('+')}</CommandShortcut>
									</Link>
								</CommandItem>
							))}
						<pre>
							{JSON.stringify(
								navigationConfig.filter((item) =>
									String(t(item.title, { defaultValue: item.title }))
										.toLowerCase()
										.includes(searchTerm.toLowerCase())
								)
							)}
						</pre>
					</CommandGroup>
				)}
			</CommandList>
		</CommandDialog>
	)
}

export default SearchDialog
