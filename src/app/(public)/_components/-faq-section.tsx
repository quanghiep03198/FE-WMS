import FAQsImage from '@/assets/images/svgs/faq-card.svg'
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
		<Div className='flex w-full flex-grow flex-col-reverse items-start gap-10 lg:flex-row xl:flex-row xl:gap-20'>
			<Div
				id='faqs'
				as='section'
				className='w-full basis-full space-y-16 sm:space-y-8 sm:text-center md:text-center lg:basis-2/3 xl:basis-2/3 xxl:basis-2/3'>
				<Typography variant='h3' className='sm:text-xl'>
					Frequently asked questions
				</Typography>
				<Accordion type='multiple'>
					{faqs.map((faq, index) => (
						<AccordionItem key={index} value={index.toString()}>
							<AccordionTrigger className='py-6 text-base hover:no-underline sm:text-sm'>
								{faq.question}
							</AccordionTrigger>
							<AccordionContent className='text-base sm:text-sm'>{faq.answer}</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</Div>
			<Div className='flex w-full flex-grow basis-1/3 items-center justify-center sm:basis-full md:basis-full'>
				<Image src={FAQsImage} alt='Support' width='320' height='320' />
			</Div>
		</Div>
	)
}

const Image = tw.img`max-w-md sm:max-w-[256px] md:max-w-xs lg:max-w-xs w-full object-cover object-center`

export default FAQsSection
