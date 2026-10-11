import { cn } from '@common/utils/cn'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@components/ui/hover-card'
import { Icon } from '@components/ui/icon'
import { url } from 'zod'

const LicensePlateHoverCard: React.FC<{
	licensePlate: string | null
	licensePlateImage: string | null | undefined
}> = ({ licensePlate, licensePlateImage }) => {
	const disabled = !url().safeParse(licensePlateImage).success

	return (
		<HoverCard closeDelay={0} openDelay={0}>
			<HoverCardTrigger
				aria-disabled={disabled}
				className={cn(
					'inline-grid cursor-default grid-cols-[auto_1fr] items-center gap-x-2 p-0! hover:underline hover:underline-offset-2 aria-disabled:hover:no-underline @5xl:grid-cols-1'
				)}>
				<Icon className='@5xl:hidden' name='Truck' />
				{licensePlate}
			</HoverCardTrigger>
			<HoverCardContent align='start' className='max-w-60' hidden={disabled}>
				{licensePlateImage && (
					<img
						alt={`${licensePlate} image`}
						className='aspect-video w-full max-w-full rounded-[inherit] object-cover object-center'
						loading='lazy'
						src={licensePlateImage}
					/>
				)}
			</HoverCardContent>
		</HoverCard>
	)
}

export default LicensePlateHoverCard
