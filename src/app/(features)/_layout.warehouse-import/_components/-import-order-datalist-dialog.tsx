import {
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Div,
	Icon
} from '@/components/ui'
import { Stepper, TStep } from '@/components/ui/@custom/step'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DatalistDialogProvider } from '../_contexts/-datalist-dialog-context'
import BaseDatalistForm from './-base-datalist-form'
import OrderDetailsDatalist from './-base-datalist-import-table'
import OrderPreview from './-order-preview'

type Props = {}

const ImportDataListDialog = (props: Props) => {
	const { t, i18n } = useTranslation()

	const steps: TStep[] = useMemo(
		() => [
			{
				name: 'Create new order',
				status: 'current'
			},
			{
				name: 'Import order details',
				status: 'upcoming'
			},
			{
				name: 'Preview',
				status: 'upcoming'
			}
		],
		[i18n.language]
	)

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					<Icon name='CirclePlus' role='img' /> {t('ns_common:actions.add')}
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-7xl focus:ring-0'>
				<DialogHeader>
					<DialogTitle>Inbound Receipt</DialogTitle>
					<DialogDescription>Follow the steps below to create new inbound receipt</DialogDescription>
				</DialogHeader>

				<Div className='max-h-[80vh] overflow-y-auto !scrollbar-none'>
					<DatalistDialogProvider>
						<Stepper.Provider data={steps}>
							<Stepper.Panel value={1}>
								<BaseDatalistForm />
							</Stepper.Panel>
							<Stepper.Panel value={2}>
								<OrderDetailsDatalist />
							</Stepper.Panel>
							<Stepper.Panel value={3}>
								<OrderPreview />
							</Stepper.Panel>
						</Stepper.Provider>
					</DatalistDialogProvider>
				</Div>
			</DialogContent>
		</Dialog>
	)
}

export default ImportDataListDialog
