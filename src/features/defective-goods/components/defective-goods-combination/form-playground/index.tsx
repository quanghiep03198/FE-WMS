'use no memo'

import { CommonActions, UserRole } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import { sanitizeDescription } from '@common/utils/sanitize-description'
import Editor, { type EditorHandle } from '@components/addons/tiptap'
import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { InputFieldControl } from '@components/forms/input'
import { SelectFieldControl } from '@components/forms/select'
import RoleBaseAccessControl, { ACTION_RESTRICTED_TOAST_ID } from '@components/guards/role-base-access-control'
import { Button } from '@components/ui/button'
import { Checkbox } from '@components/ui/checkbox'
import { Field } from '@components/ui/field'
import { Form as FormProvider } from '@components/ui/form'
import { Icon } from '@components/ui/icon'
import { Label } from '@components/ui/label'
import { useGetManufacturingOrderQuery } from '@features/order/hooks/use-order-request'
import { useGetProductSpecsQuery } from '@features/product-specification/hooks/use-product-specs-request'
import { MobileReaderPlaygroundTrigger } from '@features/rfid-agent/components/playground/mobile-playground'
import PurchaseOrderFieldControl from '@features/rfid-agent/components/playground/purchase-order-field-control'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useLocalStorageState, usePrevious, useResetState, useUpdateEffect } from 'ahooks'
import { isEmpty, isNil } from 'lodash-es'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import {
	CombinationStrategy,
	DefectiveCategory,
	DefectiveGoodsSource,
	DefectiveLocation
} from '../../../constants/enums'
import { DefectDescriptionTemplate } from '../../../constants/templates'
import { usePageContext } from '../../../contexts/page-context'
import {
	useCreateDefectiveGoodsMutation,
	useUpdateDefectiveGoodsMutation
} from '../../../hooks/use-defective-goods-request'
import { useSwitchCombinationStrategy } from '../../../hooks/use-switch-combination-strategy'
import type {
	CreateDefectiveGoodsFormValues,
	DefectiveGoodsCombinationFormValues
} from '../../../schemas/defective-goods.schema'
import { createDefectiveGoodsSchema, updateDefectiveGoodsSchema } from '../../../schemas/defective-goods.schema'
import { DataListPanelSheetTrigger } from '../data-list-panel'
import AssemblyLineFieldControl from './assembly-line-field-control'
import BrandFieldControl from './brand-field-control'
import CategoryFieldControl from './category-field-control'
import ColorFieldControl from './color-field-control'
import CombinationStrategySelect from './combination-strategy-select'
import CustShoeStyleFieldControl from './cust-shoe-style-field-control'
import FactoryShoeStyleFieldControl from './factory-shoe-style-field-control'
import ListPanelToggle from './list-panel-toggle'
import ManufacturingOrderFieldControl from './manufacturing-order-field-control'
import SewingLineFieldControl from './sewing-line-field-control'
import { ShoeSourceFieldControl } from './shoe-source-field-control'
import SizeFieldControl from './size-field-control'
import ToggleFullscreen from './toggle-fullscreen'
import UserActivityInfo from './user-activity-info'

const DefectiveGoodsForm: React.FC = () => {
	const { t, i18n } = useTranslation()
	const hash = useLocation({ select: (state) => state.hash })
	const navigate = useNavigate()
	const [formAction, setFormAction, resetFormAction] = useResetState<Nullish<CommonActions>>(null)
	const [useAvailableTemplate, setUseAvailabelTemplate] = useLocalStorageState('useAvailableTemplate', {
		defaultValue: true
	})
	const { currentStrategy, setStrategy } = useSwitchCombinationStrategy()
	const previousStrategy = usePrevious(currentStrategy)

	const schemaRef = useRef<any>(createDefectiveGoodsSchema)

	const form = useForm<DefectiveGoodsCombinationFormValues>({
		resolver: zodResolver(schemaRef.current),
		defaultValues: {
			shoe_source: DefectiveGoodsSource.FINAL_INSPECTION,
			defective_description: useAvailableTemplate ? DefectDescriptionTemplate[i18n.language] : undefined
		}
	})

	const editorRef = useRef<EditorHandle | null>(null)
	const initialEditorContent = useRef('')
	const pendingEditorContent = useRef<string | null>(null)
	const updateOrder = useRef<string | null | undefined>(undefined)
	const [editorReady, setEditorReady] = useState(false)
	const [imageUploading, setImageUploading] = useState(false)
	const setEditorRef = useCallback((editor: EditorHandle | null) => {
		editorRef.current = editor
		const commands = editor?.commands()
		if (commands && pendingEditorContent.current !== null) {
			commands.setContent(pendingEditorContent.current)
			pendingEditorContent.current = null
		}
		setEditorReady(!!commands)
	}, [])

	// Watch form fields
	const currentManufacturingOrder = useWatch({ control: form.control, name: 'mo_no' })
	const currentCategory = useWatch({ control: form.control, name: 'defective_category' })

	const { isLoading } = useGetProductSpecsQuery()
	const { data: orderDetail } = useGetManufacturingOrderQuery(currentManufacturingOrder)

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

	const { event$ } = usePageContext()

	event$.useSubscription((e) => {
		if (e.action === CommonActions.UPDATE) {
			schemaRef.current = updateDefectiveGoodsSchema
			updateOrder.current = e.payload.mo_no ?? null
			const description = e.payload.defective_description ?? ''
			const commands = editorRef.current?.commands()
			if (commands) {
				commands.setContent(description)
				pendingEditorContent.current = null
			} else {
				initialEditorContent.current = description
				pendingEditorContent.current = editorRef.current ? description : null
			}
			setFormAction(CommonActions.UPDATE)
			form.reset(e.payload)
		}
	})

	event$.useSubscription((e) => {
		if (e.action === CommonActions.IMPORT) {
			form.setValue('epc', e.payload)
		}
	})

	useEffect(() => {
		if (form.formState.submitCount === 0) return

		if (editorRef.current?.isEmpty()) {
			form.setError('defective_description', { type: 'required', message: t('ns_erp:errors.required') })
		} else {
			form.clearErrors('defective_description')
		}
	}, [form.formState.submitCount])

	useEffect(() => {
		if (!orderDetail) return
		if (updateOrder.current !== undefined && currentManufacturingOrder === updateOrder.current) return
		updateOrder.current = undefined
		form.reset({
			...form.getValues(),
			cust_shoes_style: orderDetail.cust_shoes_style,
			factory_shoes_style: orderDetail.factory_shoes_style,
			brand_name: orderDetail.brand_name,
			color_sn: orderDetail.color_sn
		})
	}, [orderDetail, currentManufacturingOrder])

	useEffect(() => {
		if (formAction === CommonActions.CREATE) {
			form.reset({
				...form.getValues(),
				factory_shoes_style: '',
				cust_shoes_style: '',
				color_sn: '',
				...(shouldRequireFullInfo && { po: '', mo_no: '' }),
				...(currentStrategy === CombinationStrategy.MANUALLY ? { sizes: [] } : { size_numcode: '' })
			})
			form.setValue('combination_strategy', currentStrategy)
		}
		if (formAction === CommonActions.UPDATE && currentStrategy !== null) {
			setStrategy(null)
		}
	}, [formAction, currentStrategy])

	useUpdateEffect(() => {
		if (useAvailableTemplate) editorRef.current?.commands()?.setContent(DefectDescriptionTemplate[i18n.language])
		else editorRef.current?.clearContent()
	}, [i18n.language, useAvailableTemplate])

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

	const handleResetForm = () => {
		const currentFormValues = form.getValues()
		for (const key in currentFormValues) {
			switch (key) {
				case 'defective_description':
					currentFormValues[key] = DefectDescriptionTemplate[i18n.language]
					break
				case 'epc':
					if (currentStrategy === CombinationStrategy.USB) currentFormValues[key] = ''
					break
				case 'sizes':
					if (currentStrategy === CombinationStrategy.MANUALLY) currentFormValues[key] = []
					break
				case 'shoe_source':
					currentFormValues[key] = DefectiveGoodsSource.FINAL_INSPECTION
					break
				default:
					currentFormValues[key] = ''
					break
			}
		}
		form.reset(currentFormValues)
		if (useAvailableTemplate)
			if (editorReady) editorRef.current?.commands()?.setContent(DefectDescriptionTemplate[i18n.language])
	}

	const handleCancel = () => {
		updateOrder.current = undefined
		pendingEditorContent.current = null
		resetFormAction()
		handleResetForm()
		if (!currentStrategy) setStrategy(previousStrategy)
		if (hash) navigate({ to: '/defective-goods-epc-combination', hash: undefined, search: (prev) => prev })
	}

	const handleSubmitForm = async (data: CreateDefectiveGoodsFormValues) => {
		if (!editorRef.current?.commands() || editorRef.current.isUploading()) {
			toast.warning(t('ns_common:editor.wait_for_upload'))
			return
		}
		data.defective_description = editorRef.current?.getHTML?.() ?? ''

		if (!data.defective_description) {
			form.setError('defective_description', { type: 'required', message: t('ns_validation:required') })
			return
		} else {
			form.clearErrors('defective_description')
		}

		if (data.combination_strategy === CombinationStrategy.MANUALLY && formAction === CommonActions.CREATE) {
			delete data.epc
			delete data.size_numcode
		}

		const payload = {
			...data,
			po: isNil(data.po) || isEmpty(data.po) ? 'PRELOAD' : data.po
		}

		const mutateAsync = async () =>
			formAction === CommonActions.UPDATE
				? await updateAsync({ id: hash, data: payload })
				: await createAsync(payload)

		await mutateAsync()

		if (formAction === CommonActions.CREATE)
			form.reset({
				...form.getValues(),
				...(data.combination_strategy === CombinationStrategy.USB && { epc: '' }),
				...(data.combination_strategy === CombinationStrategy.MANUALLY && { sizes: [{}] })
			})
		if (formAction === CommonActions.UPDATE) {
			handleCancel()
		}
		if (data.combination_strategy === CombinationStrategy.UHF)
			event$.emit({ action: CommonActions.SAVE, payload: [] })
	}

	const isPending: boolean = isCreating || isUpdating || imageUploading
	const isError: boolean = isFailedToCreate || isFailedToUpdate
	const shouldRequireFullInfo: boolean =
		currentCategory === DefectiveCategory.B_GRADE || currentCategory === DefectiveCategory.C_GRADE

	return (
		<FormProvider {...form}>
			<Form data-action={formAction} onSubmit={form.handleSubmit(handleSubmitForm)}>
				{/* Form controls */}
				<Div
					className='bg-background col-span-full flex h-max max-h-full min-h-(--bar-height) items-center justify-between gap-x-6 px-2'
					id='combination-form-header'>
					<ListPanelToggle />
					<DataListPanelSheetTrigger />
					<RoleBaseAccessControl
						authorizedRoles={[UserRole.DG_WAREHOUSE_STAFF]}
						mode='fallback'
						fallbackComponent={
							<Button
								className='cursor-not-allowed'
								size='sm'
								type='button'
								onClick={() =>
									toast.warning(t('ns_common:errors.403_notification'), { id: ACTION_RESTRICTED_TOAST_ID })
								}>
								<Icon name='Lock' /> {t('ns_common:actions.add')}
							</Button>
						}>
						{isNil(formAction) ? (
							<Button
								className='ml-auto'
								size='sm'
								type='button'
								onClick={() => {
									initialEditorContent.current =
										form.getValues('defective_description') ??
										(useAvailableTemplate ? DefectDescriptionTemplate[i18n.language] : '')
									setFormAction(CommonActions.CREATE)
								}}>
								<Icon name='CircleFadingPlus' size={18} />
								{t('ns_common:actions.add')}
							</Button>
						) : (
							<Div className='ml-auto flex items-center gap-x-2'>
								<Button
									disabled={isPending}
									size='sm'
									type='button'
									variant='destructive'
									onClick={handleCancel}>
									<Icon name='X' /> {t('ns_common:actions.cancel')}
								</Button>
								<Button
									disabled={isPending}
									size='sm'
									type='button'
									variant='secondary'
									onClick={() => handleResetForm()}>
									<Icon name='Undo2' /> {t('ns_common:actions.reset')}
								</Button>
								<Button
									disabled={isPending || !editorReady}
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
										aria-busy={isPending}
										className='aria-busy:animate-spin'
										name={isPending ? 'LoaderCircle' : 'Check'}
									/>{' '}
									{isError ? t('ns_common:actions.retry') : t('ns_common:actions.save')}
								</Button>
							</Div>
						)}
					</RoleBaseAccessControl>
				</Div>
				{/* User activities timestamp */}
				{formAction === CommonActions.UPDATE && (
					<UserActivityInfo
						createdAt={form.getValues('created_at')}
						createdBy={form.getValues('user_code_created')}
						lastUpdatedAt={form.getValues('updated')}
					/>
				)}
				{/* Form fields */}
				<Div as='fieldset' className='grid flex-1 basis-full grid-cols-6 gap-x-2 gap-y-6 overflow-y-auto p-6'>
					{(currentStrategy === CombinationStrategy.USB || formAction === CommonActions.UPDATE) && (
						<Div className='col-span-full'>
							<InputFieldControl
								autoFocus
								autoComplete='off'
								description={t('ns_inoutbound:description.defective_epc_caption')}
								disabled={isNil(formAction)}
								label='EPC'
								name='epc'
								placeholder='E28*********************'
								tabIndex={0}
								type='search'
								onKeyDown={handleEpcChange}
								onKeyDownCapture={handleEpcChange}
							/>
						</Div>
					)}
					<Div className='col-span-full'>
						<CategoryFieldControl disabled={isNil(formAction)} />
					</Div>
					<Div className='col-span-full'>
						<BrandFieldControl
							className={shouldRequireFullInfo && 'pointer-event-none'}
							disabled={isNil(formAction)}
						/>
					</Div>
					{shouldRequireFullInfo && !isNil(formAction) && (
						<Fragment>
							<Div className='col-span-3'>
								<PurchaseOrderFieldControl disabled={isNil(formAction)} />
							</Div>
							<Div className='col-span-3'>
								<ManufacturingOrderFieldControl disabled={isNil(formAction)} />
							</Div>
						</Fragment>
					)}
					<Div
						className={cn(
							'col-span-full',
							currentStrategy === CombinationStrategy.MANUALLY
								? '@xl/combination-form:col-span-2'
								: '@xl/combination-form:col-span-3'
						)}>
						<FactoryShoeStyleFieldControl disabled={isNil(formAction)} loading={isLoading} />
					</Div>
					<Div
						className={cn(
							'col-span-full',
							currentStrategy === CombinationStrategy.MANUALLY
								? '@xl/combination-form:col-span-2'
								: '@xl/combination-form:col-span-3'
						)}>
						<CustShoeStyleFieldControl disabled={isNil(formAction)} loading={isLoading} />
					</Div>
					<Div
						className={cn(
							'col-span-full',
							currentStrategy === CombinationStrategy.MANUALLY
								? 'col-span-full @xl/combination-form:col-span-2'
								: 'col-span-full @xl/combination-form:col-span-3'
						)}>
						<ColorFieldControl
							disabled={isNil(formAction)}
							loading={isLoading}
							readOnly={shouldRequireFullInfo}
						/>
					</Div>
					<Div
						className={cn(
							currentStrategy === CombinationStrategy.MANUALLY
								? 'col-span-full'
								: 'col-span-full @xl/combination-form:col-span-3'
						)}>
						<SizeFieldControl
							disabled={isNil(formAction)}
							loading={isLoading}
							name={currentStrategy === CombinationStrategy.MANUALLY ? 'sizes' : 'size_numcode'}
							datalist={
								Array.isArray(orderDetail?.sizes)
									? orderDetail.sizes
											.sort((s1, s2) =>
												s1.size_numcode.localeCompare(s2.size_numcode, undefined, { numeric: true })
											)
											.map((s) => {
												return { label: s.size_numcode, value: s.size_numcode }
											})
									: []
							}
						/>
					</Div>
					<Div className='col-span-full @xl/combination-form:col-span-3'>
						<SewingLineFieldControl disabled={!formAction} />
					</Div>
					<Div className='col-span-full @xl/combination-form:col-span-3'>
						<AssemblyLineFieldControl disabled={!formAction} />
					</Div>
					<Div className='col-span-full @xl/combination-form:col-span-3'>
						<SelectFieldControl
							disabled={isNil(formAction)}
							label={t('ns_erp:fields.defective_location')}
							labelField='label'
							name='defective_location'
							valueField='value'
							datalist={[
								{ label: t('ns_common:others.all'), value: DefectiveLocation.ALL },
								{ label: t('ns_erp:shoes_parts.upper'), value: DefectiveLocation.UPPER },
								{ label: t('ns_erp:shoes_parts.bottom'), value: DefectiveLocation.BOTTOM },
								{ label: t('ns_common:others.other'), value: DefectiveLocation.OTHER }
							]}
						/>
					</Div>
					<Div className='col-span-full @xl/combination-form:col-span-3'>
						<ShoeSourceFieldControl disabled={isNil(formAction)} />
					</Div>
					<Div className='relative col-span-full'>
						<Div className='absolute -top-1 right-0 inline-flex items-center gap-x-3'>
							<Label className='inline-flex items-center gap-x-2' htmlFor='toggle-use-desc-template'>
								<Icon name='Sparkles' strokeWidth={1.5} />
								{t('ns_common:editor.use_available_template')}
							</Label>
							<Checkbox
								checked={useAvailableTemplate}
								disabled={isNil(formAction)}
								id='toggle-use-desc-template'
								onCheckedChange={(checked) => setUseAvailabelTemplate(Boolean(checked))}
							/>
						</Div>
						<Field
							aria-invalid={!!form.getErrors('defective_description')}
							className='gap-1 [&[aria-invalid=true]_div[aria-roledescription="editor"]]:border-destructive!'>
							<Label
								aria-invalid={!!form.getErrors('defective_description')}
								className='aria-invalid:text-destructive'
								htmlFor='defective-description'>
								{t('ns_erp:fields.defective_description')}
							</Label>
							{isNil(formAction) ? (
								<Div
									className='prose prose-li:p-0 prose-p:text-sm prose-strong:text-inherit min-h-[50vh] max-w-full rounded-lg border p-4'
									dangerouslySetInnerHTML={{
										__html: sanitizeDescription(form.getValues('defective_description') || '')
									}}
								/>
							) : (
								<Editor
									defaultValue={initialEditorContent.current}
									id='defective-description'
									ref={setEditorRef}
									onUploadStateChange={setImageUploading}
								/>
							)}
							{form.getErrors('defective_description') && (
								<Typography
									className={cn(
										'text-destructive inline-flex items-center gap-x-1 text-[0.8rem] font-medium'
									)}>
									<Icon name='TriangleAlert' />
									{t(form.getErrors('defective_description').message)}
								</Typography>
							)}
						</Field>
					</Div>
				</Div>
				{/* Footer bar */}
				<Div className='bg-background flex max-h-full min-h-(--bar-height) items-center justify-between gap-x-2 px-4'>
					<MobileReaderPlaygroundTrigger />
					<ToggleFullscreen />
					<CombinationStrategySelect disabled={formAction === CommonActions.UPDATE} />
				</Div>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`
	h-full overflow-y-auto scrollbar-track-accent/50 grid divide-y divide-border @container/combination-form
	data-[action=CREATE]:grid-rows-[var(--bar-height)_auto_var(--bar-height)] 
	data-[action=UPDATE]:grid-rows-[var(--bar-height)_auto_auto_var(--bar-height)] 
`

export default DefectiveGoodsForm
