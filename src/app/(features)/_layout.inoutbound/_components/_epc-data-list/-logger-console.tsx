import { cn } from '@/common/utils/cn'
import {
	Button,
	buttonVariants,
	Div,
	Icon,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Typography
} from '@/components/ui'
import { useVirtualList } from 'ahooks'
import { format } from 'date-fns'
import { pick } from 'lodash'
import { useRef } from 'react'
import { usePageContext } from '../../_contexts/-page-context'

const LoggerConsole: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null)
	const wrapperRef = useRef<HTMLDivElement>(null)
	const { logs, clearLog } = usePageContext((state) => pick(state, ['logs', 'clearLog']))

	const [virtualList, scrollTo] = useVirtualList(logs, {
		containerTarget: containerRef,
		wrapperTarget: wrapperRef,
		itemHeight: 32,
		overscan: 5
	})

	return (
		<Sheet>
			<SheetTrigger className={cn(buttonVariants({ variant: 'secondary', className: 'max-w-full' }))}>
				<Icon name='Terminal' role='img' /> Log
			</SheetTrigger>
			<SheetContent side='bottom'>
				<SheetHeader className='mb-6 !space-y-1'>
					<SheetTitle>Logs</SheetTitle>
					<SheetDescription>Tracking all activities inside log</SheetDescription>
				</SheetHeader>
				<Div className='divide-y rounded-lg border @container'>
					{Array.isArray(virtualList) && logs.length > 0 ? (
						<Div ref={containerRef} className='flex h-40 flex-col gap-y-2 overflow-auto'>
							<Div ref={wrapperRef} className='p-2'>
								{virtualList?.map((item) => (
									<Typography
										key={item.index}
										variant='code'
										className='flex w-full items-center gap-x-2 text-sm'>
										<span className={cn(item.data.type === 'info' ? 'text-success' : 'text-destructive')}>
											[{item.data.type.toUpperCase()}]
										</span>
										<span className='text-muted-foreground'>
											{format(item.data.timestamp, 'yyyy-MM-dd HH:mm:ss')}
										</span>
										<span dangerouslySetInnerHTML={{ __html: item.data.message }} />
									</Typography>
								))}
							</Div>
						</Div>
					) : (
						<Div className='grid min-h-40 w-full basis-full place-content-center text-center text-sm text-muted-foreground @[320px]:min-h-56'>
							<Typography
								variant='code'
								className='inline-flex items-center gap-x-2 font-medium tracking-widest'>
								<Icon name='Terminal' /> No log
							</Typography>
						</Div>
					)}
					<Div className='flex items-center justify-end @container'>
						<Button size='sm' variant='link' onClick={() => scrollTo(0)}>
							<Icon name='ArrowUp' role='img' size={14} className='hidden @[320px]:inline-block' />
							Go to top
						</Button>
						<Button size='sm' variant='link' onClick={() => scrollTo(logs.length - 1)}>
							<Icon name='ArrowDown' role='img' size={14} className='hidden @[320px]:inline-block' />
							Go to bottom
						</Button>
						<Button size='sm' variant='link' onClick={clearLog} className='font-medium text-destructive'>
							<Icon name='ListX' role='img' size={18} className='hidden @[320px]:inline-block' />
							Clear log
						</Button>
					</Div>
				</Div>
			</SheetContent>
		</Sheet>
	)
}

export default LoggerConsole
