'use no memo'
import { cn } from '@/common/utils/cn'
import {
	Button,
	Div,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	SelectFieldControl,
	Typography
} from '@/components/ui'
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
import {
	defaultAnimateLayoutChanges,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { zodResolver } from '@hookform/resolvers/zod'
import { useResetState, useSize } from 'ahooks'
import { sortBy } from 'lodash'
import { useEffect, useMemo, useRef } from 'react'
import { useFieldArray, UseFieldArrayRemove, useForm, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useUpdateStockOutMutation } from '../../_apis/outbound-rfid.api'
import { usePageContext } from '../../_contexts/-page-context'
import { DetailedOutBoundFormValues, detailedOutboundValidator } from '../../_schemas/outbound.schema'
import FormSubmission from './-form-submission'
import PurchaseOrderAutoComplete from './-purchase-order-autocomplete'

const DetailedOutboundForm = () => {
	const { t } = useTranslation()
	const { scannedOrders } = usePageContext('scannedOrders')
	const [activeState, setActiveState, resetActiveState] = useResetState<{ id: string | null; index: number | null }>({
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
				delay: 10000,
				tolerance: 10
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

	useEffect(() => {
		console.log(activeState)
	}, [activeState])

	return (
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
					<SelectFieldControl
						label={t('ns_erp:fields.mo_no')}
						name='mo_no'
						datalist={sortBy(scannedOrders, 'mo_no')}
						labelField='mo_no'
						valueField='mo_no'
					/>
				</Div>
				<Div className='col-span-full'>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						modifiers={[restrictToVerticalAxis]}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}>
						<SortableContext items={fields}>
							<Div
								ref={fieldsetRef}
								as='fieldset'
								className='relative col-span-full flex flex-col gap-y-6 rounded-md border-2 border-dashed p-4'>
								{fields.length > 0 ? (
									fields.map((field, index) => (
										<DroppableFieldItem key={field.id} id={field.id} index={index} onRemove={remove} />
									))
								) : (
									<Div className='col-span-full flex flex-col items-center justify-center'>
										<Icon
											name='CircleFadingPlus'
											size={40}
											strokeWidth={1}
											stroke='hsl(var(--muted-foreground))'
											className='mb-4'
										/>
										<Typography className='font-medium'>No size</Typography>
										<Typography variant='small' color='muted' className='col-span-full text-center'>
											Add size and quantity for this order to perform the outbound process.
										</Typography>
									</Div>
								)}
								<Div className={cn('col-span-full flex justify-center', fields.length > 0 && 'gap-x-2')}>
									<Button size='sm' type='button' onClick={() => append({})}>
										<Icon name='Plus' role='img' /> {t('ns_common:actions.add')}
									</Button>
									{fields.length > 0 && (
										<Button
											size='sm'
											type='button'
											variant='outline'
											onClick={() => {
												form.reset({ ...form.getValues(), sizes: [] })
											}}>
											<Icon name='X' role='img' /> {t('ns_common:actions.delete')}
										</Button>
									)}
								</Div>
							</Div>
							<DragOverlay
								dropAnimation={{
									duration: 300,
									easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)'
								}}
								zIndex={9999}
								style={{
									minWidth: fieldsetSize?.width - fieldsetSizeVerticalPadding,
									maxWidth: fieldsetSize?.width - fieldsetSizeVerticalPadding
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
	)
}

const DroppableFieldItem: React.FC<{
	id: string
	index: number
	onRemove: UseFieldArrayRemove
}> = ({ id, index, onRemove }) => {
	const { scannedOrders } = usePageContext('scannedOrders')
	const { watch, setValue, control } = useFormContext()

	const currentCommandNumber = useWatch({ control, name: 'mo_no' })

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
		animateLayoutChanges: (args) => defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
		transition: {
			duration: 300, // milliseconds
			easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)'
		}
	})

	const sizeDataList = useMemo(() => {
		const currentCommandNumberData = scannedOrders.find((item) => item.mo_no === currentCommandNumber)
		return Array.isArray(currentCommandNumberData?.sizes)
			? sortBy(currentCommandNumberData.sizes, 'size_numcode')
			: []
	}, [scannedOrders, currentCommandNumber])

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1
	}

	const { t } = useTranslation()

	return (
		<Div style={style} {...attributes}>
			<Div className={cn('flex items-stretch gap-x-2')}>
				<button
					{...listeners}
					ref={setNodeRef}
					type='button'
					onClick={(e) => {
						e.stopPropagation()
						onRemove(index)
					}}
					className={cn(
						'inline-flex h-9 items-center justify-center rounded text-muted-foreground transition-colors duration-200 focus-within:cursor-grabbing hover:text-foreground',
						isDragging ? 'cursor-grabbing' : 'cursor-grab'
					)}>
					<Icon name='GripVertical' size={14} />
				</button>
				<Div className='flex-1'>
					<SelectFieldControl
						name={`sizes.${index}.size_numcode`}
						datalist={sizeDataList}
						labelField='size_numcode'
						valueField='size_numcode'
						disabled={!currentCommandNumber}
						placeholder='Select size'
						onValueChange={(value) => {
							const maxSizeQty = sizeDataList.find((item) => item.size_numcode === value)?.count ?? 0
							setValue(`sizes.${index}.size_qty`, maxSizeQty)
						}}
					/>
				</Div>
				<Div className='flex-1'>
					<InputFieldControl
						name={`sizes.${index}.qty`}
						type='number'
						disabled={!watch(`sizes.${index}.size_numcode`)}
						placeholder={t('ns_common:common_fields.quantity_with_limit', {
							limit: watch(`sizes.${index}.size_qty`) || 0,
							defaultValue: `Quantity (max ${watch(`sizes.${index}.size_qty`)})`
						})}
					/>
				</Div>
				<button
					onClick={() => onRemove(index)}
					className='inline-flex h-9 items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-destructive'>
					<Icon name='X' size={14} strokeWidth={3} />
				</button>
			</Div>
		</Div>
	)
}

const Form = tw.form`grid grid-cols-2 gap-x-2 gap-y-6`

export default DetailedOutboundForm
