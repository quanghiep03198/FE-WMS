import UploadDataFileDialog from '@/app/(features)/_components/_shared/-upload-dialog'
import tw from 'tailwind-styled-components'
import OrderDetails from '../_manufacturing-order-detail/-index'
import EpcDataList from './-data-list-body'
import ListBoxHeader from './-data-list-header'

const EpcListBox: React.FC = () => {
	return (
		<ListBoxWrapper>
			<ListBoxHeader />
			<ListBoxBody>
				<EpcDataList />
			</ListBoxBody>
			<ListBoxFooter>
				<UploadDataFileDialog station='WH101' maxFiles={100} />
				<OrderDetails />
			</ListBoxFooter>
		</ListBoxWrapper>
	)
}

const ListBoxWrapper = tw.div`relative flex flex-1 divide-y divide-border justify-between h-full flex-col items-stretch max-h-full rounded-[var(--radius)] border md:order-2 bg-background overflow-hidden`
const ListBoxBody = tw.div`flex flex-1 basis-full items-center justify-center`
const ListBoxFooter = tw.div`flex justify-end items-center p-1.5 gap-x-2 max-w-full *:basis-full`

export default EpcListBox
