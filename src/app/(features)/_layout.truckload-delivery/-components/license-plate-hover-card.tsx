import { HoverCard, HoverCardContent, HoverCardTrigger, Icon } from '@/components/ui'
import { cn } from '@common/utils/cn'
import { url } from 'zod'

const LicensePlateHoverCard: React.FC<{
	licensePlate: string
	licensePlateImage: string | null
}> = ({ licensePlate, licensePlateImage }) => {
	const disabled = !url().safeParse(licensePlateImage).success

	return (
		<HoverCard openDelay={0} closeDelay={0}>
			<HoverCardTrigger
				aria-disabled={disabled}
				className={cn(
					'inline-grid cursor-default grid-cols-[auto_1fr] items-center gap-x-2 p-0! hover:underline hover:underline-offset-2 aria-disabled:hover:no-underline @5xl:grid-cols-1'
				)}>
				<Icon name='Truck' className='@5xl:hidden' />
				{licensePlate}
			</HoverCardTrigger>
			<HoverCardContent hidden={disabled} className='max-w-60' align='start'>
				<img
					loading='lazy'
					src={licensePlateImage}
					alt={`${licensePlate} image`}
					className='aspect-video w-full max-w-full rounded-[inherit] object-cover object-center'
				/>
			</HoverCardContent>
		</HoverCard>
	)
}

export default LicensePlateHoverCard
