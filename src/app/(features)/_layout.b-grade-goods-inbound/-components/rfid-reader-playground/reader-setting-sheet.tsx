import { cn } from '@/common/utils/cn'
import {
	Button,
	buttonVariants,
	Div,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	Icon,
	InputFieldControl,
	SelectFieldControl,
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Slider
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import z from 'zod'

const schema = z.object({
	uhf_reader_ip: z.ipv4({ message: 'ns_validation:invalid_ipv4' }),
	uhf_reader_ant: z.enum(['1', '2', '3', '4'], { message: 'ns_validation:invalid_value' }),
	uhf_reader_power: z.number().nonnegative().min(5).max(30)
})

const ReaderSettingSheet: React.FC = () => {
	const { t } = useTranslation()
	const form = useForm({
		resolver: zodResolver(schema),
		mode: 'onChange'
	})

	return (
		<Sheet>
			<SheetTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
				<Icon name='Settings' size={18} />
			</SheetTrigger>
			<SheetContent className='flex max-w-xl flex-col items-stretch gap-y-6'>
				<SheetHeader>
					<SheetTitle>RFID Reader Settings</SheetTitle>
					<SheetDescription>
						{`This sheet allows you to configure the settings for the RFID reader. You can specify the reader's
						network details, such as its IP address, to ensure proper connectivity and functionality.`}
					</SheetDescription>
				</SheetHeader>
				<Form {...form}>
					<SheetForm>
						<InputFieldControl
							label='Reader TCP/IP'
							name='reader_ip'
							orientation='horizontal'
							placeholder='10.xx.xx.xx'
							description='Enter the IP address of the RFID reader. This should be in the format of a valid IPv4 address.'
						/>
						<SelectFieldControl
							label='Antenna'
							name='reader_ant'
							datalist={[
								{ label: 'Antenna 1', value: '1' },
								{ label: 'Ant 2', value: '2' },
								{ label: 'Ant 3', value: '4' },
								{ label: 'Ant 4', value: '8' }
							]}
							labelField='label'
							valueField='value'
							orientation='horizontal'
							description='Select the antenna number to be used for reading RFID tags.'
						/>
						<FormField
							control={form.control}
							name='reader_power'
							render={({ field }) => (
								<FormItem className='grid grid-cols-[1fr_2fr] items-start gap-2 space-y-0'>
									<FormLabel>Reader power</FormLabel>
									<FormControl>
										<Div className='space-y-2'>
											<Slider step={5} min={5} max={30} value={field.value} onValueChange={field.onChange} />
											<FormDescription>
												Adjust the power level of the RFID reader. Higher power levels may increase read
												range but can also lead to interference.
											</FormDescription>
										</Div>
									</FormControl>
								</FormItem>
							)}
						/>
					</SheetForm>
				</Form>
				<SheetFooter className='gap-2'>
					<Button>{t('ns_common:actions.save')}</Button>
					<SheetClose className={cn(buttonVariants({ variant: 'secondary' }))}>
						{t('ns_common:actions.cancel')}
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}

const SheetForm = tw.form`flex h-full flex-1 flex-col gap-y-6`

export default ReaderSettingSheet
