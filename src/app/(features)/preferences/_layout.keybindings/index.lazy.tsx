import { Badge, Div, Separator } from '@/components/ui'
import DataTable from '@/components/ui/@react-table'
import { fuzzySort } from '@/components/ui/@react-table/utils/fuzzy-sort.util'
import { NavigationConfig, navigationConfig } from '@/configs/navigation.config'
import { createLazyFileRoute } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../../_components/_shared/-page-header'

type CommandList = Pick<NavigationConfig, 'id' | 'title' | 'keybinding'>[]

export const Route = createLazyFileRoute('/(features)/preferences/_layout/keybindings/')({
	component: KeybindingsPage
})

function KeybindingsPage() {
	const { t } = useTranslation<'ns_common', undefined>('ns_common')

	const navigationCommands = navigationConfig
		.map((item, index) => ({
			id: String(index + 1),
			title: t(item.title, { defaultValue: item.title }),
			keybinding: String(item.keybinding).split('.').join(' + ')
		}))
		.concat() as CommandList

	const extendedCommands = [
		{
			title: t('actions.toggle_theme', { defaultValue: null }),
			keybinding: 'ctrl + alt + t'
		},
		{
			title: t('actions.logout', { defaultValue: null }),
			keybinding: 'ctrl + q'
		}
	].map((item, index) => ({ ...item, id: String(navigationConfig.length + index + 1) })) as CommandList

	const columnHelper = createColumnHelper<Pick<NavigationConfig, 'id' | 'title' | 'keybinding'>>()

	const columns = [
		columnHelper.accessor('id', {
			header: '#',
			enableSorting: true,
			enableResizing: false,
			sortingFn: fuzzySort,
			size: 64
		}),
		columnHelper.accessor('title', {
			header: t('ns_common:settings.function'),
			enableSorting: true,
			enableColumnFilter: true,
			filterFn: 'fuzzy',
			sortingFn: fuzzySort,
			minSize: 240
		}),
		columnHelper.accessor('keybinding', {
			header: t('ns_common:navigation.keyboard_shortcut'),
			enableSorting: true,
			enableColumnFilter: true,
			enableResizing: true,
			filterFn: 'fuzzy',
			sortingFn: fuzzySort,
			minSize: 240,
			cell: ({ getValue }) => (
				<Badge variant='secondary'>
					<kbd>{getValue()}</kbd>
				</Badge>
			)
		})
	]

	return (
		<Div className='space-y-6'>
			<PageHeader>
				<PageTitle>{t('ns_common:navigation.keyboard_shortcut')}</PageTitle>
				<PageDescription>{t('ns_preference:captions.keybindings')}</PageDescription>
			</PageHeader>
			<Separator />
			<DataTable
				data={navigationCommands.concat(extendedCommands)}
				enableColumnResizing
				columns={columns}
				containerProps={{ className: 'xxl:h-[50vh]' }}
			/>
		</Div>
	)
}
