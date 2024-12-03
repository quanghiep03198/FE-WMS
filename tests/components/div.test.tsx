import { Div } from '@/components/ui/@custom/div'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

describe('Div component', () => {
	it('renders correctly with default props', () => {
		const component = render(<Div>Test Content</Div>)
		expect(component.getByText('Test Content')).toBeInTheDocument()
	})
})
