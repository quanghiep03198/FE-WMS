import { cn } from '@/common/utils/cn'
import { Icon } from '@/components/ui'
import React from 'react'
import { FormLabel as BaseFormLabel, useFormField } from '../@core/form'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../@core/tooltip'

type AlternativeFormLabelProps = {
	labelText: string
	htmlFor?: string
	messageType: 'default' | 'alternative'
}

const FormLabel: React.FC<AlternativeFormLabelProps> = ({ labelText, htmlFor, messageType: messageMode }) => {
	const { error } = useFormField()

	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip>
				<TooltipTrigger type='button' className='inline-flex items-center gap-x-2'>
					<Icon name='TriangleAlert' size={16} className={cn('stroke-destructive', { hidden: !error })} />
					<BaseFormLabel htmlFor={htmlFor}>{labelText}</BaseFormLabel>
				</TooltipTrigger>
				<TooltipContent
					side='right'
					align='end'
					sideOffset={8}
					hidden={messageMode !== 'alternative' || !error}
					className='bg-destructive'>
					{String(error?.message)}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export default FormLabel
