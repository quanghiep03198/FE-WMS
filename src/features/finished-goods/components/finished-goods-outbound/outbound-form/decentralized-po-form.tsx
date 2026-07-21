'use no memo'

import { Button, ComboboxFieldControl, Div, Form as FormProvider, Icon, Tooltip, Typography } from '@/components/ui'
import { Alert, AlertClose, AlertContent, AlertDescription, AlertTitle } from '@/components/ui/@custom/alert'
import { cn } from '@common/utils/cn'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import {
	closestCenter,
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSize } from 'ahooks'
import type { AxiosError } from 'axios'
import { HttpStatusCode } from 'axios'
import { sortBy, sortedUniqBy } from 'lodash-es'
import React, { Fragment, use, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { FieldArrayWithId, UseFieldArrayAppend } from 'react-hook-form'
import { useFieldArray, useForm, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../../../contexts/finished-goods-outbound/page-context'
import {
	DecentralizedPoFormContext,
	DecentralizedPoFormProvider
} from '../../../contexts/finished-goods-outbound/separated-form-context'
import { useStockOutMutation } from '../../../hooks/use-outbound-request'
import type { DetailedOutBoundFormValues } from '../../../schemas/outbound.schema'
import { detailedOutboundValidator } from '../../../schemas/outbound.schema'
import DroppableFieldItem from './decentralized-po-field-item'
import FormSubmission from './form-submission'
import PurchaseOrderAutoComplete from './purchase-order-autocomplete'

const DecentralizedPoOutboundForm: React.FC = () => {
	const { scannedOrders } = usePageContext('scannedOrders')
	const [activeState, setActiveState] = useState<{ id: string | null; index: number | null }>({
		id: null,
		index: null
	})
	const { t } = useTranslation()

	const form = useForm<DetailedOutBoundFormValues>({
		resolver: zodResolver(detailedOutboundValidator),
		defaultValues: {
			po: '',
			mo_no: '',
			sizes: []
		}
	})

	const currentCommandNumber = useWatch({ control: form.control, name: 'mo_no' })

	const availableSizes = useMemo(() => {
		const currentCommandNumberData = scannedOrders.find((item) => item.mo_no === currentCommandNumber)
		return Array.isArray(currentCommandNumberData?.sizes)
			? sortBy(currentCommandNumberData.sizes, 'size_numcode')
			: []
	}, [scannedOrders, currentCommandNumber])

	const { fields, append, remove, move } = useFieldArray({ control: form.control, name: 'sizes' })

	const { mutateAsync, isPending, isError, error, reset } = useStockOutMutation(form.reset)

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		}),
		useSensor(TouchSensor, {
			// Press delay of 250ms, with tolerance of 5px of movement
			activationConstraint: {
				delay: 250,
				tolerance: 5
			}
		})
	)

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event
		setActiveState({
			id: active.id as string,
			index: active.data.current?.sortable?.index
		})
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (active.id !== over.id) {
			const oldIndex = fields.findIndex((item) => item.id === active.id)
			const newIndex = fields.findIndex((item) => item.id === over.id)
			move(oldIndex, newIndex)
			if (form.formState.isSubmitted) form.trigger('sizes')
		}
	}

	const fieldsetRef = useRef<HTMLFieldSetElement>(null)
	const fieldsetSize = useSize(fieldsetRef)

	const fieldsetSizeVerticalPadding = useMemo(() => {
		if (fieldsetRef.current) {
			const computedStyle = window.getComputedStyle(fieldsetRef.current)
			const paddingTop = Number.parseInt(computedStyle.paddingTop) || 0
			const paddingBottom = Number.parseInt(computedStyle.paddingBottom) || 0
			return paddingTop + paddingBottom
		}
		return 0
	}, [fieldsetRef.current])

	return (
		<Fragment>
			{createPortal(
				<Alert data-state={isError && error?.status === HttpStatusCode.BadRequest ? 'open' : 'closed'}>
					<Icon
						name='TriangleAlert'
						size={40}
						strokeWidth={2}
						className='fill-destructive-foreground stroke-destructive'
					/>
					<AlertContent>
						<AlertTitle>{t('ns_common:titles.caution')}</AlertTitle>
						<AlertDescription>
							{(error as AxiosError<ResponseBody<void>>)?.response?.data?.message}
						</AlertDescription>
					</AlertContent>
					<Tooltip
						message={t('ns_common:actions.dismiss')}
						triggerProps={{ asChild: true }}
						contentProps={{ side: 'left' }}>
						<AlertClose onClick={() => reset()}>
							<Icon name='X' />
						</AlertClose>
					</Tooltip>
				</Alert>,
				document.body
			)}
			<DecentralizedPoFormProvider value={{ sizes: availableSizes }}>
				<FormProvider {...form}>
					<Form
						onSubmit={form.handleSubmit((data) => {
							mutateAsync({
								...data,
								sizes: data.sizes.map((item) => ({ size_numcode: item.size_numcode, qty: item.qty }))
							}).then(() => form.reset())
						})}>
						<Div className='col-span-1'>
							<PurchaseOrderAutoComplete />
						</Div>
						<Div className='col-span-1'>
							<CommandNumberFieldControl />
						</Div>
						<Div
							className='col-span-full'
							style={
								{
									'--draggable-item-width': fieldsetSize?.width - fieldsetSizeVerticalPadding + 'px'
								} as React.CSSProperties
							}>
							<DndContext
								collisionDetection={closestCenter}
								modifiers={[restrictToVerticalAxis]}
								sensors={sensors}
								onDragStart={handleDragStart}
								onDragEnd={handleDragEnd}>
								<SortableContext items={fields}>
									<Div
										ref={fieldsetRef}
										as='fieldset'
										className='relative col-span-full flex h-fit flex-col gap-y-6 rounded-md border border-dashed p-4 duration-100'>
										{fields.length > 0 ? (
											fields.map((field, index) => (
												<DroppableFieldItem key={field.id} id={field.id} index={index} onRemove={remove} />
											))
										) : (
											<EmptyState />
										)}
										<ArrayFieldControl fields={fields} onAppend={append} />
									</Div>
									<DragOverlay
										className='max-w-(--draggable-item-width) min-w-(--draggable-item-width)'
										dropAnimation={{
											duration: 300,
											easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)'
										}}>
										{activeState.id && activeState.index ? (
											<DroppableFieldItem {...activeState} onRemove={remove} />
										) : null}
									</DragOverlay>
								</SortableContext>
							</DndContext>
						</Div>
						<Div className='col-span-full'>
							<FormSubmission isPending={isPending} isError={isError} />
						</Div>
					</Form>
				</FormProvider>
			</DecentralizedPoFormProvider>
		</Fragment>
	)
}

const ArrayFieldControl: React.FC<{
	fields: FieldArrayWithId<DetailedOutBoundFormValues>[]
	onAppend: UseFieldArrayAppend<DetailedOutBoundFormValues>
}> = ({ fields, onAppend }) => {
	const { sizes: availableSizes } = use(DecentralizedPoFormContext)
	const { t } = useTranslation()
	const { reset, getValues } = useFormContext<DetailedOutBoundFormValues>()

	const availableFieldLeft = availableSizes.length - fields.length
	const shouldAllowAdditionalSizes = fields.length === availableSizes.length

	const handleAppendField: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		if (shouldAllowAdditionalSizes) e.preventDefault()
		else {
			onAppend({} as DetailedOutBoundFormValues['sizes'][number])
			e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' })
		}
	}

	return (
		<Div className={cn('col-span-full flex items-center justify-between', fields.length > 0 && 'gap-x-2')}>
			{fields.length > 0 && (
				<Typography variant='small' color={availableFieldLeft === 0 ? 'muted' : 'default'} className='font-medium'>
					{availableFieldLeft} left
				</Typography>
			)}
			<Div className={cn('flex flex-1 items-center justify-center gap-x-2', fields.length > 0 && 'justify-end')}>
				<Button
					size='sm'
					type='button'
					aria-disabled={shouldAllowAdditionalSizes}
					className='aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:opacity-50! aria-disalbed:pointer-events-none'
					onClick={handleAppendField}>
					<Icon name='Plus' /> {t('ns_common:actions.add')}
				</Button>
				{fields.length > 0 && (
					<Button
						size='sm'
						type='button'
						variant='destructive'
						onClick={() => {
							reset({ ...getValues(), sizes: [] })
						}}>
						<Icon name='X' /> {t('ns_inoutbound:labels.delete_all')}
					</Button>
				)}
			</Div>
		</Div>
	)
}

const EmptyState: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='animate-in fade-in-0 zoom-in-90 col-span-full flex flex-col items-center justify-center'>
			<Icon name='CircleFadingPlus' size={40} strokeWidth={1} stroke='var(--muted-foreground)' className='mb-4' />
			<Typography className='mb-1 font-medium'>{t('ns_inoutbound:description.no_added_size')}</Typography>
			<Typography variant='small' color='muted' className='col-span-full text-center'>
				{t('ns_inoutbound:description.add_outbound_size')}
			</Typography>
		</Div>
	)
}

const CommandNumberFieldControl: React.FC = () => {
	const { scannedOrders } = usePageContext('scannedOrders')
	const [searchTerm, setSearchTerm] = useState<string>('')
	const { t } = useTranslation()

	const filteredOrders = useMemo(() => {
		if (!Array.isArray(scannedOrders)) return []
		const result = scannedOrders.filter((order) => order.mo_no.toLowerCase().includes(searchTerm.toLowerCase()))
		return sortedUniqBy(result, (item) => item.mo_no)
	}, [searchTerm, scannedOrders])

	return (
		<ComboboxFieldControl
			label={t('ns_erp:fields.mo_no')}
			name='mo_no'
			onInput={(search) => setSearchTerm(search)}
			shouldFilter={false}
			datalist={filteredOrders}
			labelField='mo_no'
			valueField='mo_no'
		/>
	)
}

const Form = tw.form`grid grid-cols-2 gap-x-2 gap-y-6`

export default DecentralizedPoOutboundForm
