import SupportImage from '@/assets/images/svgs/balance-card-dark.svg'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Div, Typography } from '@/components/ui'
import tw from 'tailwind-styled-components'

const faqs = [
	{
		question: 'How can I get account to access to the application ?',
		answer:
			'Use your company email and password to log in. If you encounter any issues, please contact the IT department for assistance.'
	},
	{
		question: ' What should I do if I forget my password?',
		answer:
			'Click on the "Forgot Password" link on the login page. Enter your email address, and you will receive instructions on how to reset your password.'
	},
	{
		question: 'Can I access to the application out of office area ?',
		answer: "No, this is an internal application, you are only able to access application with company's network"
	},
	{
		question: 'Who do I contact for technical support?',
		answer:
			'If you encounter any technical issues, please contact the IT support team via the "Help" section. You can submit a ticket or use the live chat feature for immediate assistance.'
	},
	{
		question: 'How do I report a bug or suggest a feature?',
		answer:
			'Go to the "Feedback" section and select either "Report a Bug" or "Suggest a Feature." Fill out the form with detailed information and submit it.'
	}
]

const FAQsSection: React.FunctionComponent = () => {
	return (
		<Div className='relative z-0 mx-auto grid w-full max-w-7xl grid-cols-[1.5fr_1fr] items-start gap-10 px-6 sm:grid-cols-1 sm:px-4 md:grid-cols-1 '>
			<Div id='faqs' as='section' className='space-y-10 '>
				<Typography variant='h3'>Frequently asked questions</Typography>

				<Accordion type='multiple'>
					{faqs.map((faq, index) => (
						<AccordionItem key={index} value={index.toString()}>
							<AccordionTrigger className='py-6 text-base hover:no-underline'>{faq.question}</AccordionTrigger>
							<AccordionContent className='text-base'>{faq.answer}</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</Div>
			<Div className='flex w-full flex-grow items-center justify-center'>
				<Image src={SupportImage} alt='Support' />
			</Div>
		</Div>
	)
}

const Image = tw.img`max-w-md w-full object-cover object-center sm:hidden md:hidden`

export default FAQsSection
