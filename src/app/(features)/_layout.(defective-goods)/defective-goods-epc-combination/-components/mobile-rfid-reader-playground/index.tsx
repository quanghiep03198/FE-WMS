import useMediaQuery from '@/common/hooks/use-media-query'
import { buttonVariants, Icon, Sheet, SheetContent, SheetTrigger } from '@/components/ui'
import RfidReaderPlayground from '../../../-components/rfid-reader-playground'
import { ReaderPlaygroundProvider } from '../../../-contexts/rfid-reader-playground.context'
import { useSwitchCombinationStrategy } from '../../../-hooks/use-switch-combination-strategy'

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
					<RfidReaderPlayground resetOnUnmount={false} />
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
