import { RFIDDataType } from '@/app/(features)/_layout.(rfid)/-constants'
import {
	Button,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	RadioGroup,
	RadioGroupItem,
	SelectFieldControl,
	Separator
} from '@/components/ui'
import { Fragment } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

type Props = {}

const InoutboundForm = (props: Props) => {
	const form = useForm()
	const { t } = useTranslation()

	const currentInoutboundType = useWatch({ control: form.control, name: 'type' })

	return (
		<FormProvider {...form}>
			<Form>
				<FormField
					control={form.control}
					defaultValue={RFIDDataType.INBOUND}
					name='type'
					render={({ field }) => (
						<FormItem className='flex items-center gap-x-6 space-y-0'>
							{/* <FormLabel>Type</FormLabel> */}
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									defaultValue={field.value}
									className='flex items-center gap-x-6'>
									<FormItem className='flex items-center space-x-3 space-y-0'>
										<FormControl>
											<RadioGroupItem value={RFIDDataType.INBOUND} />
										</FormControl>
										<FormLabel className='font-normal'>
											{t('ns_inoutbound:action_types.warehouse_input')}
										</FormLabel>
									</FormItem>
									<FormItem className='flex items-center space-x-3 space-y-0'>
										<FormControl>
											<RadioGroupItem value={RFIDDataType.OUTBOUND} />
										</FormControl>
										<FormLabel className='font-normal'>
											{t('ns_inoutbound:action_types.warehouse_output')}
										</FormLabel>
									</FormItem>
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{currentInoutboundType === RFIDDataType.OUTBOUND ? (
					<Fragment>
						<Separator orientation='vertical' className='h-6 w-0.5' />
						<SelectFieldControl
							name='outbound_purpose'
							placeholder='Outbound purpose ...'
							className='w-48'
							datalist={[
								{ label: 'For sale', value: 'A' },
								{ label: 'Recycle', value: 'B' },
								{ label: 'Gift for staff', value: 'C' }
							]}
							labelField='label'
							valueField='value'
						/>
					</Fragment>
				) : (
					<Fragment>
						<Separator orientation='vertical' className='h-6 w-0.5' />
						<InputFieldControl
							name='storage_location'
							placeholder='Enter storage location ...'
							// disabled={isNil(formAction)}
						/>
					</Fragment>
				)}
				<Separator orientation='vertical' className='h-6 w-0.5' />
				<Button type='submit' size='sm'>
					<Icon name='Check' />
					{t('ns_common:actions.save')}
				</Button>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`flex flex-row items-center justify-end flex-1 gap-x-6`

export default InoutboundForm
