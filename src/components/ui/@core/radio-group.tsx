import { cn } from '@common/utils/cn'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'
import * as React from 'react'

const RadioGroup: React.FC<React.ComponentProps<typeof RadioGroupPrimitive.Root>> = ({ className, ...props }) => {
	return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} />
}
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem: React.FC<React.ComponentProps<typeof RadioGroupPrimitive.Item>> = ({
	className,

	...props
}) => {
	return (
		<RadioGroupPrimitive.Item
			className={cn(
				'aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			{...props}>
			<RadioGroupPrimitive.Indicator className='flex items-center justify-center'>
				<Circle className='h-2.5 w-2.5 fill-primary' />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	)
}
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
