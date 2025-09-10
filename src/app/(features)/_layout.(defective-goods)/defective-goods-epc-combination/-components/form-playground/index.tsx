import { CommonActions } from '@/common/constants/enums'
import { IBaseEntity, IDefectiveGoods } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import {
	AutoCompleteFieldControl,
	Button,
	buttonVariants,
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
import { useLocation } from '@tanstack/react-router'
import { useLocalStorageState, useResetState, useUpdateEffect } from 'ahooks'
import { has, isNil, omit } from 'lodash'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { gunzipSync, gzipSync } from 'zlib'
import { DefectDescriptionTemplate } from '../../-constants/templates'
import { CreateDefectiveGoodsFormValues, createDefectiveGoodsSchema } from '../../-schemas/defective-goods.schema'
import PurchaseOrderComboboxFieldControl from '../../../-components/rfid-reader-playground/purchase-order-combobox-field-control'
import { DefectiveCategory, DefectiveCategoryI18n, DefectiveLocation } from '../../../-constants'
import { usePageContext } from '../../../-contexts/page-context'
import {
	useCreateDefectiveGoodsMutation,
	useUpdateDefectiveGoodsMutation
} from '../../../-hooks/use-defective-goods-asm'
import { useSwitchRFIDDevice } from '../../../-hooks/use-switch-rfid-device'
import { useGetProductSpecificationQuery } from '../../../../-hooks/use-product-specification-asm'
import CommandNumberComboboxFieldControl from './command-number-combobox-field-control'
import DeviceRadioGroup from './device-radio-group'
import ListPanelToggleButton from './list-panel-toggle-button'
import ToggleFullscreen from './toggle-fullscreen'
import UserActivityInfo from './user-activity-info'

const DefectiveGoodsForm: React.FC = () => {
	const { t, i18n } = useTranslation()

	const { hash } = useLocation()
	const form = useForm<CreateDefectiveGoodsFormValues & Partial<IBaseEntity>>({
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
	const [formAction, setFormAction, resetFormAction] = useResetState<CommonActions>(null)
	const [useAvailableTemplate, setUseAvailabelTemplate] = useLocalStorageState('useAvailableTemplate', {
		defaultValue: true,
		listenStorageChange: true
	})
	const { currentDevice } = useSwitchRFIDDevice()
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
			setDefaultEditorContent(extractedDescription)
		}
	})

	event$.useSubscription((e: { action: CommonActions; payload: string[] }) => {
		if (e.action === CommonActions.IMPORT) {
			form.setValue('epc', e.payload)
		}
	})

	// Watch form fields
	const currentCategory = useWatch({ control: form.control, name: 'category' })
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
		if (!Array.isArray(data)) return []
		if (!currentBrand)
			return [...new Set(data.flatMap((item) => item.product_variants?.map((item) => item.shoes_style)))]
				.sort()
				.map((item) => ({
					label: item,
					value: item
				}))
		const brand = data.find((item) => item.brand_name === currentBrand)
		if (!brand?.product_variants) return []
		return brand.product_variants.map(({ shoes_style }) => ({
			label: shoes_style,
			value: shoes_style
		}))
	}, [data, currentBrand])

	// Memoized options for color select
	const colorOptions = useMemo(() => {
		if (!Array.isArray(data)) return []
		if (!currentBrand || !currentShoeStyle)
			return [
				...new Set(
					data.flatMap((item) =>
						item.product_variants?.flatMap((item) => item.specs?.map((item) => item.color_sn))
					)
				)
			].map((item) => ({
				label: item,
				value: item
			}))
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
		if (!Array.isArray(data)) return []
		if (!currentBrand || !currentShoeStyle || !currentColor)
			return [
				...new Set(
					data.flatMap((item) =>
						item.product_variants?.flatMap((variant) =>
							variant.specs?.flatMap((spec) => spec.sizes?.map((size) => size.size))
						)
					)
				)
			]
				.sort((a, b) => Number(a) - Number(b))
				.map((size) => ({
					label: size,
					value: size
				}))
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
		if (e.currentTarget.value.length >= 24) {
			e.preventDefault()
			form.setValue('epc', e.currentTarget.value.toUpperCase())
		}
	}, [])

	const handleResetForm = useCallback(() => {
		const currentFormValues = form.getValues()
		for (const key in currentFormValues) {
			switch (key) {
				case 'defect_description':
					currentFormValues[key] = DefectDescriptionTemplate[i18n.language]
					break
				case 'epc':
					if (currentDevice === 'usb') currentFormValues[key] = ''
					break
				default:
					currentFormValues[key] = ''
					break
			}
		}
		form.reset(currentFormValues)
	}, [formAction])

	const handleSubmitForm = useCallback(
		(data: CreateDefectiveGoodsFormValues) => {
			const payload = {
				...data,
				defect_description: gzipSync(data.defect_description, { level: 6, chunkSize: 1024 }).toString('base64')
			}
			const mutateAsync = async () =>
				formAction === CommonActions.UPDATE
					? await updateAsync({ id: hash, data: payload })
					: await createAsync(payload)
			toast.promise(mutateAsync(), {
				loading: t('ns_common:notification.processing_request'),
				success: () => {
					if (formAction === CommonActions.CREATE) form.reset({ ...form.getValues(), epc: '' })
					event$.emit({ action: CommonActions.SAVE, payload: [] })
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
			<Form data-action={formAction === CommonActions.UPDATE} onSubmit={form.handleSubmit(handleSubmitForm)}>
				{/* Form controls */}
				<Div className='col-span-full flex h-max max-h-full min-h-[var(--bar-height)] items-center justify-between gap-x-6 bg-background px-2'>
					<Div className='hidden @7xl:block'>
						<ListPanelToggleButton />
					</Div>
					<Label
						className={cn(buttonVariants({ variant: 'secondary', className: 'inline-flex @7xl:hidden' }))}
						htmlFor='list-sheet-trigger'>
						<Icon name='Clock' /> {t('ns_inoutbound:titles.inbound_history')}
					</Label>
					{isNil(formAction) ? (
						<Button
							type='button'
							size='sm'
							className='ml-auto'
							onClick={() => setFormAction(CommonActions.CREATE)}>
							<Icon name='CircleFadingPlus' size={18} />
							{t('ns_common:actions.add')}
						</Button>
					) : (
						<Div className='ml-auto flex items-center gap-x-2'>
							<Button
								disabled={isPending}
								variant='ghost'
								size='sm'
								type='button'
								className='text-destructive hover:bg-destructive/10 hover:text-destructive'
								onClick={() => {
									resetFormAction()
									handleResetForm()
								}}>
								<Icon name='X' /> {t('ns_common:actions.cancel')}
							</Button>
							<Button
								disabled={isPending}
								variant='secondary'
								size='sm'
								type='button'
								onClick={() => handleResetForm()}>
								<Icon name='Undo2' /> {t('ns_common:actions.reset')}
							</Button>
							<Button
								disabled={isPending}
								size='sm'
								type='submit'
								className={cn(
									isNil(
										formAction
											? 'animate-out fade-out-0 slide-out-to-right-0'
											: 'animate-in fade-in-100 slide-in-from-left-2'
									)
								)}>
								<Icon
									name={isPending ? 'LoaderCircle' : 'Check'}
									className={isPending && 'animate-[spin_1s_linear_infinite]'}
								/>{' '}
								{isError ? t('ns_common:actions.retry') : t('ns_common:actions.save')}
							</Button>
						</Div>
					)}
				</Div>
				{/* User activities timestamp */}
				{formAction === CommonActions.UPDATE && has(form.getValues(), 'created') && (
					<UserActivityInfo
						createdAt={String(form.getValues('created'))}
						createdBy={String(form.getValues('user_code_created'))}
						lastUpdatedAt={String(form.getValues('updated'))}
					/>
				)}
				{/* Form fields */}
				<Div as='fieldset' className='grid flex-1 basis-full grid-cols-6 gap-x-2 gap-y-6 overflow-y-auto p-6'>
					{currentDevice === 'usb' && (
						<Div className='col-span-full'>
							<InputFieldControl
								name='epc'
								label='EPC'
								autoFocus
								autoComplete='off'
								type='search'
								placeholder='Scan EPC tag here'
								onKeyDown={handleEpcChange}
								onKeyDownCapture={handleEpcChange}
								disabled={isNil(formAction)}
								description={t('ns_inoutbound:description.defective_epc_caption')}
							/>
						</Div>
					)}
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
							disabled={isNil(formAction)}
							onValueChange={(value) => {
								if (value !== DefectiveCategory.B_GRADE) {
									form.reset(omit(form.getValues(), ['po', 'mo_no']))
								}
							}}
							labelField='label'
							valueField='value'
						/>
					</Div>

					{currentCategory === DefectiveCategory.B_GRADE && !isNil(formAction) && (
						<Fragment>
							<Div className='col-span-3'>
								<PurchaseOrderComboboxFieldControl />
							</Div>
							<Div className='col-span-3'>
								<CommandNumberComboboxFieldControl />
							</Div>
						</Fragment>
					)}
					<Div className='col-span-3'>
						<SelectFieldControl
							name='brand_name'
							label={t('ns_erp:fields.brand_name')}
							placeholder={t('ns_common:form_placeholder.fill', {
								object: String(t('ns_erp:fields.brand_name')).toLowerCase(),
								defaultValue: null
							})}
							disabled={isNil(formAction)}
							datalist={brandOptions}
							onValueChange={() => {
								form.reset({ ...form.getValues(), factory_shoes_style: '', color_sn: '', size_code: '' })
							}}
							labelField='label'
							valueField='value'
						/>
					</Div>
					<Div className='col-span-3'>
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
							disabled={isNil(formAction)}
							onInput={() => {
								form.reset({ ...form.getValues(), color_sn: '', size_code: '' })
							}}
						/>
					</Div>
					<Div className='col-span-3'>
						<AutoCompleteFieldControl
							name='color_sn'
							label={t('ns_erp:fields.color_sn')}
							placeholder={t('ns_common:form_placeholder.fill', {
								object: String(t('ns_erp:fields.color_sn')).toLowerCase(),
								defaultValue: null
							})}
							disabled={isNil(formAction) || colorOptions.length === 0}
							loading={isLoading}
							datalist={colorOptions}
							labelField='label'
							valueField='value'
							onInput={() => {
								form.reset({ ...form.getValues(), size_code: '' })
							}}
						/>
					</Div>
					<Div className='col-span-3'>
						<AutoCompleteFieldControl
							name='size_code'
							label='Size'
							placeholder={t('ns_common:form_placeholder.fill', {
								object: 'size',
								defaultValue: null
							})}
							disabled={isNil(formAction) || sizeOptions.length === 0}
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
							disabled={isNil(formAction)}
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
					<Div className='relative col-span-full'>
						<Div className='absolute right-0 top-0 inline-flex items-center gap-x-3'>
							<Label htmlFor='toggle-use-desc-template' className='inline-flex items-center gap-x-2'>
								<Icon name='Sparkles' strokeWidth={1.5} /> {t('ns_common:editor.use_available_template')}
							</Label>
							<Switch
								id='toggle-use-desc-template'
								checked={useAvailableTemplate}
								onCheckedChange={(checked) => {
									setUseAvailabelTemplate(checked)
									if (!checked) setDefaultEditorContent('')
								}}
							/>
						</Div>
						<EditorFieldControl
							name='defect_description'
							label={t('ns_erp:fields.defect_description')}
							className='group/container-has-[#toggle-fullscreen[data-state=checked]]:h-screen h-60'
							errorMessage={t('ns_validation:required')}
							defaultValue={defaultEditorContent}
							disabled={!formAction}
						/>
					</Div>
				</Div>
				{/* Footer bar */}
				<Div className='flex max-h-full min-h-[var(--bar-height)] items-center justify-between gap-x-6 bg-background px-4'>
					<ToggleFullscreen />
					<DeviceRadioGroup />
				</Div>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`h-full overflow-y-auto scrollbar-track-accent/50 grid divide-y divide-border data-[action=CREATE]:grid-rows-[var(--bar-height)_auto_var(--bar-height)] data-[action=UPDATE]:grid-rows-[var(--bar-height)_auto_auto_var(--bar-height)] *:box-border`

export default DefectiveGoodsForm
