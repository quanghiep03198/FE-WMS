import React, { memo } from 'react'
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
import { useTranslation } from 'react-i18next'

type ConfirmDialogProps = {
	open: boolean
	title: string
	description: string
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
	onConfirm: (...args: any[]) => unknown
	onCancel?: (...args: any[]) => unknown
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
	const { t } = useTranslation()

	return (
		<AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader className='text-left'>
					<AlertDialogTitle>{props.title}</AlertDialogTitle>
					<AlertDialogDescription>{props.description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => props.onOpenChange(!props.open)}>
						{t('ns_common:actions.cancel')}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							if (props.onConfirm) props.onConfirm()
						}}>
						{t('ns_common:actions.submit')}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default memo(ConfirmDialog)
