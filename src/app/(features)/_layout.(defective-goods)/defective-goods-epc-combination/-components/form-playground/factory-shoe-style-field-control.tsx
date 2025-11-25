import { AutoCompleteFieldControl } from '@/components/ui'
import React, { useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DefectiveGoodsCombinationFormValues } from '../../-schemas/defective-goods.schema'
import { DefAutoCompleteFieldControlProps } from './type'

const FactoryShoeStyleFieldControl: React.FC<DefAutoCompleteFieldControlProps> = ({
	loading,
	readOnly,
	disabled,
	...props
}) => {
	const { t } = useTranslation()
	const { reset, getValues, control, ...ctx } = useFormContext<DefectiveGoodsCombinationFormValues>()

	const currentBrand = useWatch({ name: 'brand_name', control })
	// Memoized options for shoe style select
	const factoryShoeStyleOptions = useMemo(() => {
		if (!currentBrand || !Array.isArray(ctx['productSpecification'])) return []
		const brand = ctx['productSpecification'].find((item) => item.brand_name === currentBrand)
		if (!brand?.product_variants) return []
		return brand.product_variants.map(({ factory_shoes_style }) => ({
			label: factory_shoes_style,
			value: factory_shoes_style
		}))
	}, [ctx['productSpecification'], currentBrand])

	const handleValueChange = (value) => {
		reset({
			...getValues(),
			cust_shoes_style:
				ctx['productSpecification']
					.find((item) => item.brand_name === currentBrand)
					?.product_variants?.find((item) => item.factory_shoes_style === value)?.cust_shoes_style ?? '',
			color_sn: '',
			size_code: ''
		})
	}

	return (
		<AutoCompleteFieldControl
			{...props}
			name='factory_shoes_style'
			label={t('ns_erp:fields.factory_shoes_style')}
			placeholder={t('ns_common:form_placeholder.fill', {
				object: String(t('ns_erp:fields.factory_shoes_style')).toLowerCase(),
				defaultValue: null
			})}
			loading={loading}
			datalist={factoryShoeStyleOptions}
			labelField='label'
			valueField='value'
			readOnly={readOnly}
			disabled={disabled}
			onInput={handleValueChange}
			onSelect={handleValueChange}
		/>
	)
}

export default FactoryShoeStyleFieldControl
