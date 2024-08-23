import {
	Button,
	Checkbox,
	DataTable,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Div,
	Icon,
	Tooltip
} from '@/components/ui'
import { ROW_SELECTION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { fuzzySort } from '@/components/ui/@react-table/utils/fuzzy-sort.util'
import { CheckedState } from '@radix-ui/react-checkbox'
import { createColumnHelper } from '@tanstack/react-table'
import { useResetState } from 'ahooks'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetProductionImportDatalistQuery } from '../_apis/use-warehouse-import.api'

type Props = {}

const ImportDataListDialog = (props: Props) => {
	const { t, i18n } = useTranslation()
	const [rowSelectionType, setRowSelectionType, resetRowSelectionType] = useResetState(undefined)
	const { data, refetch } = useGetProductionImportDatalistQuery()
	const columnHelper = createColumnHelper()

	const columns = useMemo(
		() => [
			columnHelper.display({
				id: ROW_SELECTION_COLUMN_ID,
				header: ({ table }) => {
					const checked =
						table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
					return (
						<Checkbox
							role='checkbox'
							checked={checked as CheckedState}
							onCheckedChange={(checkedState) => {
								setRowSelectionType('multiple')
								table.toggleAllPageRowsSelected(!!checkedState)
							}}
						/>
					)
				},
				cell: ({ row }) => (
					<Checkbox
						aria-label='Select row'
						role='checkbox'
						checked={row.getIsSelected()}
						onCheckedChange={(checkedState) => {
							if (checkedState) setRowSelectionType('multiple')
							row.toggleSelected(Boolean(checkedState))
						}}
					/>
				),
				size: 50,
				enableSorting: false,
				enableHiding: false,
				enableResizing: false,
				enablePinning: false
			}),
			columnHelper.accessor('brand_name', {
				id: 'brand_name',
				header: t('ns_erp:fields.brand_name'),
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('mo_no', {
				id: 'mo_no',
				header: t('ns_inoutbound:fields.mo_no'),
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('or_no', {
				id: 'or_no',
				header: t('ns_inoutbound:fields.or_no'),
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('or_custpoone', {
				id: 'or_custpoone',
				header: t('ns_inoutbound:fields.or_custpoone', { defaultValue: 'Customer order code' }),
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				filterFn: 'fuzzy'
			})
		],
		[i18n.language]
	)

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size='sm'>
					<Icon name='CirclePlus' role='img' /> {t('ns_common:actions.add')}
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-7xl'>
				<DialogHeader>
					<DialogTitle>Production Import Datalist</DialogTitle>
					<DialogDescription>Pick data from the table below in order to insert new import order</DialogDescription>
				</DialogHeader>
				<Div className='space-y-6'>
					<DataTable
						columns={columns}
						data={data}
						toolbarProps={{
							slot: ({ table }) => (
								<Fragment>
									{table.getIsSomeRowsSelected() && (
										<Tooltip message={t('ns_common:actions.delete')} triggerProps={{ asChild: true }}>
											<Button variant='destructive' size='icon'>
												<Icon name='Trash2' />
											</Button>
										</Tooltip>
									)}
									<Tooltip message={t('ns_common:actions.reload')}>
										<Button variant='outline' size='icon' onClick={() => refetch()}>
											<Icon name='RotateCw' />
										</Button>
									</Tooltip>
								</Fragment>
							)
						}}
					/>
				</Div>
			</DialogContent>
		</Dialog>
	)
}

export default ImportDataListDialog
