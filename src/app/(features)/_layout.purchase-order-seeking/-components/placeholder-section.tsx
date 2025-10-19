import { Theme } from '@/common/constants/enums'
import useTheme from '@/common/hooks/use-theme'
import { Card, CardAction, CardDescription, CardHeader, CardTitle, Div, Icon } from '@/components/ui'
import tw from 'tailwind-styled-components'

const PlaceholderSection: React.FC = () => {
	const { theme } = useTheme()

	return (
		<Div as='section' className='mx-auto grid max-w-4xl grid-cols-5 grid-rows-3 gap-x-9 gap-y-3'>
			<Card className='col-span-2 col-start-1 row-span-1'>
				<CardHeader className='gap-x-4'>
					<CardAction className='col-start-1'>
						<Icon name='SearchCheck' size={32} strokeWidth={1.5} />
					</CardAction>
					<CardTitle className='col-start-2'>Quick Search</CardTitle>
					<CardDescription className='col-start-2'>
						Instantly find your purchase order by entering the PO number.
					</CardDescription>
				</CardHeader>
			</Card>
			<Card className='col-span-2 col-start-1 row-span-1'>
				<CardHeader className='gap-x-4'>
					<CardAction className='col-start-1'>
						<Icon name='ReceiptText' size={32} strokeWidth={1.5} />
					</CardAction>
					<CardTitle className='col-start-2'>Order Summary</CardTitle>
					<CardDescription className='col-start-2'>
						Get a complete overview of your order including items, quantities, supplier, and delivery timeline —
						all in one place.
					</CardDescription>
				</CardHeader>
			</Card>
			<Card className='col-span-2 col-start-1 row-span-1'>
				<CardHeader className='gap-x-4'>
					<CardAction className='col-start-1'>
						<Icon name='Ship' size={32} strokeWidth={1.5} />
					</CardAction>
					<CardTitle className='col-start-2'>Shipping Detail</CardTitle>
					<CardDescription className='col-start-2'>
						Track shipping status and logistics information for your purchase orders with ease.
					</CardDescription>
				</CardHeader>
			</Card>
			<Figure>
				<Image src={theme === Theme.DARK ? '/shipping-dark.svg' : '/shipping-light.svg'} alt='Shipping' />
			</Figure>
		</Div>
	)
}

const Figure = tw.figure`col-span-3 col-start-3 row-span-3 row-start-1`
const Image = tw.img`mx-auto w-full max-w-xl`

export default PlaceholderSection
