import UploadDataFileDialog from '@/app/(features)/-components/shared/upload-dialog'
import tw from 'tailwind-styled-components'
import OrderDetails from '../manufacturing-order-detail'
import EpcDataList from './data-list-body'
import ListBoxHeader from './data-list-header'

const EpcListBox: React.FC = () => {
	return (
		<ListBoxWrapper>
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

const ListBoxWrapper: React.FC<React.ComponentProps<'div'>> = tw.div`
	[--list-header-height:52px]
	[--list-footer-height:52px]
	@4xl:h-fit
	relative flex flex-1 divide-y divide-border justify-between h-full flex-col items-stretch max-h-full bg-background overflow-hidden
	group-has-[#toggle-fullscreen[data-state=checked]]:relative group-has-[#toggle-fullscreen[data-state=checked]]:top-auto group-has-[#toggle-fullscreen[data-state=checked]]:!h-full
	rounded-[var(--radius)] border md:order-2 
	`
const ListBoxBody: React.FC<React.ComponentProps<'div'>> = tw.div`flex flex-1 basis-full items-center justify-center`
const ListBoxFooter: React.FC<React.ComponentProps<'div'>> =
	tw.div`flex justify-end items-center p-1.5 gap-x-2 max-w-full *:basis-full h-[var(--list-footer-height)]`

export default EpcListBox
