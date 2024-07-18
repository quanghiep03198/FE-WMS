import { ITransferOrder } from '@/common/types/entities'
import { create } from 'zustand'

type PageStore = {
	datalistDialogOpen: boolean
	toggleDatalistDialogOpen: () => void
	formDialogOpen: boolean
	toggleFormDialogOpen: () => void
	sheetPanelFormOpen: boolean
	toggleSheetPanelFormOpen: () => void
	currentOrder: Pick<ITransferOrder, 'transfer_order_code' | 'or_no'>
	setCurrentOrder: (currentOrder: Pick<ITransferOrder, 'transfer_order_code' | 'or_no'>) => void
}

export const usePageStore = create<PageStore>((set) => ({
	datalistDialogOpen: false,
	formDialogOpen: false,
	currentOrder: null,
	sheetPanelFormOpen: false,
	toggleDatalistDialogOpen: () => set((state) => ({ ...state, datalistDialogOpen: !state.datalistDialogOpen })),
	toggleFormDialogOpen: () => set((state) => ({ ...state, formDialogOpen: !state.formDialogOpen })),
	toggleSheetPanelFormOpen: () => set((state) => ({ ...state, sheetPanelFormOpen: !state.sheetPanelFormOpen })),
	setCurrentOrder: (currentOrder: Pick<ITransferOrder, 'transfer_order_code' | 'or_no'>) =>
		set((state) => ({ ...state, currentOrder }))
}))
