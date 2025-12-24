import { useGetCommandNumberDetailQuery } from '@/app/(features)/-hooks/use-order-asm'
import { CommonActions } from '@/common/constants/enums'
import { IBaseEntity } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import {
	Button,
	buttonVariants,
	Checkbox,
	Div,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	Label,
	SelectFieldControl
} from '@/components/ui'
import { EditorFieldControl } from '@/components/ui/@field-control/editor'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useLocalStorageState, usePrevious, useResetState, useUpdateEffect } from 'ahooks'
import { isNil } from 'lodash-es'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { gzipSync } from 'zlib'
import { DefectDescriptionTemplate } from '../../-constants/templates'
import { CreateDefectiveGoodsFormValues, createDefectiveGoodsSchema } from '../../-schemas/defective-goods.schema'

import { IDefectiveGoods } from '@/services/defective-goods.service'
import PurchaseOrderFieldControl from '../../../-components/rfid-reader-playground/purchase-order-field-control'
import { DefectiveCategory, DefectiveLocation } from '../../../-constants'
import { usePageContext } from '../../../-contexts/page-context'
import {
	useCreateDefectiveGoodsMutation,
	useUpdateDefectiveGoodsMutation
} from '../../../-hooks/use-defective-goods-asm'
import { useSwitchCombinationStrategy } from '../../../-hooks/use-switch-combination-strategy'
import { useGetProductSpecificationQuery } from '../../../../-hooks/use-product-specification-asm'
import AssemblyLineFieldControl from './assembly-line-field-control'
import BrandFieldControl from './brand-field-control'
import CategoryFieldControl from './category-field-control'
import ColorFieldControl from './color-field-control'
import CombinationStrategyRadioGroup from './combination-strategy-group'
import CommandNumberFieldControl from './command-number-field-control'
import CustShoeStyleFieldControl from './cust-shoe-style-field-control'
import FactoryShoeStyleFieldControl from './factory-shoe-style-field-control'
import ListPanelToggleButton from './list-panel-toggle-button'
import SewingLineFieldControl from './sewing-line-field-control'
import SizeFieldControl from './size-field-control'
import ToggleFullscreen from './toggle-fullscreen'
import UserActivityInfo from './user-activity-info'

const DefectiveGoodsForm: React.FC = () => {
	const { t, i18n } = useTranslation()
	const { hash, search } = useLocation()
	const navigate = useNavigate()
	const [formAction, setFormAction, resetFormAction] = useResetState<CommonActions>(null)
	const [useAvailableTemplate, setUseAvailabelTemplate] = useLocalStorageState('useAvailableTemplate', {
		defaultValue: true,
		listenStorageChange: true
	})
	const { currentStrategy, setStrategy } = useSwitchCombinationStrategy()
	const previousStrategy = usePrevious(currentStrategy)
	const [defaultEditorContent, setDefaultEditorContent] = useState<string>(() =>
		useAvailableTemplate ? DefectDescriptionTemplate[i18n.language] : ''
	)

	const form = useForm<CreateDefectiveGoodsFormValues & Partial<IBaseEntity>>({
		resolver: zodResolver(createDefectiveGoodsSchema),
		defaultValues: {
			defective_description: DefectDescriptionTemplate[i18n.language]
		}
	})

	// Watch form fields
	const currentManufacturingOrder = useWatch({ control: form.control, name: 'mo_no' })
	const currentCategory = useWatch({ control: form.control, name: 'defective_category' })

	const { data: productSpecification, isLoading } = useGetProductSpecificationQuery()
	const { data: orderDetail } = useGetCommandNumberDetailQuery(currentManufacturingOrder)

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

	event$.useSubscription((e: { action: CommonActions; payload: IDefectiveGoods }) => {
		if (e.action === CommonActions.UPDATE) {
			setFormAction(CommonActions.UPDATE)
			form.reset(e.payload)
			setDefaultEditorContent(e.payload.defective_description)
		}
	})

	event$.useSubscription((e: { action: CommonActions; payload: string[] }) => {
		if (e.action === CommonActions.IMPORT) {
			form.setValue('epc', e.payload)
		}
	})

	useEffect(() => {
		if (!orderDetail) return
		const orderInfo = orderDetail?.orders?.at(0)
		if (!orderInfo) return
		form.reset({
			...form.getValues(),
			cust_shoes_style: orderInfo.cust_shoes_style,
			factory_shoes_style: orderInfo.factory_shoes_style,
			brand_name: orderInfo.brand_name,
			color_sn: orderInfo.color_sn
		})
	}, [orderDetail])

	useEffect(() => {
		form.setValue('combination_strategy', currentStrategy)
	}, [currentStrategy])

	useEffect(() => {
		if (formAction === CommonActions.UPDATE) setStrategy(null)
	}, [formAction])

	useUpdateEffect(() => {
		if (useAvailableTemplate) setDefaultEditorContent(DefectDescriptionTemplate[i18n.language])
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
				default:
					currentFormValues[key] = ''
					break
			}
		}
		form.reset(currentFormValues)
	}

	console.log('form.getValues()', form.getValues())

	const handleSubmitForm = (data: CreateDefectiveGoodsFormValues) => {
		if (data.combination_strategy === 'manually') {
			delete data.epc
			delete data.size_code
		}

		console.log('data', data)

		const payload = {
			...data,
			defective_description: gzipSync(data.defective_description, { level: 6, chunkSize: 1024 }).toString('base64')
		}
		const mutateAsync = async () =>
			formAction === CommonActions.UPDATE
				? await updateAsync({ id: +hash, data: payload })
				: await createAsync(payload)
		toast.promise(mutateAsync(), {
			loading: t('ns_common:notification.processing_request'),
			success: () => {
				if (formAction === CommonActions.CREATE)
					form.reset({ ...form.getValues(), ...(data.combination_strategy === 'usb' && { epc: '' }) })
				event$.emit({ action: CommonActions.SAVE, payload: [] })
				return t('ns_common:notification.success')
			},
			error: t('ns_common:notification.error')
		})
	}

	const handleCancel = () => {
		resetFormAction()
		handleResetForm()
		setStrategy(previousStrategy)
		navigate({ hash: undefined, search })
	}

	const isPending: boolean = isCreating || isUpdating
	const isError: boolean = isFailedToCreate || isFailedToUpdate
	const shouldRequireFullInfo: boolean =
		currentCategory === DefectiveCategory.B_GRADE || currentCategory === DefectiveCategory.C_GRADE

	return (
		<FormProvider {...{ ...form, productSpecification }}>
			<Form data-action={formAction === CommonActions.UPDATE} onSubmit={form.handleSubmit(handleSubmitForm)}>
				{/* Form controls */}
				<Div className='col-span-full flex h-max max-h-full min-h-[var(--bar-height)] items-center justify-between gap-x-6 bg-background px-2'>
					<Div className='hidden @7xl:block'>
						<ListPanelToggleButton />
					</Div>
					<Label
						className={cn(buttonVariants({ variant: 'secondary', className: 'inline-flex @7xl:hidden' }))}
						htmlFor='list-sheet-trigger'>
						<Icon name='Clock' /> {t('ns_inoutbound:titles.combination_history')}
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
								className='text-destructive hover:bg-destructive/20 hover:text-destructive'
								onClick={handleCancel}>
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
				{formAction === CommonActions.UPDATE && (
					<UserActivityInfo
						createdAt={form.getValues('created')}
						createdBy={form.getValues('user_code_created')}
						lastUpdatedAt={form.getValues('updated')}
					/>
				)}
				{/* Form fields */}
				<Div as='fieldset' className='grid flex-1 basis-full grid-cols-6 gap-x-2 gap-y-6 overflow-y-auto p-6'>
					{currentStrategy === 'usb' ||
						(isNil(currentStrategy) && (
							<Div className='col-span-full'>
								<InputFieldControl
									name='epc'
									label='EPC'
									autoFocus
									autoComplete='off'
									type='search'
									tabIndex={0}
									placeholder='E28*********************'
									onKeyDown={handleEpcChange}
									onKeyDownCapture={handleEpcChange}
									disabled={isNil(formAction)}
									description={t('ns_inoutbound:description.defective_epc_caption')}
								/>
							</Div>
						))}
					<Div className='col-span-full'>
						<CategoryFieldControl disabled={isNil(formAction)} />
					</Div>
					<Div className='col-span-full'>
						<BrandFieldControl
							disabled={isNil(formAction)}
							className={shouldRequireFullInfo && 'pointer-event-none'}
						/>
					</Div>
					{shouldRequireFullInfo && !isNil(formAction) && (
						<Fragment>
							<Div className='col-span-3'>
								<PurchaseOrderFieldControl />
							</Div>
							<Div className='col-span-3'>
								<CommandNumberFieldControl />
							</Div>
						</Fragment>
					)}
					<Div
						className={cn(
							'col-span-full',
							currentStrategy === 'manually' ? '@3xl:col-span-2' : '@3xl:col-span-3'
						)}>
						<CustShoeStyleFieldControl
							loading={isLoading}
							readOnly={shouldRequireFullInfo}
							disabled={isNil(formAction)}
						/>
					</Div>
					<Div
						className={cn(
							'col-span-full',
							currentStrategy === 'manually' ? '@3xl:col-span-2' : '@3xl:col-span-3'
						)}>
						<FactoryShoeStyleFieldControl
							loading={isLoading}
							readOnly={shouldRequireFullInfo}
							disabled={isNil(formAction)}
						/>
					</Div>
					<Div
						className={cn(
							'col-span-full',
							currentStrategy === 'manually' ? '@3xl:col-span-2' : '@3xl:col-span-3'
						)}>
						<ColorFieldControl
							loading={isLoading}
							readOnly={shouldRequireFullInfo}
							disabled={isNil(formAction)}
						/>
					</Div>

					<Div className={cn(currentStrategy === 'manually' ? 'col-span-full' : '@3xl:col-span-3')}>
						<SizeFieldControl
							loading={isLoading}
							disabled={isNil(formAction)}
							datalist={
								Array.isArray(orderDetail?.sizes)
									? orderDetail.sizes.map((item) => ({
											label: item.size_numcode,
											value: item.size_numcode
										}))
									: []
							}
						/>
					</Div>

					<Div className='col-span-3'>
						<SewingLineFieldControl />
					</Div>
					<Div className='col-span-3'>
						<AssemblyLineFieldControl />
					</Div>
					<Div className='col-span-full'>
						<SelectFieldControl
							name='defective_location'
							label={t('ns_erp:fields.defective_location')}
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
								<Icon name='Sparkles' strokeWidth={1.5} />
								{t('ns_common:editor.use_available_template')}
							</Label>
							<Checkbox
								id='toggle-use-desc-template'
								checked={useAvailableTemplate}
								onCheckedChange={(checked) => {
									setUseAvailabelTemplate(Boolean(checked))
									if (!checked) setDefaultEditorContent('')
								}}
							/>
						</Div>
						<EditorFieldControl
							name='defective_description'
							label={t('ns_erp:fields.defective_description')}
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
					<CombinationStrategyRadioGroup shouldNotAllowUhf={formAction === CommonActions.UPDATE} />
				</Div>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`
	h-full overflow-y-auto scrollbar-track-accent/50 grid divide-y divide-border 
	data-[action=CREATE]:grid-rows-[var(--bar-height)_auto_var(--bar-height)] 
	data-[action=UPDATE]:grid-rows-[var(--bar-height)_auto_auto_var(--bar-height)] 
`

export default DefectiveGoodsForm
