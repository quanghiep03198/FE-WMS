import { Button, Div, Form as FormProvider, Icon, InputFieldControl, SelectFieldControl } from '@/components/ui'
import { EditorFieldControl } from '@/components/ui/@field-control/editor'
import { deflate } from 'pako'
import { Fragment } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { DefectiveLocation, DefectiveType } from '../-constants'
import { useGetProductSpecificationQuery } from '../-hooks/use-product-specification-asm'
import CommandNumberComboboxFieldControl from './command-number-combobox-field-control'
import PurchaseOrderComboboxFieldControl from './purchase-order-combobox-field-control'

const DefectiveGoodsForm: React.FC = () => {
	const form = useForm()
	const { t } = useTranslation()
	const currentCategory = useWatch({ control: form.control, name: 'category' })
	const { data, isLoading } = useGetProductSpecificationQuery()

	// useEffect(() => {
	// 	const formValues = form.getValues()
	// 	console.log(pako.inflate(formValues.defect_description, { to: 'string' }))
	// }, [form.getValues()])

	return (
		<FormProvider {...form}>
			<Form
				onSubmit={form.handleSubmit((data) => {
					console.log({
						...data,
						defect_description: deflate(new TextEncoder().encode(data.defect_description)).toString()
					})
				})}>
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
								{ label: t('ns_inoutbound:shoes_category.b_grade'), value: DefectiveType.B_GRADE },
								{ label: t('ns_inoutbound:shoes_category.c_grade'), value: DefectiveType.C_GRADE },
								{
									label: t('ns_inoutbound:shoes_category.research_development'),
									value: DefectiveType.RESEARCH_DEVELOPMENT
								}
							]}
							labelField='label'
							valueField='value'
						/>
					</Div>
					<Div className={currentCategory === DefectiveType.B_GRADE ? 'col-span-2' : 'col-span-3'}>
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
					{currentCategory === DefectiveType.B_GRADE && (
						<Fragment>
							<Div className='col-span-2'>
								<PurchaseOrderComboboxFieldControl />
							</Div>
							<Div className='col-span-2'>
								<CommandNumberComboboxFieldControl />
							</Div>
						</Fragment>
					)}

					<Div className={currentCategory === DefectiveType.B_GRADE ? 'col-span-2' : 'col-span-3'}>
						<InputFieldControl
							name='factory_shoes_style'
							label={t('ns_erp:fields.shoestyle_codefactory')}
							placeholder='UF25 W960-1'
						/>
					</Div>

					<Div className={currentCategory === DefectiveType.B_GRADE ? 'col-span-2' : 'col-span-3'}>
						<InputFieldControl name='color_sn' label={t('ns_erp:fields.color_sn')} placeholder='BLK' />
					</Div>
					<Div className={currentCategory === DefectiveType.B_GRADE ? 'col-span-2' : 'col-span-3'}>
						<InputFieldControl name='size_code' label='Size' placeholder='01' />
					</Div>
					<Div className='col-span-full'>
						<SelectFieldControl
							name='defect_location'
							label='Defect location'
							datalist={[
								{ label: t('ns_common:others.all'), value: DefectiveLocation.ALL },
								{ label: t('ns_erp:shoes_parts.upper'), value: DefectiveLocation.UPPER },
								{ label: t('ns_erp:shoes_parts.bottom'), value: DefectiveLocation.BOTTOM },
								{ label: t('ns_common:others.other'), value: DefectiveLocation.OTHER }
							]}
							labelField='label'
							valueField='value'
						/>
					</Div>

					<Div className='col-span-full'>
						<InputFieldControl name='storage' label={t('ns_warehouse:fields.storage_name')} placeholder='A1.1' />
					</Div>

					<Div className='col-span-full'>
						<EditorFieldControl name='defect_description' label='Defect description' className='h-60' />
					</Div>
				</Div>
				<Div className='sticky bottom-0 z-20 col-span-full flex items-center justify-end gap-x-2 border-t bg-background p-2'>
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
