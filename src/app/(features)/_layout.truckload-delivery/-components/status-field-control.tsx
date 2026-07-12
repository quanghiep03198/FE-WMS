'use no memo'

import type { IconProps } from '@/components/ui'
import {
	FormControl,
	FormField,
	FormItem,
	Icon,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Tooltip
} from '@/components/ui'
import { cn } from '@common/utils/cn'
import type { ResourceKey } from 'i18next'
import React, { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { TruckloadDeliveryStatus } from '../-constants'

type DropdownOption = { label: string; value: TruckloadDeliveryStatus; icon: IconProps['name'] }

type StatusFieldControlProps = {
	name: string
	disabled: boolean
}

const StatusFieldControl: React.FC<StatusFieldControlProps> = ({ name, disabled }) => {
	const { t, i18n } = useTranslation()
	const { control, getValues, getFieldState } = useFormContext()

	const error = getFieldState(name).error

	const datalist: DropdownOption[] = useMemo(
		() => [
			{
				label: String(t('ns_common:status.pending')),
				value: TruckloadDeliveryStatus.PENDING,
				icon: 'Loader'
			},
			{
				label: String(t('ns_common:status.confirmed')),
				value: TruckloadDeliveryStatus.CONFIRMED,
				icon: 'CircleCheckBig'
			},
			{
				label: String(t('ns_common:status.request_change')),
				value: TruckloadDeliveryStatus.REQUEST_CHANGE,
				icon: 'Undo2'
			}
		],
		[i18n.language]
	)

	const isError = Boolean(error)

	return (
		<FormField
			name={name!}
			defaultValue={getValues(name)}
			control={control}
			render={({ field }) => {
				return (
					<FormItem>
						<Select
							value={field.value ?? ''}
							defaultValue={field.value ?? ''}
							onValueChange={field.onChange}
							disabled={disabled}>
							<Tooltip
								message={t(error?.message as ResourceKey) || ''}
								triggerProps={{ type: 'button', className: 'w-full' }}
								contentProps={{
									hidden: !error,
									side: 'bottom',
									align: 'start',
									['aria-invalid']: !!error
								}}>
								<FormControl>
									<SelectTrigger
										disabled={field.disabled}
										className={cn(
											'w-full bg-background focus:border-primary',
											isError &&
												'w-full border-destructive focus:border-destructive active:border-destructive',
											!field.value && 'text-muted-foreground'
										)}>
										<SelectValue placeholder={!field.value && t('ns_erp:fields.status_approve')} />
									</SelectTrigger>
								</FormControl>
							</Tooltip>
							<SelectContent>
								{Array.isArray(datalist) && datalist.length > 0 ? (
									datalist.map((option) => (
										<SelectItem key={option.value} value={String(option.value)}>
											<span className='inline-flex items-center gap-x-2'>
												<Icon
													name={option.icon}
													className={cn({
														'stroke-muted-foreground': option.value === TruckloadDeliveryStatus.PENDING,
														'stroke-success': option.value === TruckloadDeliveryStatus.CONFIRMED,
														'stroke-destructive': option.value === TruckloadDeliveryStatus.REQUEST_CHANGE
													})}
												/>{' '}
												{option.label}
											</span>
										</SelectItem>
									))
								) : (
									<SelectItem
										value={null}
										disabled
										className='flex items-center justify-center text-center text-xs font-medium'>
										No option
									</SelectItem>
								)}
							</SelectContent>
						</Select>
					</FormItem>
				)
			}}
		/>
	)
}

export default StatusFieldControl
