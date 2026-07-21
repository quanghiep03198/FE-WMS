import { Icon } from '@/components/ui'
import { PresetBreakPoints } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import useMediaQuery from '@hooks/use-media-query'
import { cloneElement } from 'react'
import { VisualCard } from './visual-card'

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
	const isSmallScreen = useMediaQuery(PresetBreakPoints.SMALL)

	return (
		<VisualCard.Wrapper className='w-full p-6' orientation={isSmallScreen ? 'vertical' : 'horizontal'}>
			<VisualCard.Header className='basis-1/3 space-y-2 self-center p-0 md:basis-1/2'>
				<VisualCard.Title as='h5' className='inline-flex items-center gap-x-2 text-lg font-medium'>
					<Icon name='FolderArchive' /> Lightweight
				</VisualCard.Title>
				<VisualCard.Description>
					<span className='text-foreground'>Minimal resource usage</span> <br /> ensures your system remains fast
					while RFID Agent is running{' '}
				</VisualCard.Description>
			</VisualCard.Header>
			<VisualCard.Content className='mt-6 flex-1 mask-[linear-gradient(to_right,transparent,var(--background)_10%,var(--background)_90%,transparent)] @xl:m-0'>
				<figure
					className={cn('nowrap inset-0 flex overflow-hidden', className)}
					role='img'
					aria-label='Supabase Storage supports images, documents and videos'>
					<MarqueeList />
					{cloneElement(<MarqueeList />, { 'aria-hidden': true })}
				</figure>
			</VisualCard.Content>
		</VisualCard.Wrapper>
	)
}

const MarqueeList: React.FC = () => {
	const cols = [
		<Icon key={0} name='FileArchive' className='h-6 w-6 md:h-6 md:w-6' />,
		<Icon key={1} name='FileCode' className='h-6 w-6 md:h-6 md:w-6' />
	]
	return range(0, 2).map((_, idx1: number) => (
		<div
			key={`row-${idx1}`}
			className='group-hover:paused relative left-0 z-10 flex h-full w-auto animate-[marquee_10s_forwards_linear_infinite] items-end pb-4 transition-transform will-change-transform'>
			{range(0, 8).map((_, idx2: number) => (
				<div key={`col-${idx2}`} className='ml-2 flex flex-col gap-2 md:gap-2'>
					{cols.map((col: any, idx3: number) => (
						<div
							key={`icon-${idx3}`}
							className='bg bg-card text-muted-foreground hover:border-primary hover:text-primary flex h-[60px] w-[60px] items-center justify-center rounded-lg border duration-100 md:h-[62px] md:w-[62px] md:min-w-[62px]'>
							{col}
						</div>
					))}
				</div>
			))}
		</div>
	))
}

export default StorageVisual
