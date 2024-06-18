import { Div, Icon, TDivProps } from '../ui'
import { cn } from '@/common/utils/cn'

const Loading: React.FC<TDivProps> = ({ className, ...props }) => {
	return (
		<Div className={cn('flex h-full w-full items-center justify-center bg-background', className)} {...props}>
			<Div className='relative -left-24 size-3 animate-loader rounded-[50%] text-muted-foreground' />
			{/* <Icon name='Loader' size={24} className='animate-[spin_1.5s_linear_infinite]' /> */}
		</Div>
	)
}

export default Loading
