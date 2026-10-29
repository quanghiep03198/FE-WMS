'use no memo'

import { CommonActions, UserRole } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import Editor from '@components/addons/tiptap'
import { Div } from '@components/customs/div'
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
import type { SingleCommands } from '@tiptap/core'
import { useLocalStorageState, usePrevious, useResetState, useUpdateEffect } from 'ahooks'
import { isEmpty, isNil } from 'lodash-es'
import { Fragment, useCallback, useEffect, useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { gzipSync } from 'zlib'
import { DefectiveCategory, DefectiveGoodsSource, DefectiveLocation } from '../../../constants/enums'
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
import CommandNumberFieldControl from './command-number-field-control'
import CustShoeStyleFieldControl from './cust-shoe-style-field-control'
import FactoryShoeStyleFieldControl from './factory-shoe-style-field-control'
import ListPanelToggle from './list-panel-toggle'
import SewingLineFieldControl from './sewing-line-field-control'
import { ShoeSourceFieldControl } from './shoe-source-field-control'
import SizeFieldControl from './size-field-control'
import ToggleFullscreen from './toggle-fullscreen'
import UserActivityInfo from './user-activity-info'

const DefectiveGoodsForm: React.FC = () => {
	const { t, i18n } = useTranslation()
	const { hash, search } = useLocation({ structuralSharing: false })
	const navigate = useNavigate({ from: '/defective-goods-epc-combination' })
	const [formAction, setFormAction, resetFormAction] = useResetState<Nullish<CommonActions>>(null)
	const [useAvailableTemplate, setUseAvailabelTemplate] = useLocalStorageState('useAvailableTemplate', {
		defaultValue: true,
		listenStorageChange: true
	})
	const { currentStrategy, setStrategy } = useSwitchCombinationStrategy()
	const previousStrategy = usePrevious(currentStrategy)
	// const [defaultEditorContent, setDefaultEditorContent] = useState<string>(() =>
	// 	useAvailableTemplate ? DefectDescriptionTemplate[i18n.language] : ''
	// )
	const editorRef = useRef<{
		getHTML: () => string
		isEmpty: () => boolean
		commands: () => SingleCommands
	}>({
		getHTML: () => '',
		isEmpty: () => true,
		commands: () =>
			({
				setContent: (content: string) => {
					void content
				}
			}) as SingleCommands
	})

	const schemaRef = useRef<any>(createDefectiveGoodsSchema)

	const form = useForm<DefectiveGoodsCombinationFormValues>({
		resolver: zodResolver(schemaRef.current),
		defaultValues: {
			shoe_source: DefectiveGoodsSource.FINAL_INSPECTION,
			defective_description: DefectDescriptionTemplate[i18n.language]
		}
	})

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
			setFormAction(CommonActions.UPDATE)
			form.reset(e.payload)
			editorRef.current.commands().setContent(e.payload.defective_description ?? '')
		}
	})

	event$.useSubscription((e) => {
		if (e.action === CommonActions.IMPORT) {
			form.setValue('epc', e.payload)
		}
	})

	useEffect(() => {
		if (!orderDetail) return
		form.reset({
			...form.getValues(),
			cust_shoes_style: orderDetail.cust_shoes_style,
			factory_shoes_style: orderDetail.factory_shoes_style,
			brand_name: orderDetail.brand_name,
			color_sn: orderDetail.color_sn
		})
	}, [orderDetail])

	useUpdateEffect(() => {
		if (formAction !== CommonActions.CREATE) return
		form.reset({
			...form.getValues(),
			factory_shoes_style: '',
			cust_shoes_style: '',
			color_sn: '',
			...(shouldRequireFullInfo && { po: '', mo_no: '' }),
			...(currentStrategy === 'manually' ? { sizes: [] } : { size_numcode: '' })
		})
	}, [formAction, currentCategory])

	useEffect(() => {
		if (formAction === CommonActions.CREATE) {
			editorRef.current.commands().setContent(DefectDescriptionTemplate[i18n.language])
			form.setValue('combination_strategy', currentStrategy)
		}
		if (formAction === CommonActions.UPDATE) setStrategy(null)
	}, [formAction, currentStrategy])

	useUpdateEffect(() => {
		if (typeof editorRef.current?.commands !== 'function') return
		if (useAvailableTemplate) {
			form.setValue('defective_description', DefectDescriptionTemplate[i18n.language])
			editorRef.current.commands().setContent(DefectDescriptionTemplate[i18n.language])
		} else {
			form.setValue('defective_description', '')
			editorRef.current?.commands().setContent('')
		}
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
					if (currentStrategy === 'usb') currentFormValues[key] = ''
					break
				case 'sizes':
					if (currentStrategy === 'manually') currentFormValues[key] = []
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
		if (editorRef.current) editorRef.current.commands().setContent(DefectDescriptionTemplate[i18n.language])
	}

	const handleCancel = () => {
		resetFormAction()
		handleResetForm()
		if (!currentStrategy) setStrategy(previousStrategy)
		navigate({ search })
	}

	console.log(form.getErrors())

	const handleSubmitForm = async (data: CreateDefectiveGoodsFormValues) => {
		if (data.combination_strategy === 'manually' && formAction === CommonActions.CREATE) {
			delete data.epc
			delete data.size_numcode
		}

		const payload = {
			...data,
			po: isNil(data.po) || isEmpty(data.po) ? 'PRELOAD' : data.po,
			defective_description: gzipSync(data.defective_description, {
				level: 6,
				chunkSize: 1024
			}).toString('base64')
		}

		console.log({
			...data,
			po: isNil(data.po) || isEmpty(data.po) ? 'PRELOAD' : data.po,
			defective_description: data.defective_description
		})

		const mutateAsync = async () =>
			formAction === CommonActions.UPDATE
				? await updateAsync({ id: hash, data: payload })
				: await createAsync(payload)

		await mutateAsync()

		if (formAction === CommonActions.CREATE)
			form.reset({
				...form.getValues(),
				...(data.combination_strategy === 'usb' && { epc: '' }),
				...(data.combination_strategy === 'manually' && { sizes: [{}] })
			})
		if (formAction === CommonActions.UPDATE) {
			handleCancel()
		}
		if (data.combination_strategy === 'uhf') event$.emit({ action: CommonActions.SAVE, payload: [] })
	}

	if (editorRef.current?.isEmpty?.() && form.formState.isSubmitted) {
		form.setError('defective_description', { type: 'required', message: t('ns_common:errors.required') })
	}

	const isPending: boolean = isCreating || isUpdating
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
								onClick={() => setFormAction(CommonActions.CREATE)}>
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
					{(currentStrategy === 'usb' || formAction === CommonActions.UPDATE) && (
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
								<CommandNumberFieldControl disabled={isNil(formAction)} />
							</Div>
						</Fragment>
					)}
					<Div
						className={cn(
							'col-span-full',
							currentStrategy === 'manually'
								? '@xl/combination-form:col-span-2'
								: '@xl/combination-form:col-span-3'
						)}>
						<FactoryShoeStyleFieldControl disabled={isNil(formAction)} loading={isLoading} />
					</Div>
					<Div
						className={cn(
							'col-span-full',
							currentStrategy === 'manually'
								? '@xl/combination-form:col-span-2'
								: '@xl/combination-form:col-span-3'
						)}>
						<CustShoeStyleFieldControl disabled={isNil(formAction)} loading={isLoading} />
					</Div>
					<Div
						className={cn(
							'col-span-full',
							currentStrategy === 'manually'
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
							currentStrategy === 'manually' ? 'col-span-full' : 'col-span-full @xl/combination-form:col-span-3'
						)}>
						<SizeFieldControl
							disabled={isNil(formAction)}
							loading={isLoading}
							name={currentStrategy === 'manually' ? 'sizes' : 'size_numcode'}
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
						<Div className='absolute top-0 right-0 inline-flex items-center gap-x-3'>
							<Label className='inline-flex items-center gap-x-2' htmlFor='toggle-use-desc-template'>
								<Icon name='Sparkles' strokeWidth={1.5} />
								{t('ns_common:editor.use_available_template')}
							</Label>
							<Checkbox
								checked={useAvailableTemplate}
								disabled={isNil(formAction)}
								id='toggle-use-desc-template'
								onCheckedChange={(checked) => {
									setUseAvailabelTemplate(Boolean(checked))
									if (!checked) editorRef.current?.commands?.()?.setContent?.('')
								}}
							/>
						</Div>
						<Field className='space-y-2'>
							<Label htmlFor='defective-description'>{t('ns_erp:fields.defective_description')}</Label>
							<Editor
								id='defective-description'
								ref={editorRef}
								defaultValue={
									form.getValues('defective_description') ||
									(useAvailableTemplate ? DefectDescriptionTemplate[i18n.language] : '')
								}
								onUpdate={({ value }) => {
									form.setValue('defective_description', value || '')
								}}
							/>

							{/* <FieldError errors={[form.getErrors('defective_description')]} /> */}
						</Field>
						{/* <EditorFieldControl
							className=''
							defaultValue={defaultEditorContent}
							disabled={!formAction}
							errorMessage={t('ns_validation:required')}
							label={t('ns_erp:fields.defective_description')}
							name='defective_description'
						/> */}
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
