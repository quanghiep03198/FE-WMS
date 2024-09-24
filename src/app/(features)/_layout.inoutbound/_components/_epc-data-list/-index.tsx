import tw from 'tailwind-styled-components'
import { ListBoxProvider } from '../../_contexts/-list-box.context'
import EpcDataList from './-epc-data-list'
import EpcListHeading from './-epc-list-heading'
import LoggerConsole from './-logger-console'
import OrderDetails from './-order-details'

const EpcListBox: React.FC = () => {
	return (
		<ListBoxProvider>
			<ListBoxWrapper>
				<EpcListHeading />
				<EpcDataList />
				<ListBoxFooter>
					<OrderDetails />
					<LoggerConsole />
				</ListBoxFooter>
			</ListBoxWrapper>
		</ListBoxProvider>
	)
}

const ListBoxWrapper = tw.div`flex flex-1 divide-y divide-border justify-between h-full flex-col items-stretch has-[#logger-console[data-state=open]]:max-h-[80dvh] max-h-full rounded-[var(--radius)] border md:order-2 bg-background overflow-hidden`
const ListBoxFooter = tw.div`grid grid-cols-2 items-center`

export default EpcListBox
