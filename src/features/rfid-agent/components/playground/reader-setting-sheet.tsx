import { cn } from '@common/utils/cn'
import { Div } from '@components/customs/div'
import { Tooltip } from '@components/customs/tooltip'
import { Typography } from '@components/customs/typography'
import { InputFieldControl } from '@components/forms/input'
import { Button, buttonVariants } from '@components/ui/button'
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form as FormProvider
} from '@components/ui/form'
import { Icon } from '@components/ui/icon'
import { Label } from '@components/ui/label'
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group'
import { Separator } from '@components/ui/separator'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@components/ui/sheet'
import { Slider } from '@components/ui/slider'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffectOnce } from '@hooks/use-effect-once'
import { useUpdateEffect } from 'ahooks'
import { isEmpty, isEqual, isNil } from 'lodash-es'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { ReaderAntenna } from '../../constants/rfid-reader'
import { PublishedTopics, useReaderPlaygroundStore } from '../../contexts/rfid-reader-playground-context'
import type { ReaderSettingsFormValues } from '../../schemas/reader-settings.schema'
import { readerSettingsFormSchema } from '../../schemas/reader-settings.schema'

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
				contentProps={{ side: 'left' }}
				message={t('ns_rfid:reader_settings_form.title')}
				triggerProps={{ asChild: true }}>
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
							autoFocus={false}
							description={t('ns_rfid:reader_settings_form.reader_ip.description')}
							label={t('ns_rfid:reader_settings_form.reader_ip.label')}
							name='readerIP'
							orientation='horizontal'
							placeholder='192.xxx.xxx.xxx'
						/>
						<FormField
							control={form.control}
							name='readerAnt'
							render={({ field }) => (
								<FormItem className='grid grid-cols-[1fr_2fr] items-start gap-2 space-y-0'>
									<FormLabel>Antenna</FormLabel>
									<Div className='flex flex-col gap-y-2'>
										<RadioGroup
											className='flex flex-col space-y-2'
											value={field.value}
											onValueChange={field.onChange}>
											{[
												{ label: 'Antenna 1', value: ReaderAntenna.ANT_1 },
												{ label: 'Antenna 2', value: ReaderAntenna.ANT_2 },
												{ label: 'Antenna 3', value: ReaderAntenna.ANT_3 },
												{ label: 'Antenna 4', value: ReaderAntenna.ANT_4 }
											].map((item) => (
												<FormItem className='flex items-center space-y-0 gap-x-3' key={item.value}>
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
							disabled={false}
							name='readerPower'
							render={({ field }) => (
								<FormItem className='grid grid-cols-[1fr_2fr] items-start gap-2 space-y-0'>
									<FormLabel>{t('ns_rfid:reader_settings_form.reader_power.label')}</FormLabel>
									<FormControl>
										<Div className='space-y-2'>
											<Div className='flex items-center justify-between gap-x-2'>
												<Icon
													className='stroke-muted-foreground -translate-y-3 rotate-45'
													name='WifiLow'
													size={24}
													strokeWidth={1.5}
												/>
												<Div className='flex-1 space-y-2'>
													<Slider
														className='cursor-pointer focus:cursor-grabbing [&_span[role=slider]]:cursor-grab'
														max={30}
														min={5}
														step={5}
														value={[field.value]}
														onValueChange={(value) => field.onChange(value[0])}
													/>
													<Div className='flex items-baseline justify-between px-1'>
														{Array.from({ length: 6 }, (_, i) => (
															<Typography
																className='translate-x-0.5 text-center text-[10px]! first:translate-x-0 last:translate-x-0'
																key={i}
																variant='small'>
																{(i + 1) * 5}
															</Typography>
														))}
													</Div>
												</Div>
												<Icon
													className='-translate-y-3 rotate-45'
													name='WifiHigh'
													size={24}
													strokeWidth={1.5}
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
								<Typography className='max-w-xs text-pretty' color='muted' variant='small'>
									{t('ns_rfid:reader_settings_form.sync_settings.description')}
								</Typography>
							</Div>
							<Button
								disabled={isEqual(currentFormValues, readerSettings)}
								size='sm'
								type='button'
								onClick={() => publishMessage(PublishedTopics.REQUEST_SETTINGS, { action: 'get' })}>
								<Icon name='RefreshCcw' /> {t('ns_common:actions.sync')}
							</Button>
						</Div>
						<Button className='hidden' id='submit' type='submit' value='Submit' />
					</SheetForm>
				</FormProvider>
				<Separator />
				<SheetFooter className='gap-2'>
					<SheetClose className={cn(buttonVariants({ variant: 'secondary' }))}>
						{t('ns_common:actions.cancel')}
					</SheetClose>
					<Label
						className={cn(buttonVariants({ variant: 'default', className: 'cursor-pointer' }))}
						htmlFor='submit'>
						{t('ns_common:actions.save')}
					</Label>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}

const SheetForm = tw.form`flex h-full flex-1 flex-col gap-y-10 overflow-y-auto scrollbar-none`

export default ReaderSettingSheet
