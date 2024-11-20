import { useAuth } from '@/common/hooks/use-auth'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	DialogFooter,
	Div,
	Icon,
	Separator,
	Typography
} from '@/components/ui'
import { useStepContext } from '@/components/ui/@custom/step'
import { format } from 'date-fns'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useAddImportOrderMutation } from '../_apis/use-warehouse-import.api'
import { useDatalistDialogContext } from '../_contexts/-datalist-dialog-context'

const OrderPreview: React.FC<{ onSubmitSuccess: () => void }> = ({ onSubmitSuccess }) => {
	const { importOrderValue, importOrderDetailValue } = useDatalistDialogContext()
	const { mutateAsync, isPending } = useAddImportOrderMutation()
	const { dispatch } = useStepContext()
	const { user } = useAuth()
	const { t, i18n } = useTranslation()
	// console.log(isPending)
	// console.log(importOrderDetailValue,'importOrderValue')

	const orderTotalQty = useMemo(
		() => importOrderDetailValue.reduce((acc, curr) => acc + +curr.or_totalqty, 0),
		[importOrderDetailValue]
	)
	const orderActualQty = useMemo(
		() => importOrderDetailValue.reduce((acc, curr) => acc + Number(curr.sno_qty), 0),
		[importOrderDetailValue]
	)
	const orderMissingQty = useMemo(
		() => importOrderDetailValue.reduce((acc, curr) => acc + Number(curr.sno_qty_notyet), 0),
		[importOrderDetailValue]
	)

	const handleSubmitImportOrder = async () => {
		try {
			await mutateAsync(importOrderDetailValue)
			onSubmitSuccess()
		} catch (error) {
			console.error('Error submitting import order:', error)
		}
	}

	return (
		<Fragment>
			<Div className='relative grid grid-cols-1 gap-x-6 xl:grid-cols-2'>
				<Div className='space-y-6'>
					<Typography variant='h6'>Order Summary</Typography>
					<List>
						<ListItem>
							<Typography className='font-medium'>Order code</Typography>
							<Typography>{importOrderValue.sno_no}</Typography>
						</ListItem>
						<ListItem>
							<Typography className='font-medium'>Created by</Typography>
							<Typography>{user.display_name}</Typography>
						</ListItem>
						<ListItem>
							<Typography className='font-medium'>Created at</Typography>
							<Typography>{format(importOrderValue.sno_date, 'yyyy-MM-dd')}</Typography>
						</ListItem>
						<ListItem>
							<Typography className='font-medium'>Import from</Typography>
							<Typography>{importOrderValue.dept_code}</Typography>
						</ListItem>
						<ListItem>
							<Typography className='font-medium'>Import warehouse</Typography>
							<Typography>{importOrderValue.warehouse_num}</Typography>
						</ListItem>
					</List>
					<Separator />
					<List>
						<ListItem>
							<Typography className='font-medium'>Total Order Quantity</Typography>
							<Typography>{orderTotalQty}</Typography>
						</ListItem>
						<ListItem>
							<Typography className='font-medium'>Total Actual Shipment Quantity</Typography>
							<Typography>{orderActualQty}</Typography>
						</ListItem>
						<ListItem>
							<Typography className='font-medium'>Total Quantity Outstanding</Typography>
							<Typography>{orderMissingQty}</Typography>
						</ListItem>
					</List>
					{/* <pre>{JSON.stringify(importOrderValue, null, 3)}</pre> */}
				</Div>
				<Div className='space-y-6'>
					<Typography variant='h6'>Order Details</Typography>
					<Div className='flex h-[50dvh] flex-col gap-y-4 overflow-y-auto pb-2 scrollbar-none'>
						{Array.isArray(importOrderDetailValue) &&
							importOrderDetailValue.map((item) => (
								<Card className='relative'>
									<Button variant='destructive' size='icon' className='absolute right-6 top-6'>
										<Icon name='Trash2' role='img' />
										{/* {t('ns_common:actions.delete')} */}
									</Button>
									<CardHeader>
										<CardTitle className='inline-flex items-center gap-x-2'>
											#{item.or_custpoone} <Separator orientation='vertical' className='h-5 w-0.5' />{' '}
											{item.brand_name}
										</CardTitle>
										<CardDescription className='inline-flex items-center gap-x-2'>
											{item.mo_no}
										</CardDescription>
									</CardHeader>
									<CardContent className='space-y-2'>
										<CardDetail>
											<Typography className='font-medium'>{t('ns_erp:fields.prod_color')}</Typography>
											<Typography>{item.prod_color}</Typography>
										</CardDetail>
										<CardDetail>
											<Typography className='font-medium'>
												{t('ns_erp:fields.shoestyle_codefactory')}
											</Typography>
											<Typography>{item.shoestyle_codefactory}</Typography>
										</CardDetail>
										<CardDetail>
											<Typography className='font-medium'>{t('ns_erp:fields.or_totalqty')}</Typography>
											<Typography>{item.or_totalqty}</Typography>
										</CardDetail>
										<CardDetail>
											<Typography className='font-medium'>{t('ns_erp:fields.sno_qty')}</Typography>
											<Typography>{item.sno_qty}</Typography>
										</CardDetail>
										<CardDetail>
											<Typography className='font-medium'>{t('ns_erp:fields.sno_qty_notyet')}</Typography>
											<Typography>{item.sno_qty_notyet}</Typography>
										</CardDetail>
										<CardDetail>
											<Typography className='font-medium'>
												{t('ns_erp:fields.shipment_confirm_date')}
											</Typography>
											<Typography>{item.or_deliverdate_confirm}</Typography>
										</CardDetail>
										<CardDetail>
											<Typography className='font-medium'>
												{t('ns_erp:fields.shipping_destination')}
											</Typography>
											<Typography>{item.shipping_destination}</Typography>
										</CardDetail>
									</CardContent>
								</Card>
							))}
					</Div>
				</Div>
			</Div>
			<Separator className='col-span-full' />
			<DialogFooter>
				<Button variant='outline' onClick={() => dispatch({ type: 'PREV_STEP' })}>
					{t('ns_common:actions.back')}
				</Button>
				<Button
					onClick={() => {
						handleSubmitImportOrder()
					}}>
					{t('ns_common:actions.confirm')}
				</Button>
			</DialogFooter>
		</Fragment>
	)
}

const List = tw.ul`flex flex-col items-stretch`
const ListItem = tw.li`inline-grid grid-cols-2 gap-x-2 py-2 *:text-sm`
const CardDetail = tw.div`grid grid-cols-2 gap-x-2 items-center *:py-1 *:text-sm`

export default OrderPreview
