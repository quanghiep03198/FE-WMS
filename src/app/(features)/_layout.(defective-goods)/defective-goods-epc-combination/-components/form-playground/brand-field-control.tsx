import { useGetProductSpecificationQuery } from '@/app/(features)/-hooks/use-product-specification-asm'
import { SelectFieldControl } from '@/components/ui'
import type { SelectFieldControlProps } from '@/components/ui/@field-control/select'
import React, { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { DefectiveGoodsCombinationFormValues } from '../../-schemas/defective-goods.schema'
import { useSwitchCombinationStrategy } from '../../../-hooks/use-switch-combination-strategy'

type BrandFieldControl = Partial<
	SelectFieldControlProps<DefectiveGoodsCombinationFormValues, Record<'label' | 'value', string>>
>

const BrandFieldControl: React.FC<BrandFieldControl> = ({ disabled, ...props }) => {
	const { t } = useTranslation()
	const { reset, getValues, ...ctx } = useFormContext<DefectiveGoodsCombinationFormValues>()

	// Memoized options for brand select
	const { currentStrategy } = useSwitchCombinationStrategy()
	const { data } = useGetProductSpecificationQuery()

	const brandOptions = useMemo(() => {
		if (!Array.isArray(data)) return []
		return data.map(({ brand_name }) => ({
			label: brand_name,
			value: brand_name
		}))
	}, [data])

	return (
		<SelectFieldControl
			{...props}
			name='brand_name'
			label={t('ns_erp:fields.brand_name')}
			placeholder={t('ns_common:form_placeholder.fill', {
				object: String(t('ns_erp:fields.brand_name')).toLowerCase(),
				defaultValue: null
			})}
			disabled={disabled}
			datalist={brandOptions}
			onValueChange={() => {
				reset({
					...getValues(),
					factory_shoes_style: '',
					cust_shoes_style: '',
					color_sn: '',
					...(currentStrategy !== 'manually' ? { size_code: '' } : { sizes: [] })
				})
			}}
			labelField='label'
			valueField='value'
		/>
	)
}

export default BrandFieldControl
