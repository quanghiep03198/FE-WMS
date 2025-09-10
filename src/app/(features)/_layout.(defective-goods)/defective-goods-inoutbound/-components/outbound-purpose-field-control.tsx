'use no memo'

import { cn } from '@/common/utils/cn'
import {
	FormControl,
	FormField,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Tooltip
} from '@/components/ui'
import { useId, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DefectiveGoodsOutboundPurpose } from '../-constants'

const FIELD_NAME = 'outbound_purpose' as const

const OutboundPurposeFieldControl = ({ ...props }) => {
	const { t, i18n } = useTranslation()
	const { control, getFieldState, getValues } = useFormContext()
	const { error } = getFieldState(FIELD_NAME)
	const id = useId()

	const datalist = useMemo(() => {
		return [
			{
				label: t('ns_inoutbound:inoutbound_actions.sell'),
				value: DefectiveGoodsOutboundPurpose.SELL
			},
			{
				label: t('ns_inoutbound:inoutbound_actions.recycling'),
				value: DefectiveGoodsOutboundPurpose.RECYCLE
			},
			{
				label: t('ns_inoutbound:inoutbound_actions.giveaway'),
				value: DefectiveGoodsOutboundPurpose.GIVEAWAY
			}
		]
	}, [i18n.language])

	return (
		<FormField
			name={FIELD_NAME}
			defaultValue={getValues(FIELD_NAME)}
			control={control}
			render={({ field }) => {
				return (
					<Select
						{...props}
						value={field.value ?? ''}
						defaultValue={field.value ?? ''}
						onValueChange={field.onChange}>
						<FormControl>
							<Tooltip
								message={t(error?.message as Parameter<typeof t>)}
								triggerProps={{ asChild: true }}
								contentProps={{
									hidden: !error,
									className:
										'bg-destructive text-destructive-foreground min-w-[var(--radix-popper-anchor-width)]'
								}}>
								<SelectTrigger
									id={id}
									disabled={field.disabled}
									className={cn(
										'min-w-[var(--form-field-width)] bg-background focus:border-primary',
										!!error && 'w-full border-destructive focus:border-destructive active:border-destructive'
									)}>
									<SelectValue
										placeholder={!field.value && t('ns_inoutbound:placeholders.outbound_purpose')}
									/>
								</SelectTrigger>
							</Tooltip>
						</FormControl>
						<SelectContent>
							{datalist.map((option, index) => (
								<SelectItem key={index.toString()} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)
			}}
		/>
	)
}

export default OutboundPurposeFieldControl
