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

const Container = tw.div`flex flex-1 divide-y divide-border flex-col items-stretch xl:h-[75dvh] lg:h-[75dvh] h-96 rounded-[var(--radius)] border md:order-2 overflow-y-auto scrollba`

export default EPCListBox
