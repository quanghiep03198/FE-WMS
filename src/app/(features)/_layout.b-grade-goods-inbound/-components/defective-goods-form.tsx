import {
	AutoCompleteFieldControl,
	Button,
	Div,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	SelectFieldControl
} from '@/components/ui'
import { EditorFieldControl } from '@/components/ui/@field-control/editor'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEventEmitter } from 'ahooks'
import { Fragment, useCallback, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { gunzipSync, gzipSync } from 'zlib'
import { DefectiveLocation, DefectiveType } from '../-constants'
import { useGetProductSpecificationQuery } from '../-hooks/use-product-specification-asm'
import { CreateDefectiveGoodsFormValues, createDefectiveGoodsSchema } from '../-schemas/defective-goods.schema'
import CommandNumberComboboxFieldControl from './command-number-combobox-field-control'
import PurchaseOrderComboboxFieldControl from './purchase-order-combobox-field-control'

const DefectiveGoodsForm: React.FC = () => {
	const form = useForm<CreateDefectiveGoodsFormValues>({
		resolver: zodResolver(createDefectiveGoodsSchema)
	})
	const { t } = useTranslation()
	const { data, isLoading } = useGetProductSpecificationQuery()

	const currentCategory = useWatch({ control: form.control, name: 'category' })
	// Watch form fields
	const currentEpc = useWatch({ control: form.control, name: 'epc' })
	const currentBrand = useWatch({ control: form.control, name: 'brand_name' })
	const currentShoeStyle = useWatch({ control: form.control, name: 'factory_shoes_style' })
	const currentColor = useWatch({ control: form.control, name: 'color_sn' })

	// Memoized options for brand select
	const brandOptions = useMemo(() => {
		if (!Array.isArray(data)) return []
		return data.map(({ brand_name }) => ({
			label: brand_name,
			value: brand_name
		}))
	}, [data])

	// Memoized options for shoe style select
	const shoeStyleOptions = useMemo(() => {
		if (!Array.isArray(data) || !currentBrand) return []
		const brand = data.find((item) => item.brand_name === currentBrand)
		if (!brand?.product_variants) return []
		return brand.product_variants.map(({ shoes_style }) => ({
			label: shoes_style,
			value: shoes_style
		}))
	}, [data, currentBrand])

	// Memoized options for color select
	const colorOptions = useMemo(() => {
		if (!Array.isArray(data) || !currentBrand || !currentShoeStyle) return []
		const brand = data.find((item) => item.brand_name === currentBrand)
		const variant = brand?.product_variants?.find((item) => item.shoes_style === currentShoeStyle)
		if (!variant?.spec) return []
		return variant.spec.map(({ color_sn }) => ({
			label: color_sn,
			value: color_sn
		}))
	}, [data, currentBrand, currentShoeStyle])

	// Memoized options for size select
	const sizeOptions = useMemo(() => {
		if (!Array.isArray(data) || !currentBrand || !currentShoeStyle || !currentColor) return []
		const brand = data.find((item) => item.brand_name === currentBrand)
		const variant = brand?.product_variants?.find((item) => item.shoes_style === currentShoeStyle)
		const spec = variant?.spec?.find((item) => item.color_sn === currentColor)
		if (!spec?.sizes) return []
		return spec.sizes
			.sort((a, b) => Number(a.size) - Number(b.size))
			.map(({ size }) => ({
				label: size,
				value: size
			}))
	}, [data, currentBrand, currentShoeStyle, currentColor])

	const handleEpcChange: React.KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
		if (e.key === 'Backspace') {
			form.reset({ ...form.getValues(), epc: '' })
			return
		}
		if (e.key === 'Enter') {
			e.preventDefault()
			e.stopPropagation()
		}
		if (e.currentTarget.value.length === 24) {
			form.setValue('epc', e.currentTarget.value.toUpperCase())
			e.preventDefault()
		}
	}, [])

	const event$ = useEventEmitter<CreateDefectiveGoodsFormValues>()

	event$.useSubscription((value) => {
		console.log('Submmitted values :>>>', {
			...value,
			defect_description: gunzipSync(Buffer.from(value.defect_description, 'base64')).toString()
		})
	})

	return (
		<FormProvider {...form}>
			<Form
				onSubmit={form.handleSubmit((data) => {
					const payload = {
						...data,
						defect_description: gzipSync(data.defect_description, { level: 6, chunkSize: 1024 }).toString(
							'base64'
						)
					}
					console.log('payload :>> ', payload)
					event$.emit(payload)
				})}>
				<Div as='fieldset' className='grid grid-cols-6 gap-x-2 gap-y-6 p-6'>
					<Div className='col-span-full'>
						<InputFieldControl
							name='epc'
							label='EPC'
							autoFocus
							autoComplete='off'
							placeholder='Scan EPC tag here'
							onKeyDown={handleEpcChange}
							onKeyDownCapture={handleEpcChange}
							description={t('ns_validation:min_length')}
						/>
					</Div>
					<Div className='col-span-full'>
						<SelectFieldControl
							name='category'
							label={t('ns_erp:fields.category')}
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
						<AutoCompleteFieldControl
							name='brand_name'
							label={t('ns_erp:fields.brand_name')}
							placeholder={t('ns_common:form_placeholder.fill', {
								object: String(t('ns_erp:fields.brand_name')).toLowerCase(),
								defaultValue: null
							})}
							loading={isLoading}
							datalist={brandOptions}
							onInput={() => {
								form.reset({ ...form.getValues(), factory_shoes_style: '', color_sn: '', size_code: '' })
							}}
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
						<AutoCompleteFieldControl
							name='factory_shoes_style'
							label={t('ns_erp:fields.shoestyle_codefactory')}
							placeholder={t('ns_common:form_placeholder.fill', {
								object: String(t('ns_erp:fields.shoestyle_codefactory')).toLowerCase(),
								defaultValue: null
							})}
							loading={isLoading}
							datalist={shoeStyleOptions}
							labelField='label'
							valueField='value'
							onInput={() => {
								form.reset({ ...form.getValues(), color_sn: '', size_code: '' })
							}}
						/>
					</Div>

					<Div className={currentCategory === DefectiveType.B_GRADE ? 'col-span-2' : 'col-span-3'}>
						<AutoCompleteFieldControl
							name='color_sn'
							label={t('ns_erp:fields.color_sn')}
							placeholder={t('ns_common:form_placeholder.fill', {
								object: String(t('ns_erp:fields.color_sn')).toLowerCase(),
								defaultValue: null
							})}
							loading={isLoading}
							datalist={colorOptions}
							labelField='label'
							valueField='value'
							onInput={() => {
								form.reset({ ...form.getValues(), size_code: '' })
							}}
						/>
					</Div>
					<Div className={currentCategory === DefectiveType.B_GRADE ? 'col-span-2' : 'col-span-3'}>
						<AutoCompleteFieldControl
							name='size_code'
							label='Size'
							placeholder={t('ns_common:form_placeholder.fill', {
								object: 'size',
								defaultValue: null
							})}
							loading={isLoading}
							datalist={sizeOptions}
							labelField='label'
							valueField='value'
						/>
					</Div>
					<Div className='col-span-full'>
						<SelectFieldControl
							name='defect_location'
							label={t('ns_erp:fields.defect_location')}
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
						<EditorFieldControl
							name='defect_description'
							label={t('ns_erp:fields.defect_description')}
							className='h-60'
							errorMessage={t('ns_validation:required')}
						/>
					</Div>
				</Div>
				<Div className='sticky bottom-0 z-20 col-span-full flex items-center justify-end gap-x-2 border-t bg-background p-2'>
					<Button variant='secondary' size='sm' type='button' onClick={() => form.reset()}>
						<Icon name='Undo2' /> {t('ns_common:actions.reset')}
					</Button>
					<Button size='sm' type='submit'>
						<Icon name='Check' /> {t('ns_common:actions.save')}
					</Button>
				</Div>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`h-full overflow-y-auto`

export default DefectiveGoodsForm
