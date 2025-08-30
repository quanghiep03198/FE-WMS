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
	FormMessage,
	Icon,
	InputFieldControl,
	Label,
	RadioGroup,
	RadioGroupItem,
	Separator,
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Slider,
	Tooltip,
	Typography
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { isEmpty } from 'lodash'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import z from 'zod'
import { PublishedTopics, useReaderPlaygroundStore } from '../../-contexts/rfid-reader-playground.context'

const schema = z.object({
	readerIP: z.ipv4({ message: 'ns_validation:invalid_ipv4' }),
	readerAnt: z.enum(['1', '2', '3', '4'], { message: 'ns_validation:invalid_value' }),
	readerPower: z.number().nonnegative().min(5).max(30)
})

type FormData = z.infer<typeof schema>

const ReaderSettingSheet: React.FC = () => {
	const { readerSettings, publishMessage } = useReaderPlaygroundStore('readerSettings', 'publishMessage')
	const { t } = useTranslation()
	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: 'onChange',
		defaultValues: { ...readerSettings, readerPower: Number(readerSettings.readerPower) }
	})

	useEffect(() => {
		if (Object.values(form.getValues()).some(isEmpty))
			publishMessage(PublishedTopics.REQUEST_SETTINGS, { action: 'get' })
	}, [])

	useEffect(() => {
		form.reset({ ...readerSettings, readerPower: Number(readerSettings.readerPower) })
	}, [readerSettings])

	return (
		<Sheet>
			<Tooltip message={t('ns_rfid:reader_settings_form.title')} triggerProps={{ asChild: true }}>
				<SheetTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
					<Icon name='Settings' size={18} />
				</SheetTrigger>
			</Tooltip>
			<SheetContent className='flex max-w-lg flex-col items-stretch gap-y-6'>
				<SheetHeader>
					<SheetTitle>{t('ns_rfid:reader_settings_form.title')}</SheetTitle>
					<SheetDescription>{t('ns_rfid:reader_settings_form.description')}</SheetDescription>
				</SheetHeader>
				<Separator />
				<Form {...form}>
					<SheetForm
						onSubmit={form.handleSubmit((data) => {
							console.log(data)
							publishMessage<FormData>(PublishedTopics.REQUEST_SETTINGS, { action: 'update', payload: data })
						})}>
						<InputFieldControl
							label={t('ns_rfid:reader_settings_form.reader_ip.label')}
							name='readerIP'
							defaultValue={readerSettings.readerIP}
							orientation='horizontal'
							placeholder='10.xx.xx.xx'
							autoFocus={false}
							description={t('ns_rfid:reader_settings_form.reader_ip.description')}
						/>
						<FormField
							name='readerAnt'
							control={form.control}
							defaultValue={readerSettings.readerAnt}
							render={({ field }) => (
								<FormItem className='grid grid-cols-[1fr_2fr] items-start gap-2 space-y-0'>
									<FormLabel>Antenna</FormLabel>
									<Div className='flex flex-col gap-y-2'>
										<RadioGroup
											onValueChange={field.onChange}
											value={field.value}
											defaultValue={field.value}
											className='flex flex-col space-y-2'>
											{[
												{ label: 'Antenna 1', value: '1' },
												{ label: 'Antenna 2', value: '2' },
												{ label: 'Antenna 3', value: '4' },
												{ label: 'Antenna 4', value: '8' }
											].map((item) => (
												<FormItem key={item.value} className='flex items-center gap-x-3 space-y-0'>
													<FormControl>
														<RadioGroupItem value={item.value} />
													</FormControl>
													<FormLabel className='font-normal'>{item.label}</FormLabel>
												</FormItem>
											))}
										</RadioGroup>
										<FormMessage />
										<FormDescription className='mt-2'>
											{t('ns_rfid:reader_settings_form.reader_ant.description')}
										</FormDescription>
									</Div>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='readerPower'
							render={({ field }) => (
								<FormItem className='grid grid-cols-[1fr_2fr] items-start gap-2 space-y-0'>
									<FormLabel>{t('ns_rfid:reader_settings_form.reader_power.label')}</FormLabel>
									<FormControl>
										<Div className='space-y-2'>
											<Div className='flex items-center justify-between gap-x-2'>
												<Icon
													name='WifiLow'
													size={24}
													strokeWidth={1.5}
													className='-translate-y-3 rotate-45 stroke-warning'
												/>
												<Div className='flex-1 space-y-2'>
													<Slider
														step={5}
														min={5}
														max={30}
														value={[field.value]}
														onValueChange={(value) => field.onChange(value[0])}
													/>
													<Div className='flex items-baseline justify-between'>
														{Array.from({ length: 6 }, (_, i) => (
															<Typography
																key={i}
																variant='small'
																className='translate-x-2 text-center !text-[10px] first:translate-x-0 last:translate-x-0'>
																{(i + 1) * 5}
															</Typography>
														))}
													</Div>
												</Div>
												<Icon
													name='WifiHigh'
													size={24}
													strokeWidth={1.5}
													className='-translate-y-3 rotate-45 stroke-success'
												/>
											</Div>
											<FormMessage />
											<FormDescription className='text-pretty'>
												{t('ns_rfid:reader_settings_form.reader_power.description')}
											</FormDescription>
										</Div>
									</FormControl>
								</FormItem>
							)}
						/>
						<Separator />
						<Div className='grid grid-cols-[1fr_auto] gap-6 rounded-md'>
							<Div className='flex flex-col space-y-2'>
								<Typography className='font-medium'>
									{t('ns_rfid:reader_settings_form.sync_settings.title')}
								</Typography>
								<Typography variant='small' color='muted' className='max-w-xs text-pretty'>
									{t('ns_rfid:reader_settings_form.sync_settings.description')}
								</Typography>
							</Div>
							<Button
								type='button'
								size='sm'
								onClick={() => publishMessage(PublishedTopics.REQUEST_SETTINGS, { action: 'get' })}>
								<Icon name='RefreshCcw' /> {t('ns_common:actions.sync')}
							</Button>
						</Div>
						<Button id='submit' type='submit' className='hidden' value='Submit' />
					</SheetForm>
				</Form>
				<Separator />
				<SheetFooter className='gap-2'>
					<SheetClose className={cn(buttonVariants({ variant: 'secondary' }))}>
						{t('ns_common:actions.cancel')}
					</SheetClose>
					<Label
						htmlFor='submit'
						className={cn(buttonVariants({ variant: 'default', className: 'cursor-pointer' }))}>
						{t('ns_common:actions.save')}
					</Label>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}

const SheetForm = tw.form`flex h-full flex-1 flex-col gap-y-10`

export default ReaderSettingSheet
