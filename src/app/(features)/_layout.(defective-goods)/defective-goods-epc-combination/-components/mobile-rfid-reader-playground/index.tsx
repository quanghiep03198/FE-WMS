import useMediaQuery from '@/common/hooks/use-media-query'
import { buttonVariants, Icon, Sheet, SheetContent, SheetTrigger } from '@/components/ui'
import RfidReaderPlayground from '../../../-components/rfid-reader-playground'
import { ReaderPlaygroundProvider } from '../../../-contexts/rfid-reader-playground.context'
import { useSwitchCombinationStrategy } from '../../../-hooks/use-switch-combination-strategy'

export const MobileRFIDReaderPlayground: React.FC = () => {
	const isMobile = useMediaQuery('(max-width: 1023px)')
	const { currentStrategy } = useSwitchCombinationStrategy()
	const isUsingUHFReader = currentStrategy === 'uhf'

	if (!isMobile || !isUsingUHFReader) return null

	return (
		<Sheet>
			<SheetTrigger
				id='reader-playground-sheet-trigger'
				className={buttonVariants({
					variant: 'secondary',
					size: 'icon',
					className: 'hidden'
				})}>
				<Icon name='ChevronUp' />
			</SheetTrigger>
			<SheetContent side='bottom' className='h-[80vh] p-0'>
				<ReaderPlaygroundProvider>
					<RfidReaderPlayground />
				</ReaderPlaygroundProvider>
			</SheetContent>
		</Sheet>
	)
}

export const MobileRFIDReaderPlaygroundTrigger: React.FC = () => (
	<label
		htmlFor='reader-playground-sheet-trigger'
		className={buttonVariants({
			variant: 'ghost',
			size: 'icon',
			className: 'hidden @7xl/playground-wrapper:inline-flex'
		})}>
		<Icon name='PanelBottomOpen' />
	</label>
)
