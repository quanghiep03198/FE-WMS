import {
	Button,
	buttonVariants,
	Div,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form as FormProvider,
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
import { cn } from '@common/utils/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffectOnce } from '@hooks/use-effect-once'
import { useUpdateEffect } from 'ahooks'
import { isEmpty, isEqual, isNil } from 'lodash-es'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { ReaderAntenna } from '../constants'
import { PublishedTopics, useReaderPlaygroundStore } from '../contexts/rfid-reader-playground.context'
import type { ReaderSettingsFormValues } from '../schemas/reader-settings.schema'
import { readerSettingsFormSchema } from '../schemas/reader-settings.schema'

const ReaderSettingSheet: React.FC = () => {
	const { readerSettings, publishMessage } = useReaderPlaygroundStore('readerSettings', 'publishMessage')
	const [open, setOpen] = useState<boolean>(false)
	const { t } = useTranslation()
	const form = useForm<ReaderSettingsFormValues>({
		resolver: zodResolver(readerSettingsFormSchema),
		defaultValues: readerSettings,
		resetOptions: { keepErrors: false, keepDirty: false, keepValues: false }
	})

	const currentFormValues = useWatch({ control: form.control })

	useUpdateEffect(() => {
		form.reset(readerSettings, {
			keepErrors: false,
			keepDirty: false,
			keepIsSubmitted: false,
			keepTouched: false,
			keepIsValid: false,
			keepSubmitCount: false
		})
	}, [readerSettings])

	useEffectOnce(() => {
		if (Object.values(form.watch()).some((value) => isEmpty(value) || isNil(value)))
			publishMessage(PublishedTopics.REQUEST_SETTINGS, { action: 'get' })
	})

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<Tooltip
				message={t('ns_rfid:reader_settings_form.title')}
				triggerProps={{ asChild: true }}
				contentProps={{ side: 'left' }}>
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
				<FormProvider {...form}>
					<SheetForm
						onSubmit={form.handleSubmit((data) => {
							publishMessage<ReaderSettingsFormValues>(PublishedTopics.REQUEST_SETTINGS, {
								action: 'update',
								payload: data
							})
						})}>
						<InputFieldControl
							label={t('ns_rfid:reader_settings_form.reader_ip.label')}
							name='readerIP'
							orientation='horizontal'
							placeholder='192.xxx.xxx.xxx'
							autoFocus={false}
							description={t('ns_rfid:reader_settings_form.reader_ip.description')}
						/>
						<FormField
							name='readerAnt'
							control={form.control}
							render={({ field }) => (
								<FormItem className='grid grid-cols-[1fr_2fr] items-start gap-2 space-y-0'>
									<FormLabel>Antenna</FormLabel>
									<Div className='flex flex-col gap-y-2'>
										<RadioGroup
											value={field.value}
											onValueChange={field.onChange}
											className='flex flex-col space-y-2'>
											{[
												{ label: 'Antenna 1', value: ReaderAntenna.ANT_1 },
												{ label: 'Antenna 2', value: ReaderAntenna.ANT_2 },
												{ label: 'Antenna 3', value: ReaderAntenna.ANT_3 },
												{ label: 'Antenna 4', value: ReaderAntenna.ANT_4 }
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
							disabled={false}
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
													className='-translate-y-3 rotate-45 stroke-muted-foreground'
												/>
												<Div className='flex-1 space-y-2'>
													<Slider
														step={5}
														min={5}
														max={30}
														value={[field.value]}
														onValueChange={(value) => field.onChange(value[0])}
														className='cursor-pointer focus:cursor-grabbing [&_span[role=slider]]:cursor-grab'
													/>
													<Div className='flex items-baseline justify-between px-1'>
														{Array.from({ length: 6 }, (_, i) => (
															<Typography
																key={i}
																variant='small'
																className='translate-x-0.5 text-center text-[10px]! first:translate-x-0 last:translate-x-0'>
																{(i + 1) * 5}
															</Typography>
														))}
													</Div>
												</Div>
												<Icon
													name='WifiHigh'
													size={24}
													strokeWidth={1.5}
													className='-translate-y-3 rotate-45'
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
								disabled={isEqual(currentFormValues, readerSettings)}
								onClick={() => publishMessage(PublishedTopics.REQUEST_SETTINGS, { action: 'get' })}>
								<Icon name='RefreshCcw' /> {t('ns_common:actions.sync')}
							</Button>
						</Div>
						<Button id='submit' type='submit' className='hidden' value='Submit' />
					</SheetForm>
				</FormProvider>
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

const SheetForm = tw.form`flex h-full flex-1 flex-col gap-y-10 overflow-y-auto scrollbar-none`

export default ReaderSettingSheet
