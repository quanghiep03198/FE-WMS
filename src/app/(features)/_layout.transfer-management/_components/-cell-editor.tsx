import { ITransferOrder, IWarehouse, IWarehouseStorage } from '@/common/types/entities'
import CellEditor, { CellEditorProps } from '@/components/ui/@react-table/components/cell-editor'
import { CellContext } from '@tanstack/react-table'
import { useGetWarehouseStorageQuery } from '../../_layout.warehouse/_apis/warehouse-storage.api'
import { useGetWarehouseQuery } from '../../_layout.warehouse/_apis/warehouse.api'

type WarehouseCellEditorProps = CellContext<ITransferOrder, any> & Pick<CellEditorProps, 'transformedValue'>

type StorageCellEditorProps = CellContext<ITransferOrder, any> &
	Pick<CellEditorProps, 'transformedValue'> & { selectedWarehouse: string }

export const WarehouseCellEditor: React.FC<WarehouseCellEditorProps> = (props) => {
	const { data: warehouseLists } = useGetWarehouseQuery<IWarehouse[]>({
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : [])
	})

	return (
		<CellEditor
			{...props}
			transformedValue={props.transformedValue}
			cellEditorVariant='select'
			cellEditorProps={{
				data: warehouseLists,
				labelField: 'warehouse_name',
				valueField: 'warehouse_num'
			}}
		/>
	)
}

export const StorageCellEditor: React.FC<StorageCellEditorProps> = (props) => {
	const { data } = useGetWarehouseStorageQuery<IWarehouseStorage[]>(props.selectedWarehouse, {
		select: (response) => {
			return Array.isArray(response.metadata) ? response.metadata : []
		}
	})

	return (
		<CellEditor
			{...props}
			cellEditorVariant='select'
			cellEditorProps={{
				data,
				labelField: 'storage_name',
				valueField: 'storage_num'
			}}
		/>
	)
}
