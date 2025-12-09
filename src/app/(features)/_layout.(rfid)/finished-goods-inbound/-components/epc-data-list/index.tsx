import UploadDataFileDialog from '@/app/(features)/-components/shared/upload-dialog'
import tw from 'tailwind-styled-components'
import OrderDetails from '../manufacturing-order-detail'
import EpcDataList from './data-list-body'
import ListBoxHeader from './data-list-header'

const EpcListBox: React.FC = () => {
	return (
		<ListBoxWrapper
			style={{
				'--list-header-height': '52px',
				'--list-footer-height': '52px'
			}}>
			<ListBoxHeader />
			<ListBoxBody>
				<EpcDataList />
			</ListBoxBody>
			<ListBoxFooter>
				<OrderDetails />
				<UploadDataFileDialog station='WH101' maxFiles={200} />
			</ListBoxFooter>
		</ListBoxWrapper>
	)
}

const ListBoxWrapper = tw.div`
	@4xl:h-fit @4xl:sticky @4xl:top-[calc(var(--header-height)+var(--toolbar-height))] 
	relative flex flex-1 divide-y divide-border justify-between h-full flex-col items-stretch max-h-full bg-background overflow-hidden
	group-has-[#toggle-fullscreen[data-state=checked]]:relative group-has-[#toggle-fullscreen[data-state=checked]]:top-auto group-has-[#toggle-fullscreen[data-state=checked]]:!h-full
	rounded-[var(--radius)] border md:order-2 
	`
const ListBoxBody = tw.div`flex flex-1 basis-full items-center justify-center`
const ListBoxFooter = tw.div`flex justify-end items-center p-1.5 gap-x-2 max-w-full *:basis-full h-[var(--list-footer-height)]`

export default EpcListBox
