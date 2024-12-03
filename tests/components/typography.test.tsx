import { Typography } from '@/components/ui/@custom/typography'
import { render } from '@testing-library/react'

describe('Typography Component', () => {
	it('renders correctly with default props', () => {
		const { container } = render(<Typography>Default Text</Typography>)
		expect(container.firstChild).toMatchSnapshot()
	})

	it('renders correctly with primary color', () => {
		const { container } = render(<Typography color='primary'>Primary Text</Typography>)
		expect(container.firstChild).toMatchSnapshot()
	})

	it('renders correctly with custom element', () => {
		const { container } = render(<Typography as='span'>Span Text</Typography>)
		expect(container.firstChild).toMatchSnapshot()
	})

	it('renders correctly with combined variant and color', () => {
		const { container } = render(
			<Typography variant='h2' color='accent'>
				Accent Heading 2
			</Typography>
		)
		expect(container.firstChild).toMatchSnapshot()
	})

	it('renders correctly with success color', () => {
		const { container } = render(<Typography color='success'>Success Text</Typography>)
		expect(container.firstChild).toMatchSnapshot()
	})

	it('renders correctly with destructive color', () => {
		const { container } = render(<Typography color='destructive'>Destructive Text</Typography>)
		expect(container.firstChild).toMatchSnapshot()
	})

	it('renders correctly with h1 variant', () => {
		const { container } = render(<Typography variant='h1'>Heading 1</Typography>)
		expect(container.firstChild).toMatchSnapshot()
	})

	it('renders correctly with h2 variant', () => {
		const { container } = render(<Typography variant='h2'>Heading 2</Typography>)
		expect(container.firstChild).toMatchSnapshot()
	})

	it('renders correctly with h3 variant', () => {
		const { container } = render(<Typography variant='h3'>Heading 3</Typography>)
		expect(container.firstChild).toMatchSnapshot()
	})

	it('renders correctly with h4 variant', () => {
		const { container } = render(<Typography variant='h4'>Heading 4</Typography>)
		expect(container.firstChild).toMatchSnapshot()
	})
})
