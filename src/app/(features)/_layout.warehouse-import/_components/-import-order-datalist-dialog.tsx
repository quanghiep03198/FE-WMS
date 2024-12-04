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
import { Stepper, TStep } from '@/components/ui/@custom/stepper'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageStore } from '../../_layout.transfer-management/_stores/page.store'
import { DatalistDialogProvider } from '../_contexts/-datalist-dialog-context'
import BaseDatalistForm from './-base-datalist-form'
import OrderDetailsDatalist from './-base-datalist-import-table'
import OrderPreview from './-order-preview'

type Props = {}

const ImportDataListDialog = (props: Props) => {
	const { t, i18n } = useTranslation()
	const { datalistDialogOpen, toggleDatalistDialogOpen } = usePageStore()

	const steps: TStep[] = useMemo(
		() => [
			{
				title: 'Create new order',
				description: 'Fill in the form below to create new inbound receipt',
				status: 'current'
			},
			{
				title: 'Import order details',
				description: 'Pick the order details from the table below',
				status: 'upcoming'
			},
			{
				title: 'Preview',
				description: 'Review the order details before submitting',
				status: 'upcoming'
			}
		],
		[i18n.language]
	)

	return (
		<Dialog open={datalistDialogOpen} onOpenChange={toggleDatalistDialogOpen}>
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

				<Div className='overflow-y-auto !scrollbar-none lg:h-[80vh] xl:h-[80vh]'>
					<DatalistDialogProvider>
						<Stepper.Provider data={steps}>
							<Stepper.Panel value={1}>
								<BaseDatalistForm />
							</Stepper.Panel>
							<Stepper.Panel value={2}>
								<OrderDetailsDatalist />
							</Stepper.Panel>
							<Stepper.Panel value={3}>
								<OrderPreview onProceed={toggleDatalistDialogOpen} />
							</Stepper.Panel>
						</Stepper.Provider>
					</DatalistDialogProvider>
				</Div>
			</DialogContent>
		</Dialog>
	)
}

export default ImportDataListDialog
