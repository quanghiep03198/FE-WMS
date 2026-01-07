import useMediaQuery from '@/common/hooks/use-media-query'
import { cn } from '@/common/utils/cn'
import { HoverCard, HoverCardContent, HoverCardTrigger, Icon } from '@/components/ui'
import { url } from 'zod'

const LicensePlateHoverCard: React.FC<{
	licensePlate: string
	licensePlateImage: string | null
}> = ({ licensePlate, licensePlateImage }) => {
	const disabled = !url().safeParse(licensePlateImage).success
	const isMobile = useMediaQuery('(max-width: 1023px)')

	return (
		<HoverCard openDelay={0} closeDelay={0}>
			<HoverCardTrigger
				className={cn(
					'inline-grid cursor-default grid-cols-[auto_1fr] items-center gap-x-2 !p-0',
					isMobile ? 'font-medium' : 'font-normal',
					disabled ? 'hover:no-underline' : 'hover:underline hover:underline-offset-2'
				)}>
				<Icon name='Container' />
				{licensePlate}
			</HoverCardTrigger>
			<HoverCardContent hidden={disabled} className='max-w-60' align='start'>
				<img
					loading='lazy'
					src={licensePlateImage}
					className='aspect-video w-full max-w-full rounded-[inherit] object-cover object-center'
				/>
			</HoverCardContent>
		</HoverCard>
	)
}

export default LicensePlateHoverCard
