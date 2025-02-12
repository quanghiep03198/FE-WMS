import tw from 'tailwind-styled-components'
import OrderDetails from '../_manufacturing-order-detail/-index'
import EpcDataList from './-data-list-body'
import ListBoxHeader from './-data-list-header'
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

const ListBoxWrapper = tw.div`relative flex flex-1 divide-y divide-border justify-between h-full flex-col items-stretch max-h-full rounded-[var(--radius)] border md:order-2 bg-background overflow-hidden`
const ListBoxBody = tw.div`flex flex-1 basis-full items-center justify-center`
const ListBoxFooter = tw.div`flex justify-end items-center p-2 gap-x-2 max-w-full *:basis-full`

export default EpcListBox
