import { buttonVariants, Icon, Sheet, SheetContent, SheetTrigger } from '@/components/ui'
import { useSwitchCombinationStrategy } from '@/features/defective-goods/hooks/use-switch-combination-strategy'
import useMediaQuery from '@hooks/use-media-query'
import { ReaderPlaygroundProvider } from '../contexts/rfid-reader-playground.context'
import RFIDReaderPlayground from './playground'

const TRIGGER_ID = 'reader-playground-sheet-trigger'

export const MobileReaderPlayground: React.FC = () => {
	const isMobile = useMediaQuery('(max-width: 1023px)')
	const { currentStrategy } = useSwitchCombinationStrategy()
	const isUsingUHFReader = currentStrategy === 'uhf'

	if (!isMobile || !isUsingUHFReader) return null

	return (
		<Sheet>
			<SheetTrigger
				id={TRIGGER_ID}
				className={buttonVariants({
					variant: 'secondary',
					size: 'icon',
					className: 'hidden'
				})}
			/>
			<SheetContent
				side='bottom'
				className='h-[80vh] p-0 [&>button:first-of-type]:hidden'
				onOpenAutoFocus={(event) => event.preventDefault()}>
				<ReaderPlaygroundProvider>
					<RFIDReaderPlayground resetOnUnmount={false} />
				</ReaderPlaygroundProvider>
			</SheetContent>
		</Sheet>
	)
}

export const MobileReaderPlaygroundTrigger: React.FC = () => {
	const isMobile = useMediaQuery('(max-width: 1023px)')
	const { currentStrategy } = useSwitchCombinationStrategy()
	const isUsingUHFReader = currentStrategy === 'uhf'

	if (!isMobile || !isUsingUHFReader) return null

	return (
		<label
			htmlFor={TRIGGER_ID}
			className={buttonVariants({
				variant: 'secondary',
				size: 'sm',
				className: 'inline-flex @7xl/playground-wrapper:hidden'
			})}>
			<Icon name='PanelBottomOpen' size={18} /> {'RFID Playground'}
		</label>
	)
}
