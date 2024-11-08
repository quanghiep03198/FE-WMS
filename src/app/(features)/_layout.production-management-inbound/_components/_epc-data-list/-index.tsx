import tw from 'tailwind-styled-components'
import DataListAction from './-data-list-action'
import DataListBody from './-data-list-body'
import DataListHeader from './-data-list-header'

const EpcListBox: React.FC = () => {
	return (
		<ListBoxWrapper>
			<ListBoxHeader>
				<DataListHeader />
			</ListBoxHeader>
			<ListBoxBody>
				<DataListBody />
			</ListBoxBody>
			<ListBoxFooter>
				<DataListAction />
			</ListBoxFooter>
		</ListBoxWrapper>
	)
}

const ListBoxWrapper = tw.div`relative flex flex-1 divide-y divide-border justify-between flex-col items-stretch rounded-[var(--radius)] border md:order-2 bg-background overflow-hidden h-full`
const ListBoxHeader = tw.div`p-1 bg-table-head`
const ListBoxBody = tw.div`flex flex-1 basis-full items-center justify-center`
const ListBoxFooter = tw.div`flex justify-end items-center p-2 gap-x-2 max-w-full *:basis-full`

export default EpcListBox
