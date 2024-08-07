import tw from 'tailwind-styled-components'
import EPCDatalist from './-epc-data-list'
import EPCListHeading from './-epc-list-heading'
import OrderDetails from './-order-details'

const EPCListBox: React.FC = () => {
	return (
		<Container>
			<EPCListHeading />
			<EPCDatalist />
			<OrderDetails />
		</Container>
	)
}

const Container = tw.div`flex flex-1 h-full divide-y divide-border flex-col items-stretch rounded-[var(--radius)] border md:order-2 overflow-y-auto scrollba`

export default EPCListBox
