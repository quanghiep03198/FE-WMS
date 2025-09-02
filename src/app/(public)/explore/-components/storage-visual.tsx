import { cn } from '@/common/utils/cn'
import { Icon, Typography } from '@/components/ui'

export const range = (start: number, end?: number, step: number = 1): number[] => {
	if (end === undefined) {
		end = start
		start = 0
	}

	const result: number[] = []
	for (let i = start; step > 0 ? i < end : i > end; i += step) {
		result.push(i)
	}
	return result
}

interface Props {
	className?: string
}

const StorageVisual: React.FC<Props> = ({ className }) => {
	const cols = [
		<Icon key={0} name='FileArchive' className='h-6 w-6 md:h-6 md:w-6' />,
		<Icon key={1} name='FileCode' className='h-6 w-6 md:h-6 md:w-6' />
	]

	return (
		<div className='col-span-full row-span-1 grid grid-cols-[1fr_1.5fr] rounded-lg border p-4'>
			<div className='space-y-2 p-4'>
				<Typography as='h5' className='inline-flex items-center gap-x-2 text-lg font-medium'>
					<Icon name='FolderArchive' size={18} /> Lightweight
				</Typography>
				<Typography>
					Minimal resource usage <br />
					<span className='text-muted-foreground'>easy to install and run in the background</span>
				</Typography>
			</div>
			<figure
				className={cn(
					'nowrap inset-0 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,hsl(var(--background))_10%,hsl(var(--background))_90%,transparent)]',
					className
				)}
				role='img'
				aria-label='Supabase Storage supports images, documents and videos'>
				{range(0, 2).map((_, idx1: number) => (
					<div
						key={`row-${idx1}`}
						className='pause motion-safe:group-hover:run relative left-0 z-10 flex h-full w-auto animate-marquee items-end pb-4 transition-transform will-change-transform'>
						{range(0, 10).map((_, idx2: number) => (
							<div key={`col-${idx2}`} className='ml-2 flex flex-col gap-2 md:gap-2'>
								{cols.map((col: any, idx3: number) => (
									<div
										key={`icon-${idx3}`}
										className='bg hover:border-foreground-lighter hover:text-foreground-light hover:bg-surface-200 flex h-[60px] w-[60px] items-center justify-center rounded-lg border text-muted md:h-[62px] md:w-[62px] md:min-w-[62px]'>
										{col}
									</div>
								))}
							</div>
						))}
					</div>
				))}
			</figure>
		</div>
	)
}

export default StorageVisual
