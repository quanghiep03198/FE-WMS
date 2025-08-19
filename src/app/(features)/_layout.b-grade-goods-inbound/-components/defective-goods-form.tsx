import { CommonActions } from '@/common/constants/enums'
import { IDefectiveGoods } from '@/common/types/entities'
import {
	AutoCompleteFieldControl,
	Button,
	Div,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	Label,
	SelectFieldControl,
	Switch
} from '@/components/ui'
import { EditorFieldControl } from '@/components/ui/@field-control/editor'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalStorageState, useResetState, useUpdateEffect } from 'ahooks'
import { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { gunzipSync, gzipSync } from 'zlib'
import { DefectiveCategory, DefectiveCategoryI18n, DefectiveLocation } from '../-constants'
import { DefectDescriptionTemplate } from '../-constants/templates'
import { usePageContext } from '../-contexts/page-context'
import { useCreateDefectiveGoodsMutation, useUpdateDefectiveGoodsMutation } from '../-hooks/use-defective-goods-asm'
import { CreateDefectiveGoodsFormValues, createDefectiveGoodsSchema } from '../-schemas/defective-goods.schema'
import { useGetProductSpecificationQuery } from '../../-hooks/use-product-specification-asm'
import CommandNumberComboboxFieldControl from './command-number-combobox-field-control'
import PurchaseOrderComboboxFieldControl from './purchase-order-combobox-field-control'

const DefectiveGoodsForm: React.FC = () => {
	const { t, i18n } = useTranslation()
	const form = useForm<CreateDefectiveGoodsFormValues>({
		resolver: zodResolver(createDefectiveGoodsSchema),
		defaultValues: {
			defect_description: DefectDescriptionTemplate[i18n.language]
		}
	})
	const { data, isLoading } = useGetProductSpecificationQuery()
	const {
		mutateAsync: createAsync,
		isPending: isCreating,
		isError: isFailedToCreate
	} = useCreateDefectiveGoodsMutation()
	const {
		mutateAsync: updateAsync,
		isPending: isUpdating,
		isError: isFailedToUpdate
	} = useUpdateDefectiveGoodsMutation()
	const [formAction, setFormAction, resetFormAction] = useResetState<CommonActions>(CommonActions.CREATE)
	const currentIdRef = useRef<string>(null)
	const [useAvailableTemplate, setUseAvailabelTemplate] = useLocalStorageState('useAvailableTemplate', {
		defaultValue: true,
		listenStorageChange: true
	})
	const [defaultEditorContent, setDefaultEditorContent] = useState<string>(() =>
		useAvailableTemplate ? DefectDescriptionTemplate[i18n.language] : ''
	)

	useUpdateEffect(() => {
		if (useAvailableTemplate) setDefaultEditorContent(DefectDescriptionTemplate[i18n.language])
	}, [i18n.language, useAvailableTemplate])

	const { event$ } = usePageContext()

	event$.useSubscription((e: { action: CommonActions; payload: IDefectiveGoods }) => {
		if (e.action === CommonActions.UPDATE) {
			setFormAction(CommonActions.UPDATE)
			const extractedDescription: string = gunzipSync(Buffer.from(e.payload.defect_description, 'base64')).toString()
			form.reset({ ...e.payload, defect_description: extractedDescription })
			currentIdRef.current = e.payload.id
			setDefaultEditorContent(extractedDescription)
		}
	})

	const currentCategory = useWatch({ control: form.control, name: 'category' })
	// Watch form fields
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
		if (!variant?.specs) return []
		return variant.specs.map(({ color_sn }) => ({
			label: color_sn,
			value: color_sn
		}))
	}, [data, currentBrand, currentShoeStyle])

	// Memoized options for size select
	const sizeOptions = useMemo(() => {
		if (!Array.isArray(data) || !currentBrand || !currentShoeStyle || !currentColor) return []
		const brand = data.find((item) => item.brand_name === currentBrand)
		const variant = brand?.product_variants?.find((item) => item.shoes_style === currentShoeStyle)
		const spec = variant?.specs?.find((item) => item.color_sn === currentColor)
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
	}, [])

	const onMutateSuccessfully = () => {
		resetFormAction()
		currentIdRef.current = null
		const currentFormValues = form.getValues()
		for (const key in currentFormValues) {
			if (key === 'defect_description') currentFormValues[key] = DefectDescriptionTemplate[i18n.language]
			else currentFormValues[key] = ''
		}
		form.reset(currentFormValues)
		setDefaultEditorContent(DefectDescriptionTemplate[i18n.language])
	}

	const handleSubmitForm = useCallback(
		(data: CreateDefectiveGoodsFormValues) => {
			const payload = {
				...data,
				defect_description: gzipSync(data.defect_description, { level: 6, chunkSize: 1024 }).toString('base64')
			}
			const mutateAsync = async () =>
				formAction === CommonActions.UPDATE
					? await updateAsync({ id: currentIdRef.current, data: payload })
					: await createAsync(payload)
			toast.promise(mutateAsync(), {
				loading: t('ns_common:notification.processing_request'),
				success: () => {
					onMutateSuccessfully()
					return t('ns_common:notification.success')
				},
				error: t('ns_common:notification.error')
			})
		},
		[formAction]
	)

	const isPending = isCreating || isUpdating
	const isError = isFailedToCreate || isFailedToUpdate

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit(handleSubmitForm)}>
				<Div className='sticky top-0 z-20 col-span-full flex items-center justify-between gap-x-2 border-b bg-background px-6 py-2'>
					<Div className='inline-flex items-center gap-x-2'>
						<Label htmlFor='toggle-use-template' className='inline-flex items-center gap-x-2'>
							<Icon name='Sparkles' /> {t('ns_common:editor.use_available_template')}
						</Label>
						<Switch
							id='toggle-use-template'
							checked={useAvailableTemplate}
							onCheckedChange={(checked) => {
								setUseAvailabelTemplate(checked)
								if (!checked) setDefaultEditorContent('')
							}}
						/>
					</Div>

					<Div className='relative h-8 rounded-[var(--radius)] bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 p-px'>
						<Button
							type='button'
							size='sm'
							className='h-full'
							onClick={() =>
								toast.info('This feature is under development', {
									description: 'Please try again later. We are working on it.',
									duration: 5000
								})
							}>
							<Icon name='WandSparkles' />
							{t('ns_common:editor.create_custom_template')}
						</Button>
					</Div>
				</Div>
				<Div as='fieldset' className='grid grid-cols-6 gap-x-2 gap-y-6 p-6'>
					<Div className='col-span-full'>
						<InputFieldControl
							name='epc'
							label='EPC'
							autoFocus
							autoComplete='off'
							placeholder='Scan EPC tag here'
							onChange={(e) => {
								if (e.currentTarget.value.length >= 24) {
									e.preventDefault()
									return
								}
								form.setValue('epc', e.currentTarget.value.toUpperCase())
							}}
							onKeyDown={handleEpcChange}
							onKeyDownCapture={handleEpcChange}
							description={t('ns_inoutbound:description.defective_epc_caption')}
						/>
					</Div>
					<Div className='col-span-full'>
						<SelectFieldControl
							name='category'
							label={t('ns_erp:fields.category')}
							datalist={[
								{
									label: t(DefectiveCategoryI18n['B'], {
										ns: 'ns_inoutbound',
										defaultValue: DefectiveCategory.B_GRADE
									}),
									value: DefectiveCategory.B_GRADE
								},
								{
									label: t(DefectiveCategoryI18n['C'], {
										ns: 'ns_inoutbound',
										defaultValue: DefectiveCategory.C_GRADE
									}),
									value: DefectiveCategory.C_GRADE
								},
								{
									label: t(DefectiveCategoryI18n['RD'], {
										ns: 'ns_inoutbound',
										defaultValue: DefectiveCategory.RESEARCH_DEVELOPMENT
									}),
									value: DefectiveCategory.RESEARCH_DEVELOPMENT
								}
							]}
							labelField='label'
							valueField='value'
						/>
					</Div>
					<Div className={currentCategory === DefectiveCategory.B_GRADE ? 'col-span-2' : 'col-span-3'}>
						<SelectFieldControl
							name='brand_name'
							label={t('ns_erp:fields.brand_name')}
							placeholder={t('ns_common:form_placeholder.fill', {
								object: String(t('ns_erp:fields.brand_name')).toLowerCase(),
								defaultValue: null
							})}
							datalist={brandOptions}
							onValueChange={() => {
								form.reset({ ...form.getValues(), factory_shoes_style: '', color_sn: '', size_code: '' })
							}}
							labelField='label'
							valueField='value'
						/>
					</Div>
					{currentCategory === DefectiveCategory.B_GRADE && (
						<Fragment>
							<Div className='col-span-2'>
								<PurchaseOrderComboboxFieldControl />
							</Div>
							<Div className='col-span-2'>
								<CommandNumberComboboxFieldControl />
							</Div>
						</Fragment>
					)}
					<Div className={currentCategory === DefectiveCategory.B_GRADE ? 'col-span-2' : 'col-span-3'}>
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
					<Div className={currentCategory === DefectiveCategory.B_GRADE ? 'col-span-2' : 'col-span-3'}>
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
					<Div className={currentCategory === DefectiveCategory.B_GRADE ? 'col-span-2' : 'col-span-3'}>
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
						<InputFieldControl
							name='storage_location'
							label={t('ns_warehouse:fields.storage_name')}
							placeholder='A1.1'
						/>
					</Div>

					<Div className='col-span-full'>
						<EditorFieldControl
							name='defect_description'
							label={t('ns_erp:fields.defect_description')}
							className='h-60'
							errorMessage={t('ns_validation:required')}
							defaultValue={defaultEditorContent}
						/>
					</Div>
				</Div>
				<Div className='sticky bottom-0 z-20 col-span-full flex items-center justify-end gap-x-2 border-t bg-background px-6 py-2'>
					<Button disabled={isPending} variant='secondary' size='sm' type='button' onClick={() => form.reset()}>
						<Icon name='Undo2' /> {t('ns_common:actions.reset')}
					</Button>
					<Button disabled={isPending} size='sm' type='submit'>
						<Icon
							name={isPending ? 'LoaderCircle' : 'Check'}
							className={isPending && 'animate-[spin_1s_linear_infinite]'}
						/>{' '}
						{isError ? t('ns_common:actions.retry') : t('ns_common:actions.save')}
					</Button>
				</Div>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`h-full overflow-y-auto`

export default DefectiveGoodsForm
