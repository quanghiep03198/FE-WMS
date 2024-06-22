import { useBreadcrumb } from '@/app/(features)/_hooks/-use-breadcrumb'
import { cn } from '@/common/utils/cn'
import {
	Div,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form as FormProvider,
	Icon,
	RadioGroup,
	RadioGroupItem,
	ScrollArea,
	SelectFieldControl,
	Typography
} from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const storageTypes = [
	{ label: '正常入庫', type: 'import', value: '1' },
	{ label: '正常出庫', type: 'export', value: '2' },
	{ label: '報廢', type: 'export', value: '3' }, //
	{ label: '調撥出庫', type: 'export', value: '4' },
	{ label: '調攒入庫', type: 'import', value: '5' },
	{ label: '翻箱', type: 'export', value: '6' },
	{ label: '返修', type: 'export', value: '7' }
]

export const Route = createLazyFileRoute('/(features)/_layout/in-out-commands/')({
	component: InOutCommandsPage
})

function InOutCommandsPage() {
	const { t } = useTranslation()
	useBreadcrumb([{ to: '/in-out-commands', title: t('ns_common:navigation.wh_in_out_commands') }])
	const [action, setAction] = useState('import')
	const form = useForm()
	const [EPCData, setEPCData] = useState([])

	return (
		<Div className='grid h-full grid-cols-2 gap-10'>
			{/* EPC Codes list */}
			<Div className='flex flex-col items-stretch divide-y divide-border rounded-[var(--radius)] border border-border'>
				<Div className='flex basis-16 items-center justify-center text-center'>
					<Typography variant='h6'>EPC CODE</Typography>
				</Div>
				{EPCData.length === 0 ? (
					<Div className='flex basis-full items-center justify-center gap-x-4'>
						<Icon name='TicketX' stroke='hsl(var(--muted-foreground))' size={40} strokeWidth={1} />
						<Typography color='muted'>Empty</Typography>
					</Div>
				) : (
					<ScrollArea className='flex flex-1 basis-full flex-col items-stretch p-1'>
						{EPCData.map((item) => (
							<Typography className='px-4 py-2 uppercase transition-all duration-200 hover:bg-secondary'>
								{item}
							</Typography>
						))}
					</ScrollArea>
				)}
			</Div>
			{/*  */}
			<Div className='flex flex-col items-stretch gap-y-6'>
				<Div className='flex basis-1/3 flex-col items-center justify-center space-y-6 rounded-[var(--radius)] border p-4 text-center'>
					<Typography variant='h5'>{t('ns_imp_exp:warehouse_input_output_number')}</Typography>
					<Typography variant='h1'>0</Typography>
				</Div>
				{/*  */}
				<FormProvider {...form}>
					<form className='space-y-6'>
						{/*  */}
						<FormField
							name='inoutbound_type'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('ns_common:common_fields.actions')}</FormLabel>
									<FormMessage />
									<RadioGroup className='grid grid-cols-2' onValueChange={(value) => setAction(value)}>
										<FormItem>
											<FormLabel
												htmlFor='1'
												className={cn(
													'flex cursor-pointer select-none items-center rounded border p-6 font-medium transition-colors duration-200',
													{
														'bg-primary text-primary-foreground': action == 'import'
													}
												)}>
												<FormControl>
													<RadioGroupItem id='1' value='import' className='hidden' />
												</FormControl>
												{t('ns_imp_exp:action_types.warehouse_input')}
												<Icon
													name='CircleCheckBig'
													size={20}
													className={cn(
														'ml-auto scale-75 opacity-0 transition-[scale,opacity] duration-200',
														{
															'opacity-300 scale-100': action == 'import'
														}
													)}
												/>
											</FormLabel>
										</FormItem>
										<FormItem>
											<FormLabel
												htmlFor='2'
												className={cn(
													'flex cursor-pointer select-none items-center rounded border p-6 font-medium transition-all duration-200',
													{
														'bg-primary text-primary-foreground': action == 'export'
													}
												)}>
												<FormControl>
													<RadioGroupItem id='2' value='export' className='sr-only' />
												</FormControl>
												{t('ns_imp_exp:action_types.warehouse_output')}
												<Icon
													name='CircleCheckBig'
													size={20}
													className={cn(
														'ml-auto scale-75 opacity-0 transition-[scale,opacity] duration-200',
														{
															'scale-100 opacity-100': action == 'export'
														}
													)}
												/>
											</FormLabel>
										</FormItem>
									</RadioGroup>
								</FormItem>
							)}
						/>
						{/*  */}
						<SelectFieldControl
							control={form.control}
							name='type_storage'
							label={t('ns_imp_exp:labels.imp_exp_reason')}
							options={storageTypes}
						/>
						<Div className='grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2 xl:items-end'>
							<SelectFieldControl
								control={form.control}
								name='type_storage'
								label={t('ns_imp_exp:labels.imp_archive_warehouse')}
								options={[]}
							/>

							<SelectFieldControl
								control={form.control}
								name='type_storage'
								label={t('ns_imp_exp:labels.imp_location')}
								options={[]}
							/>
						</Div>
					</form>
				</FormProvider>
			</Div>
		</Div>
	)
}
