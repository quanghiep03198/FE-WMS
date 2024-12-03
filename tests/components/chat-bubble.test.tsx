import ChatBubble from '@/components/ui/@custom/chat-bubble'
import '@testing-library/jest-dom/vitest'
import { render } from '@testing-library/react'

describe('Chat bubble component', () => {
	it('renders correctly with default props', () => {
		const component = render(<ChatBubble>This is message</ChatBubble>)
		expect(component.getByText('This is message')).toBeInTheDocument()
	})
})
