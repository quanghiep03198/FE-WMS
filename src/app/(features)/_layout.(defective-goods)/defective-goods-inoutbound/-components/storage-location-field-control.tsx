'use no memo'

import { cn } from '@/common/utils/cn'
import { FormControl, FormField, Input, Tooltip } from '@/components/ui'
import { isNil } from 'lodash'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type StorageLocationFieldControlProps = React.ComponentProps<'input'>

const FIELD_NAME = 'storage_location'

const StorageLocationFieldControl: React.FC<StorageLocationFieldControlProps> = ({ className, ref, ...props }) => {
	const { control, getFieldState } = useFormContext()
	const { error } = getFieldState(FIELD_NAME)

	const { t } = useTranslation()

	return (
		<FormField
			name={FIELD_NAME}
			control={control}
			render={({ field }) => (
				<Tooltip
					message={t(error?.message as Parameter<typeof t>)}
					triggerProps={{
						type: 'button'
					}}
					contentProps={{
						side: 'bottom',
						hidden: isNil(error),
						className: 'bg-destructive text-destructive-foreground w-[var(--radix-popper-anchor-width)]'
					}}>
					<FormControl>
						<Input
							{...props}
							name='storage_location'
							aria-invalid={!isNil(error)}
							onChange={(e) => field.onChange(e.currentTarget.value.toUpperCase().trim())}
							value={field.value}
							placeholder={t('ns_inoutbound:placeholders.enter_storage_location')}
							className={cn(
								'min-w-[var(--form-field-width)] aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-within:border-destructive',
								className
							)}
							ref={(e) => {
								field.ref(e)
								if (ref && 'current' in ref) ref.current = e
							}}
						/>
					</FormControl>
				</Tooltip>
			)}
		/>
	)
}

export default StorageLocationFieldControl
