import { SelectFieldControl } from '@/components/ui'
import { SelectFieldControlProps } from '@/components/ui/@field-control/select'
import React, { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DefectiveGoodsCombinationFormValues } from '../../-schemas/defective-goods.schema'

type BrandFieldControl = Partial<
	SelectFieldControlProps<DefectiveGoodsCombinationFormValues, Record<'label' | 'value', string>>
>

const BrandFieldControl: React.FC<BrandFieldControl> = ({ disabled, ...props }) => {
	const { t } = useTranslation()
	const { reset, getValues, ...ctx } = useFormContext<DefectiveGoodsCombinationFormValues>()

	// Memoized options for brand select
	const brandOptions = useMemo(() => {
		if (!Array.isArray(ctx['productSpecification'])) return []
		return ctx['productSpecification'].map(({ brand_name }) => ({
			label: brand_name,
			value: brand_name
		}))
	}, [ctx['productSpecification']])

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
				reset({ ...getValues(), factory_shoes_style: '', color_sn: '', size_code: '' })
			}}
			labelField='label'
			valueField='value'
		/>
	)
}

export default BrandFieldControl
