import tw from 'tailwind-styled-components'
import { ListBoxProvider } from '../../_contexts/-list-box.context'
import OrderDetails from '../_manufacturing-order-detail/-index'
import EpcDataList from './-epc-data-list'
import ListBoxHeader from './-list-box-header'
import LoggerConsole from './-logger-console'

const EpcListBox: React.FC = () => {
	return (
		<ListBoxProvider>
			<ListBoxWrapper>
				<ListBoxHeader />
				<ListBoxBody>
					<EpcDataList />
				</ListBoxBody>
				<ListBoxFooter>
					<OrderDetails />
					<LoggerConsole />
				</ListBoxFooter>
			</ListBoxWrapper>
		</ListBoxProvider>
	)
}

const ListBoxWrapper = tw.div`flex flex-1 divide-y divide-border justify-between h-full flex-col items-stretch has-[#logger-console[data-state=open]]:max-h-[80dvh] max-h-full rounded-[var(--radius)] border md:order-2 bg-background overflow-hidden`
const ListBoxBody = tw.div`flex flex-1 basis-full items-center justify-center`
const ListBoxFooter = tw.div`grid grid-cols-2 items-center p-2 gap-x-2`

export default EpcListBox
