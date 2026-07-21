import {
	Button,
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	Dialog,
	DialogContent,
	DialogTrigger,
	Icon
} from '@/components/ui'
import { useTranslation } from 'react-i18next'

const RFIDAgentInstructionDialog: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size='sm' variant='link'>
					{t('ns_common:actions.learn_more')} <Icon name='ArrowUpRight' />
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-8xl h-full max-h-[90vh]'>
				<Carousel>
					<CarouselContent>
						<CarouselItem className='h-full'>RFID Agent</CarouselItem>
						<CarouselItem className='h-full'>Mosquitto installation instruction</CarouselItem>
						<CarouselItem className='h-full'>RFID Agent installation instruction</CarouselItem>
					</CarouselContent>
					<CarouselPrevious />
					<CarouselPrevious />
				</Carousel>
			</DialogContent>
		</Dialog>
	)
}

export default RFIDAgentInstructionDialog
