import { GhostButton } from '@/app/(features)/-components/shared/ghost-button'
import { useGetProductSpecificationQuery } from '@/app/(features)/-hooks/use-product-specification-asm'
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
	InputFieldControl,
	Label
} from '@/components/ui'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { useLocation } from '@tanstack/react-router'
import { uniqBy } from 'lodash-es'
import React, { useMemo, useRef } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { DefectiveGoodsCombinationFormValues } from '../../-schemas/defective-goods.schema'
import { DefectiveCategory } from '../../../-constants'
import { useSwitchCombinationStrategy } from '../../../-hooks/use-switch-combination-strategy'
import type { DefAutoCompleteFieldControlProps } from './type'

const SizeFieldControl: React.FC<DefAutoCompleteFieldControlProps> = ({
	name,
	loading,
	disabled,
	datalist,
	...props
}) => {
	const { t } = useTranslation()
	const { hash } = useLocation()
	const { control, ...ctx } = useFormContext<DefectiveGoodsCombinationFormValues>()
	const { fields, append, remove } = useFieldArray({ control, name })
	const scrollRef = useRef<HTMLDivElement>(null)
	const { currentStrategy } = useSwitchCombinationStrategy()

	const { data: productSpecification } = useGetProductSpecificationQuery()
	const currentCategory = useWatch({ control: control, name: 'defective_category' })
	const currentBrand = useWatch({ control: control, name: 'brand_name' })
	const currentFactoryShoeStyle = useWatch({ control: control, name: 'factory_shoes_style' })
	const currentColor = useWatch({ control: control, name: 'color_sn' })

	const shouldFilterAllSizes: boolean =
		currentCategory === DefectiveCategory.RESEARCH_DEVELOPMENT ||
		!currentCategory ||
		!currentBrand ||
		!currentFactoryShoeStyle ||
		!currentColor
	const shouldRequireFullInfo: boolean =
		currentCategory === DefectiveCategory.B_GRADE ||
		(currentCategory === DefectiveCategory.C_GRADE && Array.isArray(datalist))

	// Memoized options for size select
	const sizeOptions = useMemo(() => {
		if (!productSpecification?.length) return []
		if (shouldFilterAllSizes)
			return uniqBy(
				productSpecification
					.flatMap((item) => {
						return item.product_variants.flatMap((variant) => {
							return variant.specs.flatMap((spec) => {
								return spec.sizes.map(({ size }) => {
									size = Number.parseFloat(size).toString()
									return { label: size, value: size }
								})
							})
						})
					})
					.sort((a, b) => Number.parseFloat(a.value) - Number.parseFloat(b.value)),
				(size) => size.value
			)

		if (shouldRequireFullInfo) return datalist
		const brand = productSpecification.find((item) => item.brand_name === currentBrand)
		const variant = brand?.product_variants?.find((item) => item.factory_shoes_style === currentFactoryShoeStyle)
		const spec = variant?.specs?.find((item) => item.color_sn === currentColor)
		if (!spec?.sizes) return []
		return spec.sizes
			.map(({ size }) => {
				size = Number.parseFloat(size).toString()
				return { label: size, value: size }
			})
			.sort((a, b) => Number.parseFloat(a.value) - Number.parseFloat(b.value))
	}, [datalist, productSpecification, currentBrand, currentFactoryShoeStyle, currentColor, shouldRequireFullInfo])

	if (name === 'sizes' && currentStrategy === 'manually' && !hash)
		return (
			<Div className='col-span-full space-y-2'>
				<Label>Sizes</Label>
				<Div
					aria-disabled={disabled}
					className='flex-1 space-y-4 rounded-md border border-dashed py-3 aria-disabled:opacity-50'>
					<ScrollShadow ref={scrollRef} className={cn('px-3', fields.length > 0 && 'max-h-40')}>
						{fields.length === 0 ? (
							<Empty>
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
											type='text'
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
			</Div>
		)

	return (
		<AutoCompleteFieldControl
			{...props}
			name={name}
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
