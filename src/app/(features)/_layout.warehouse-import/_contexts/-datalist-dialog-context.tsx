import { RowSelectionState } from '@tanstack/react-table'
import { createContext, useContext, useState } from 'react'
import { ImportOrderValue } from '../_schemas/import-order.schema'

type TDatalistContext = {
	importOrderValue: ImportOrderValue
	setImportOrderValue: React.Dispatch<React.SetStateAction<ImportOrderValue>>
	importOrderDetailValue: Array<any>
	setImportOrderDetailValue: React.Dispatch<React.SetStateAction<Array<any>>>
	selectedOrderDetailRows: RowSelectionState
	setSelectedOrderDetailRows: React.Dispatch<React.SetStateAction<RowSelectionState>>
}

const DatalistDialogContext = createContext<TDatalistContext>(null)

export const DatalistDialogProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [importOrderValue, setImportOrderValue] = useState<ImportOrderValue>(null)
	const [importOrderDetailValue, setImportOrderDetailValue] = useState<Array<any>>([])
	const [selectedOrderDetailRows, setSelectedOrderDetailRows] = useState<RowSelectionState>()
	return (
		<DatalistDialogContext.Provider
			value={{
				importOrderValue,
				setImportOrderValue,
				importOrderDetailValue,
				setImportOrderDetailValue,
				selectedOrderDetailRows,
				setSelectedOrderDetailRows
			}}>
			{children}
		</DatalistDialogContext.Provider>
	)
}

export const useDatalistDialogContext = () => useContext(DatalistDialogContext)
