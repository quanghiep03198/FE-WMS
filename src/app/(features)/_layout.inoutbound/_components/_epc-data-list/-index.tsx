import tw from 'tailwind-styled-components'
import OrderDetails from '../_manufacturing-order-detail/-index'
import EpcDataList from './-epc-data-list'
import ListBoxHeader from './-list-box-header'
import LoggerConsole from './-logger-console'

const EpcListBox: React.FC = () => {
	return (
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
	)
}

const ListBoxWrapper = tw.div`flex flex-1 divide-y divide-border justify-between h-full flex-col items-stretch has-[#logger-console[data-state=open]]:max-h-[80dvh] max-h-full rounded-[var(--radius)] border md:order-2 bg-background overflow-hidden`
const ListBoxBody = tw.div`flex flex-1 basis-full items-center justify-center`
const ListBoxFooter = tw.div`flex justify-end items-center p-2 gap-x-2 max-w-full *:basis-full`

export default EpcListBox
