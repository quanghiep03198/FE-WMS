import { generateAvatar } from '@/common/utils/generate-avatar'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Avatar,
	AvatarImage,
	Div,
	Typography
} from '@/components/ui'
import ChatBubble from '@/components/ui/@custom/chat-bubble'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { useInViewport } from 'ahooks'
import { Fragment, useRef } from 'react'
import { usePageContext } from '../_contexts/-page-context'

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
	const ref = useRef<HTMLDivElement>(null)
	const pageContext = usePageContext()
	const [inViewport] = useInViewport(ref, {
		root: () => pageContext?.contentScrollRef?.current
	})

	return (
		<Div className='flex w-full flex-grow flex-col-reverse items-start gap-10 lg:flex-row-reverse xl:flex-row-reverse xl:gap-20'>
			<Div
				id='faqs'
				as='section'
				className='w-full space-y-10 sm:space-y-8 sm:text-center md:text-center lg:basis-2/3 xl:basis-2/3 xxl:basis-2/3'>
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
			<Div className='flex max-h-[28rem] w-full flex-grow basis-1/3 flex-col items-stretch overflow-hidden rounded-lg border'>
				<Div className='flex items-center gap-x-2 border-b bg-accent/50 p-2'>
					<Div className='size-3 rounded-full bg-muted-foreground' />
					<Div className='size-3 rounded-full bg-muted-foreground' />
					<Div className='size-3 rounded-full bg-muted-foreground' />
				</Div>
				<Typography className='py-2 text-center font-medium'>FAQs</Typography>
				<ScrollShadow size={200} ref={ref} className='flex flex-1 flex-col gap-y-3 p-4'>
					{faqs.map((faq, index) => (
						<Fragment key={index}>
							<Div
								className='flex-rows inline-flex animate-fly-in items-end gap-x-1 place-self-start text-sm opacity-0'
								style={{
									animationDelay: `${index / 2 + 0.35}s`,
									animationFillMode: 'both',
									animationPlayState: inViewport ? 'running' : 'paused'
								}}>
								<Avatar>
									<Avatar>
										<AvatarImage src={generateAvatar({ name: 'Q' })} />
									</Avatar>
								</Avatar>
								<ChatBubble variant='secondary' side='right'>
									{faq.question}
								</ChatBubble>
							</Div>
							<Div
								className='inline-flex animate-fly-in flex-row-reverse place-content-end items-end gap-x-1 text-sm opacity-0'
								style={{
									animationDelay: `${index / 2 + 0.65}s`,
									animationFillMode: 'both',
									animationPlayState: inViewport ? 'running' : 'paused'
								}}>
								<Avatar className='animate-fade-in'>
									<AvatarImage src={generateAvatar({ name: 'A' })} />
								</Avatar>
								<ChatBubble variant='primary' side='left'>
									{faq.answer}
								</ChatBubble>
							</Div>
						</Fragment>
					))}
				</ScrollShadow>
			</Div>
		</Div>
	)
}

export default FAQsSection
