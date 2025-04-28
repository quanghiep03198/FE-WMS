'use no memo'

import { OrderItem } from '@/app/(features)/_types/rfid'
import { cn } from '@/common/utils/cn'
import { Button, ComboboxFieldControl, Div, Form as FormProvider, Icon, Typography } from '@/components/ui'
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
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
import { sortBy } from 'lodash'
import React, { createContext, use, useMemo, useRef, useState } from 'react'
import {
	FieldArrayWithId,
	useFieldArray,
	UseFieldArrayAppend,
	useForm,
	useFormContext,
	useWatch
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useUpdateStockOutMutation } from '../../_apis/outbound-rfid.api'
import { usePageContext } from '../../_contexts/-page-context'
import { DetailedOutBoundFormValues, detailedOutboundValidator } from '../../_schemas/outbound.schema'
import FormSubmission from './-form-submission'
import PurchaseOrderAutoComplete from './-purchase-order-autocomplete'
import DroppableFieldItem from './-separated-po-field-item'

export const FormContext = createContext<Pick<OrderItem, 'sizes'>>(null)

const SeparatedPoOutboundForm = () => {
	const { t } = useTranslation()
	const { scannedOrders } = usePageContext('scannedOrders')
	const [activeState, setActiveState] = useState<{ id: string | null; index: number | null }>({
		id: null,
		index: null
	})

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

	const { mutateAsync, isPending, isError } = useUpdateStockOutMutation(form.reset)

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
			const paddingTop = parseInt(computedStyle.paddingTop) || 0
			const paddingBottom = parseInt(computedStyle.paddingBottom) || 0
			return paddingTop + paddingBottom
		}
		return 0
	}, [fieldsetRef.current])

	return (
		<FormContext.Provider value={{ sizes: availableSizes }}>
			<FormProvider {...form}>
				<Form
					onSubmit={form.handleSubmit(
						async (data) =>
							await mutateAsync({
								...data,
								sizes: data.sizes.map((item) => ({ size_numcode: item.size_numcode, qty: item.qty }))
							})
					)}>
					<Div className='col-span-1'>
						<PurchaseOrderAutoComplete />
					</Div>
					<Div className='col-span-1'>
						<ComboboxFieldControl
							label={t('ns_erp:fields.mo_no')}
							name='mo_no'
							datalist={sortBy(scannedOrders, 'mo_no')}
							labelField='mo_no'
							valueField='mo_no'
						/>
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
									className='relative col-span-full flex h-fit flex-col gap-y-6 rounded-md border-2 border-dashed p-4 duration-100'>
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
									className='min-w-[var(--draggable-item-width)] max-w-[var(--draggable-item-width)]'
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
		</FormContext.Provider>
	)
}

const ArrayFieldControl: React.FC<{
	fields: FieldArrayWithId<DetailedOutBoundFormValues>[]
	onAppend: UseFieldArrayAppend<DetailedOutBoundFormValues>
}> = ({ fields, onAppend }) => {
	const { sizes: availableSizes } = use(FormContext)
	const { t } = useTranslation()
	const { reset, getValues } = useFormContext<DetailedOutBoundFormValues>()

	const availableFieldLeft = availableSizes.length - fields.length
	const shouldAllowAdditionalSizes = fields.length === availableSizes.length

	const handleAppendField: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		if (shouldAllowAdditionalSizes) e.preventDefault()
		else {
			onAppend({})
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
					className='aria-disalbed:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:!opacity-50'
					onClick={handleAppendField}>
					<Icon name='Plus' role='img' /> {t('ns_common:actions.add')}
				</Button>
				{fields.length > 0 && (
					<Button
						size='sm'
						type='button'
						variant='destructive'
						onClick={() => {
							reset({ ...getValues(), sizes: [] })
						}}>
						<Icon name='X' role='img' /> {t('ns_inoutbound:labels.delete_all')}
					</Button>
				)}
			</Div>
		</Div>
	)
}

const EmptyState: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='col-span-full flex flex-col items-center justify-center animate-in fade-in-0 zoom-in-90'>
			<Icon
				name='CircleFadingPlus'
				size={40}
				strokeWidth={1}
				stroke='hsl(var(--muted-foreground))'
				className='mb-4'
			/>
			<Typography className='mb-1 font-medium'>{t('ns_inoutbound:description.no_added_size')}</Typography>
			<Typography variant='small' color='muted' className='col-span-full text-center'>
				{t('ns_inoutbound:description.add_outbound_size')}
			</Typography>
		</Div>
	)
}

const Form = tw.form`grid grid-cols-2 gap-x-2 gap-y-6`

export default SeparatedPoOutboundForm
