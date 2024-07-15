import { locales } from '@/common/constants/constants'
import { Languages, Theme } from '@/common/constants/enums'
import useTheme from '@/common/hooks/use-theme'
import {
	Button,
	Div,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form as FormProvider,
	RadioGroup,
	RadioGroupItem,
	SelectFieldControl,
	Separator,
	Typography
} from '@/components/ui'
import { AppearanceFormValues, appearanceFormSchema } from '@/schemas/user-preference.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'

export const Route = createLazyFileRoute('/(preferences)/_layout/appearance-settings/')({
	component: Page
})

const fontOptions = [
	{ label: 'Inter', value: 'inter' },
	{ label: 'Roboto', value: 'roboto' },
	{ label: 'System', value: 'system' }
]
function Page() {
	const { theme, setTheme } = useTheme()
	const { t, i18n } = useTranslation()
	const form = useForm<AppearanceFormValues>({
		resolver: zodResolver(appearanceFormSchema),
		defaultValues: {
			language: i18n.language as Languages,
			font: 'inter',
			theme: theme
		}
	})

	const handleSaveSettings = (data: AppearanceFormValues) => {
		console.log('settings changed :>>>', data)
		toast.success('Saved your change')
	}

	return (
		<Div className='space-y-6'>
			<Div className='space-y-2'>
				<Typography variant='h5'>{t('ns_common:navigation.settings')}</Typography>
				<Typography variant='small' color='muted'>
					{t('ns_preference:captions.appearance')}
				</Typography>
			</Div>
			<Separator />
			<FormProvider {...form}>
				<Form onSubmit={form.handleSubmit(handleSaveSettings)} className=''>
					<SelectFieldControl name='font' label='Font' control={form.control} options={fontOptions} />
					<SelectFieldControl
						name='language'
						label={t('ns_common:settings.language')}
						control={form.control}
						options={locales}
						onValueChange={(value) => i18n.changeLanguage(value)}
					/>
					<FormField
						control={form.control}
						name='theme'
						render={({ field }) => (
							<FormItem className='space-y-1'>
								<FormLabel>{t('ns_common:settings.language')}</FormLabel>
								<FormDescription>{t('ns_preference:captions.theme_selection')}</FormDescription>
								<FormMessage />
								<RadioGroup
									onValueChange={(value) => {
										field.onChange(value)
										setTheme(value as Theme)
									}}
									defaultValue={field.value}
									className='grid max-w-md grid-cols-2 gap-8 pt-2'>
									<FormItem>
										<FormLabel className='[&:has([data-state=checked])>Div]:border-primary'>
											<FormControl>
												<RadioGroupItem value='light' className='sr-only' />
											</FormControl>
											<Div className='items-center rounded-md border-2 border-muted p-1 hover:border-accent'>
												<Div className='space-y-2 rounded-sm bg-neutral-200 p-2'>
													<Div className='space-y-2 rounded-md bg-white p-2 shadow-sm'>
														<Div className='h-2 w-[80px] rounded-lg bg-neutral-200' />
														<Div className='h-2 w-[100px] rounded-lg bg-neutral-200' />
													</Div>
													<Div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm'>
														<Div className='h-4 w-4 rounded-full bg-neutral-200' />
														<Div className='h-2 w-[100px] rounded-lg bg-neutral-200' />
													</Div>
													<Div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm'>
														<Div className='h-4 w-4 rounded-full bg-neutral-200' />
														<Div className='h-2 w-[100px] rounded-lg bg-neutral-200' />
													</Div>
												</Div>
											</Div>
											<Typography className='block w-full p-2 text-center font-normal'>Light</Typography>
										</FormLabel>
									</FormItem>
									<FormItem>
										<FormLabel className='[&:has([data-state=checked])>Div]:border-primary'>
											<FormControl>
												<RadioGroupItem value='dark' className='sr-only' />
											</FormControl>
											<Div className='items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground'>
												<Div className='space-y-2 rounded-sm bg-neutral-950 p-2'>
													<Div className='space-y-2 rounded-md bg-neutral-800 p-2 shadow-sm'>
														<Div className='h-2 w-[80px] rounded-lg bg-neutral-400' />
														<Div className='h-2 w-[100px] rounded-lg bg-neutral-400' />
													</Div>
													<Div className='flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-sm'>
														<Div className='h-4 w-4 rounded-full bg-neutral-400' />
														<Div className='h-2 w-[100px] rounded-lg bg-neutral-400' />
													</Div>
													<Div className='flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-sm'>
														<Div className='h-4 w-4 rounded-full bg-neutral-400' />
														<Div className='h-2 w-[100px] rounded-lg bg-neutral-400' />
													</Div>
												</Div>
											</Div>
											<Typography className='block w-full p-2 text-center font-normal'>Dark</Typography>
										</FormLabel>
									</FormItem>
								</RadioGroup>
							</FormItem>
						)}
					/>

					<Button type='submit'>Update preferences</Button>
				</Form>
			</FormProvider>
		</Div>
	)
}

const Form = tw.form`max-w-sm space-y-8`
