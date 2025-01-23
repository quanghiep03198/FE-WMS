import React from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '..'

type ConfirmDialogProps = {
	open: boolean
	title: string
	description: string
	onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>
	onConfirm: (...args: any[]) => unknown
	onCancel?: (...args: any[]) => unknown
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	open,
	title,
	description,
	onOpenChange,
	onConfirm,
	onCancel
}) => {
	const { t } = useTranslation()

	return createPortal(
		<AlertDialog
			open={open}
			onOpenChange={(open) => {
				if (typeof onOpenChange === 'function') onOpenChange(open)
			}}>
			<AlertDialogContent>
				<AlertDialogHeader className='text-left'>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel
						onClick={() => {
							onOpenChange(!open)
							if (onCancel && typeof onCancel === 'function') onCancel()
						}}>
						{t('ns_common:actions.cancel')}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							if (onConfirm) onConfirm()
						}}>
						{t('ns_common:actions.confirm')}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>,
		document.body
	)
}

export default ConfirmDialog
