'use no memo'

import { cn } from '@common/utils/cn'
import { Div } from '@components/customs/div'
import { AutoCompleteFieldControl } from '@components/forms/auto-complete'
import { InputFieldControl } from '@components/forms/input'
import { GhostButton } from '@components/shared/ghost-button'
import { Button } from '@components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@components/ui/empty'
import { Icon } from '@components/ui/icon'
import { Label } from '@components/ui/label'
import { useGetProductSpecsQuery } from '@features/product-specification/hooks/use-product-specs-request'
import { useLocation } from '@tanstack/react-router'
import { uniqBy } from 'lodash-es'
import React, { useMemo, useRef } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DefectiveCategory } from '../../../constants/enums'
import { useSwitchCombinationStrategy } from '../../../hooks/use-switch-combination-strategy'
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
	const { control } = useFormContext()
	const { fields, append, remove } = useFieldArray({ control, name })
	const scrollRef = useRef<HTMLDivElement>(null)
	const { currentStrategy } = useSwitchCombinationStrategy()

	const { data: productSpecification } = useGetProductSpecsQuery()
	const currentCategory = useWatch({ control: control, name: 'defective_category' })
	const currentBrand = useWatch({ control: control, name: 'brand_name' })
	const currentFactoryShoeStyle = useWatch({ control: control, name: 'factory_shoes_style' })
	const currentColor = useWatch({ control: control, name: 'color_sn' })

	const shouldFilterAllSizes: boolean = currentCategory === DefectiveCategory.RESEARCH_DEVELOPMENT

	const shouldRequireFullInfo: boolean =
		Array.isArray(datalist) &&
		(currentCategory === DefectiveCategory.B_GRADE || currentCategory === DefectiveCategory.C_GRADE)

	// Memoized options for size select
	const sizeOptions = useMemo(() => {
		if (!Array.isArray(productSpecification) || !productSpecification.length) return []
		return uniqBy(
			productSpecification
				.filter((item) => {
					if (shouldFilterAllSizes) return true
					return (
						item.brand_name === currentBrand &&
						item.factory_shoes_style === currentFactoryShoeStyle &&
						item.product_variants.some((variant) => variant.color_sn === currentColor)
					)
				})
				.flatMap((item) =>
					item.product_variants.flatMap((variant) => variant.sizes.map((size) => ({ label: size, value: size })))
				)
				.sort((a, b) => a?.value?.localeCompare(b?.value, undefined, { numeric: true })),
			(item) => item.value
		)
		// const fallbackDataList = uniqBy(
		// 	productSpecification.flatMap((item) => {
		// 		return item.product_variants.flatMap((variant) => {
		// 			return variant.sizes
		// 					.map((size) => ({ label: size, value: size }))

		// 		})
		// 	}),
		// 	(size) => size.value
		// )
		// if (shouldRequireFullInfo) return Array.isArray(datalist) ? datalist : fallbackDataList
		// if (shouldFilterAllSizes) return fallbackDataList

		// const brand = productSpecification.find((item) => item.brand_name === currentBrand)
		// const variant = brand?.product_variants?.find((item) => item.factory_shoes_style === currentFactoryShoeStyle)
		// const spec = variant?.specs?.find((item) => item.color_sn === currentColor)
		// if (!Array.isArray(spec?.sizes)) return fallbackDataList
		// return spec.sizes
		// 	.sort((s1, s2) => s1?.localeCompare(s2, undefined, { numeric: true }))
		// 	.map((size) => ({ label: size, value: size }))
	}, [
		datalist,
		productSpecification,
		currentBrand,
		currentFactoryShoeStyle,
		currentColor,
		shouldFilterAllSizes,
		shouldRequireFullInfo
	])

	if (name === 'sizes' && currentStrategy === 'manually' && !hash)
		return (
			<Div className='col-span-full space-y-2'>
				<Label>Sizes</Label>
				<Div
					aria-disabled={disabled}
					className='flex-1 space-y-4 rounded-md border border-dashed py-3 aria-disabled:opacity-50'>
					<Div
						className={cn('px-3', fields.length > 0 && 'scroll-fade-y overflow-y-auto max-h-40')}
						ref={scrollRef}>
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
										disabled={disabled}
										size='sm'
										type='button'
										variant='outline'
										onClick={() => append({ size_numcode: null, qty: null })}>
										<Icon name='ListPlus' />
										{t('ns_common:actions.add')}
									</Button>
								</EmptyContent>
							</Empty>
						) : (
							fields.map((field, index) => (
								<Div className='mb-2 flex items-stretch gap-x-2  overflow-y-auto scroll-fade-y' key={field.id}>
									<Div className='flex-1'>
										<AutoCompleteFieldControl
											{...props}
											datalist={sizeOptions}
											disabled={disabled}
											labelField='label'
											loading={loading}
											name={`sizes.${index}.size_numcode`}
											type='text'
											valueField='value'
											placeholder={t('ns_common:form_placeholder.fill', {
												object: 'size',
												defaultValue: null
											})}
										/>
									</Div>
									<Div className='flex-1'>
										<InputFieldControl
											name={`sizes.${index}.qty`}
											placeholder={t('ns_common:common_fields.quantity')}
											type='number'
										/>
									</Div>
									<GhostButton onClick={() => remove(index)}>
										<Icon name='X' />
									</GhostButton>
								</Div>
							))
						)}
					</Div>
					{fields.length > 0 && (
						<Div className='grid place-content-center place-items-center'>
							<Button
								disabled={disabled}
								size='sm'
								type='button'
								variant='outline'
								onClick={() => {
									append({ size_numcode: '', qty: 0 })
									scrollRef.current!.scrollTo({ top: scrollRef.current!.scrollHeight, behavior: 'smooth' })
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
			datalist={sizeOptions}
			disabled={disabled}
			label='Size'
			labelField='label'
			loading={loading}
			name={name}
			valueField='value'
			placeholder={t('ns_common:form_placeholder.fill', {
				object: 'size',
				defaultValue: null
			})}
		/>
	)
}

export default SizeFieldControl
