import { Div, TDivProps } from '../ui'
import { cn } from '@/common/utils/cn'

const Loading: React.FC<TDivProps> = ({ className, ...props }) => {
	return (
		<Div className={cn('flex h-full w-full items-center justify-center bg-background', className)} {...props}>
			<Div className='relative -left-24 size-3 animate-loader rounded-[50%] text-muted-foreground' />
		</Div>
	)
}

export default Loading
