import UploadDataFileDialog from '@/app/(features)/-components/shared/upload-dialog'
import { useRef } from 'react'
import tw from 'tailwind-styled-components'
import OrderDetails from '../manufacturing-order-detail'
import EpcDataList from './data-list-body'
import OrderListSelect from './order-list-select'

const EpcListBox: React.FC = () => {
	const listBoxWrapperRef = useRef<HTMLDivElement>(null)

	return (
		<ListBoxWrapper>
			<ListBoxHeader>
				<OrderListSelect />
			</ListBoxHeader>
			<ListBoxBody>
				<EpcDataList listBoxFooterRef={listBoxWrapperRef} />
			</ListBoxBody>
			<ListBoxFooter ref={listBoxWrapperRef}>
				<OrderDetails />
				<UploadDataFileDialog station='WH101' maxFiles={200} />
			</ListBoxFooter>
		</ListBoxWrapper>
	)
}

const ListBoxWrapper: React.FC<React.ComponentProps<'div'>> = tw.div`
	[--list-header-height:44px]
	[--list-footer-height:52px]
	relative flex flex-1 divide-y divide-border justify-between h-full flex-col items-stretch max-h-full bg-background
	group-has-[#toggle-fullscreen[data-state=checked]]:relative group-has-[#toggle-fullscreen[data-state=checked]]:top-auto group-has-[#toggle-fullscreen[data-state=checked]]:!h-full
	rounded-[var(--radius)] border md:order-2 
	`

const ListBoxHeader = tw.div`relative flex h-[var(--list-header-height)] items-center justify-between md:h-fit`
const ListBoxBody: React.FC<React.ComponentProps<'div'>> =
	tw.div`flex flex-1 basis-full items-center justify-center has-[div[aria-expanded=false]]:basis-0 has-[div[aria-expanded=false]]:!border-transparent`
const ListBoxFooter: React.FC<React.ComponentProps<'div'>> =
	tw.div`relative flex justify-end items-center p-1.5 overflow-visible gap-x-2 max-w-full *:basis-full h-[--list-footer-height] 
	md:[&>button]:bg-transparent md:[&>button]:shadow-none md:[&>button:hover]:bg-accent md:auto-cols-fr md:grid-flow-col md:gap-0 md:grid md:[&>button]:rounded-none md:[&>button]:text-accent-foreground md:p-0 md:h-fit
	[&>button#epc-data-upload-dialog-trigger]:order-last
	`

export default EpcListBox
