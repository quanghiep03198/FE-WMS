import ErrorBoundary from '@/app/_components/_errors/-error-boundary'
import { Badge, DataTable, Div, Separator, Typography } from '@/components/ui'
import { NavigationConfig, navigationConfig } from '@/configs/navigation.config'
import { createLazyFileRoute } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

type CommandList = Pick<NavigationConfig, 'id' | 'title' | 'keybinding'>[]

export const Route = createLazyFileRoute('/(preferences)/_layout/keybindings/')({
	component: KeybindingsPage
})

function KeybindingsPage() {
	const { t } = useTranslation<'ns_common', undefined>('ns_common')

	const navigationCommands = navigationConfig
		.map((item) => ({
			..._.pick(item, ['id', 'title', 'keybinding']),
			title: t(item.title, { defaultValue: item.title }),
			keybinding: String(item.keybinding).split('.').join('+')
		}))
		.concat() as CommandList

	const extendedCommands = [
		{
			title: t('actions.toggle_theme', { defaultValue: null }),
			keybinding: 'ctrl+alt+t'
		},
		{
			title: t('actions.logout', { defaultValue: null }),
			keybinding: 'ctrl+q'
		}
	].map((item, index) => ({ ...item, id: navigationConfig.length + index + 1 })) as CommandList

	const columnHelper = createColumnHelper<Pick<NavigationConfig, 'id' | 'title' | 'keybinding'>>()

	const columns = [
		columnHelper.accessor('id', {
			header: 'ID',
			enableSorting: true,
			maxSize: 64
		}),
		columnHelper.accessor('title', {
			header: t('ns_common:function'),
			enableSorting: true,
			enableColumnFilter: true,
			filterFn: 'equals'
		}),
		columnHelper.accessor('keybinding', {
			header: t('ns_common:navigation.keyboard_shortcut'),
			enableSorting: true,
			enableColumnFilter: true,
			filterFn: 'weakEquals',
			cell: ({ getValue }) => (
				<Badge variant='secondary' className='font-mono'>
					{getValue()}
				</Badge>
			)
		})
	]

	return (
		<Div className='space-y-6'>
			<Div className='space-y-2'>
				<Typography variant='h5'>Keybindings</Typography>
				<Typography variant='small' color='muted'>
					Manage your keybindings
				</Typography>
			</Div>
			<Separator />
			<DataTable data={navigationCommands.concat(extendedCommands)} enableColumnResizing columns={columns} />
		</Div>
	)
}
