import { GhostButton } from '@/app/(features)/-components/shared/ghost-button'
import { cn } from '@/common/utils/cn'
import {
	AutoCompleteFieldControl,
	Button,
	Div,
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	Icon,
	InputFieldControl
} from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { useLocation } from '@tanstack/react-router'
import React, { useMemo, useRef } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DefectiveGoodsCombinationFormValues } from '../../-schemas/defective-goods.schema'
import { DefectiveCategory } from '../../../-constants'
import { DefAutoCompleteFieldControlProps } from './type'

const SizeFieldControl: React.FC<DefAutoCompleteFieldControlProps> = ({
	loading,
	disabled,
	datalist,

	...props
}) => {
	const { t } = useTranslation()
	const { hash } = useLocation()
	const { control, ...ctx } = useFormContext<DefectiveGoodsCombinationFormValues>()
	const { fields, append, remove } = useFieldArray({ control, name: 'sizes' })
	const scrollRef = useRef<HTMLDivElement>(null)

	const productSpecification = Array.isArray(ctx['productSpecification']) ? ctx['productSpecification'] : []
	const currentCategory = useWatch({ control: control, name: 'defective_category' })
	const currentBrand = useWatch({ control: control, name: 'brand_name' })
	const currentFactoryShoeStyle = useWatch({ control: control, name: 'factory_shoes_style' })
	const currentColor = useWatch({ control: control, name: 'color_sn' })
	const currentCombinationStrategy = useWatch({ control, name: 'ri_type' })

	const shouldRequireFullInfo: boolean =
		currentCategory === DefectiveCategory.B_GRADE || currentCategory === DefectiveCategory.C_GRADE

	// Memoized options for size select
	const sizeOptions = useMemo(() => {
		if (!Array.isArray(productSpecification) || !currentBrand || !currentFactoryShoeStyle || !currentColor) return []
		if (shouldRequireFullInfo && Array.isArray(datalist)) return datalist
		const brand = productSpecification.find((item) => item.brand_name === currentBrand)
		const variant = brand?.product_variants?.find((item) => item.factory_shoes_style === currentFactoryShoeStyle)
		const spec = variant?.specs?.find((item) => item.color_sn === currentColor)
		if (!spec?.sizes) return []
		return spec.sizes
			.sort((a, b) => Number(a.size) - Number(b.size))
			.map(({ size }) => ({
				label: size,
				value: size
			}))
	}, [datalist, productSpecification, currentBrand, currentFactoryShoeStyle, currentColor, shouldRequireFullInfo])

	if (currentCombinationStrategy === 'manually' && !hash)
		return (
			<Div className='col-span-full space-y-4 rounded-md border border-dashed py-3'>
				<ScrollShadow ref={scrollRef} className={cn('px-3', fields.length > 0 && 'max-h-40')}>
					{fields.length === 0 ? (
						<Empty className='border border-dashed'>
							<EmptyHeader>
								<EmptyMedia variant='icon'>
									<Icon name='CircleFadingPlus' />
								</EmptyMedia>
								<EmptyTitle>{t('ns_inoutbound:description.no_added_size')}</EmptyTitle>
								<EmptyDescription>{t('ns_inoutbound:description.add_outbound_size')}</EmptyDescription>
							</EmptyHeader>
							<EmptyContent>
								<Button
									variant='outline'
									size='sm'
									type='button'
									disabled={disabled}
									onClick={() => append({ size_code: null, qty: null })}>
									<Icon name='ListPlus' />
									{t('ns_common:actions.add')}
								</Button>
							</EmptyContent>
						</Empty>
					) : (
						fields.map((field, index) => (
							<Div key={field.id} className='mb-2 flex items-stretch gap-x-2'>
								<Div className='flex-1'>
									<AutoCompleteFieldControl
										{...props}
										name={`sizes.${index}.size_code`}
										placeholder={t('ns_common:form_placeholder.fill', {
											object: 'size',
											defaultValue: null
										})}
										disabled={disabled}
										loading={loading}
										datalist={sizeOptions}
										labelField='label'
										valueField='value'
									/>
								</Div>
								<Div className='flex-1'>
									<InputFieldControl
										name={`sizes.${index}.qty`}
										type='number'
										placeholder={t('ns_common:common_fields.quantity')}
									/>
								</Div>
								<GhostButton onClick={() => remove(index)}>
									<Icon name='X' />
								</GhostButton>
							</Div>
						))
					)}
				</ScrollShadow>
				{fields.length > 0 && (
					<Div className='grid place-content-center place-items-center'>
						<Button
							variant='outline'
							type='button'
							size='sm'
							disabled={disabled}
							onClick={() => {
								append({ size_code: null, qty: null })
								scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
							}}>
							<Icon name='ListPlus' />
							{t('ns_common:actions.add')}
						</Button>
					</Div>
				)}
			</Div>
		)

	return (
		<AutoCompleteFieldControl
			{...props}
			name='size_code'
			label='Size'
			placeholder={t('ns_common:form_placeholder.fill', {
				object: 'size',
				defaultValue: null
			})}
			disabled={disabled}
			loading={loading}
			datalist={sizeOptions}
			labelField='label'
			valueField='value'
		/>
	)
}

export default SizeFieldControl
