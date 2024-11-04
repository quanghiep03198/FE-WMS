import { ITransferOrder, IWarehouse, IWarehouseStorage } from '@/common/types/entities'
import CellEditor, { CellEditorProps } from '@/components/ui/@react-table/components/cell-editor'
import { CellContext } from '@tanstack/react-table'
import { useGetWarehouseStorageQuery } from '../../_layout.warehouse/_apis/warehouse-storage.api'
import { useGetWarehouseQuery } from '../../_layout.warehouse/_apis/warehouse.api'
import { useEffect } from 'react'

type WarehouseCellEditorProps = CellContext<ITransferOrder, any> & 
    Pick<CellEditorProps, 'transformedValue'> & {
        className?: string; 
    };

type StorageCellEditorProps = CellContext<ITransferOrder, any> &
	Pick<CellEditorProps, 'transformedValue'> & { selectedWarehouse: string }

	const warehouseLabelTemplate = (warehouse: IWarehouse) => {
		return `${warehouse.warehouse_num} - ${warehouse.warehouse_name}`;
	};

export const WarehouseCellEditor: React.FC<WarehouseCellEditorProps> = (props) => {
	const { data: warehouseLists } = useGetWarehouseQuery<IWarehouse[]>({
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : [])
	})

	return (
		<CellEditor
			{...props}
			transformedValue={props.transformedValue}
			cellEditorVariant='select'
			className={props.className}
			cellEditorProps={{
				data: warehouseLists,
				labelField: 'warehouse_name',
				valueField: 'warehouse_num',
				template: warehouseLabelTemplate
			}}
		/>
	)
}


const storageLabelTemplate = (storage: IWarehouseStorage) => {
	return `${storage.storage_num} - ${storage.some_other_field}`; // Thay đổi cho phù hợp với các trường bạn muốn
};

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
				valueField: 'storage_num',
				template: storageLabelTemplate 
			}}
		/>
	)
}
