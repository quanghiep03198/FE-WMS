import {
	Button,
	Div,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	Label,
	SelectFieldControl,
	Switch,
	TextareaFieldControl
} from '@/components/ui'
import { EditorFieldControl } from '@/components/ui/@field-control/editor'
import { Fragment } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { DefectLocation } from '../-constants'
import CommandNumberComboboxFieldControl from './command-number-combobox-field-control'
import PurchaseOrderComboboxFieldControl from './purchase-order-combobox-field-control'

const DefectiveGoodsForm: React.FC = () => {
	const form = useForm()
	const { t } = useTranslation()
	const currentCategory = useWatch({ control: form.control, name: 'category' })

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit(() => {})}>
				<Div as='fieldset' className='grid grid-cols-6 gap-x-2 gap-y-6 p-6'>
					<Div className='col-span-full'>
						<InputFieldControl
							name='epc'
							label='EPC'
							autoComplete='off'
							placeholder='Scan EPC tag here'
							onKeyDown={(e) => {
								if (e.key === 'Enter') e.preventDefault()
							}}
							onKeyDownCapture={(e) => {
								if (e.key === 'Enter') e.preventDefault()
							}}
							description='Using RFID Reader to scan EPC tag'
						/>
					</Div>
					<Div className='col-span-full'>
						<SelectFieldControl
							name='category'
							label='Category'
							datalist={[
								{ label: 'B', value: 'B' },
								{ label: 'C', value: 'C' },
								{ label: 'RD', value: 'RD' }
							]}
							labelField='label'
							valueField='value'
						/>
					</Div>
					<Div className='col-span-2'>
						<SelectFieldControl
							name='brand_name'
							label={t('ns_erp:fields.brand_name')}
							datalist={[
								{ label: 'UGG', value: 'UGG' },
								{ label: 'TEVA', value: 'TEVA' },
								{ label: 'KOOLABURA', value: 'KOOLABURA' }
							]}
							labelField='label'
							valueField='value'
						/>
					</Div>
					{currentCategory === 'B' && (
						<Fragment>
							<Div className='col-span-2'>
								<PurchaseOrderComboboxFieldControl />
							</Div>
							<Div className='col-span-2'>
								<CommandNumberComboboxFieldControl />
							</Div>
						</Fragment>
					)}

					<Div className='col-span-2'>
						<InputFieldControl
							name='factory_shoes_style'
							label={t('ns_erp:fields.shoestyle_codefactory')}
							placeholder='UF25 W960-1'
						/>
					</Div>

					<Div className='col-span-2'>
						<InputFieldControl name='color_sn' label={t('ns_erp:fields.color_sn')} placeholder='BLK' />
					</Div>
					<Div className='col-span-2'>
						<InputFieldControl name='size_code' label='Size' placeholder='01' />
					</Div>
					<Div className='col-span-full'>
						<InputFieldControl name='storage' label={t('ns_warehouse:fields.storage_name')} placeholder='A1.1' />
					</Div>
					<Div className='col-span-full'>
						<SelectFieldControl
							name='defect_location'
							label='Defect location'
							datalist={[
								{ label: t('ns_common:others.all'), value: DefectLocation.ALL },
								{ label: 'Upper', value: DefectLocation.UPPER },
								{ label: 'Bottom', value: DefectLocation.BOTTOM },
								{ label: t('ns_common:others.other'), value: DefectLocation.OTHER }
							]}
							labelField='label'
							valueField='value'
						/>
					</Div>
					<Div className='col-span-full'>
						<TextareaFieldControl
							name='defect_reason'
							label='Defect reason'
							rows={3}
							placeholder='Enter defective reason within 120 words ...'
						/>
					</Div>
					<Div className='col-span-full'>
						<EditorFieldControl name='defect_description' label='Defect description' className='h-60' />
					</Div>
				</Div>
				<Div className='sticky bottom-0 z-20 col-span-full flex items-center justify-end gap-x-2 border-t bg-background p-2'>
					<Div className='mr-auto inline-flex items-center gap-x-2'>
						<Label htmlFor='toggle-use-handhold'>Using RFID handhold</Label>
						<Switch />
					</Div>
					<Button variant='secondary' size='sm'>
						<Icon name='Undo2' /> {t('ns_common:actions.reset')}
					</Button>
					<Button size='sm'>
						<Icon name='Check' /> {t('ns_common:actions.save')}
					</Button>
				</Div>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`h-full overflow-y-auto`

export default DefectiveGoodsForm
