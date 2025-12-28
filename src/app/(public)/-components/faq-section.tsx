import generateAvatar from '@/common/utils/generate-avatar'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Avatar,
	AvatarImage,
	Div,
	Icon,
	Typography
} from '@/components/ui'
import ChatBubble from '@/components/ui/@custom/chat-bubble'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { Typewriter } from '@/components/ui/@custom/type-writter'
import { useInViewport } from 'ahooks'
import { Fragment, useLayoutEffect, useRef } from 'react'
import { usePageContext } from '../-contexts/page-context'

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
	const containerRef = useRef<HTMLDivElement>(null)
	const chatBoxRef = useRef<HTMLDivElement>(null)
	const pageContext = usePageContext()
	const [containerInViewPort] = useInViewport(containerRef, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 0.5
	})
	const [chatInViewPort] = useInViewport(chatBoxRef, {
		root: () => pageContext?.contentScrollRef?.current,
		threshold: 0.25
	})

	useLayoutEffect(() => {
		chatBoxRef.current.scrollTo({ top: 0 })
	}, [])

	return (
		<Div
			ref={containerRef}
			className='mx-auto flex w-full max-w-7xl flex-grow flex-col-reverse items-center gap-10 px-3 duration-700 animate-in fade-in-0 slide-in-from-bottom-4 lg:flex-row-reverse xl:flex-row-reverse xl:gap-20 xl:px-0 xxl:max-w-8xl'
			style={{
				animationFillMode: 'both',
				animationPlayState: containerInViewPort ? 'running' : 'paused'
			}}>
			<Div
				id='faqs'
				as='section'
				className='w-full space-y-10 sm:space-y-8 sm:text-center md:text-center lg:basis-2/3 xl:basis-2/3 xxl:basis-2/3'>
				<Typography variant='h1'>Frequently asked questions</Typography>
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
			<Div className='flex max-h-[32rem] w-full flex-grow basis-1/3 flex-col items-stretch overflow-hidden rounded-lg border bg-background'>
				<Div className='flex items-center gap-x-2 border-b bg-accent/50 p-2'>
					<Div className='size-3 rounded-full bg-destructive' />
					<Div className='size-3 rounded-full bg-warning' />
					<Div className='size-3 rounded-full bg-success' />
				</Div>
				<Typography className='py-2 text-center font-medium'>FAQs</Typography>
				<ScrollShadow ref={chatBoxRef} className='flex h-64 flex-1 flex-col gap-y-3 !overflow-hidden p-4'>
					{faqs.map((faq, index) => (
						<Fragment key={index}>
							<Div
								className='flex-rows inline-flex items-end gap-x-1 place-self-start text-sm duration-500 animate-in fade-in-0 slide-in-from-bottom-4'
								style={{
									animationDelay: `${index / 2 + 0.35}s`,
									animationFillMode: 'both',
									animationPlayState: chatInViewPort ? 'running' : 'paused'
								}}>
								<Avatar className='duration-200 animate-in fade-in-0'>
									<AvatarImage src={generateAvatar({ name: 'Q' })} />
								</Avatar>
								<ChatBubble variant='secondary'>{faq.question}</ChatBubble>
							</Div>
							<Div
								data-viewport={chatInViewPort ? 'visible' : 'invisible'}
								className='inline-flex flex-row-reverse place-content-end items-end gap-x-1 text-sm duration-500 animate-in fade-in-0 slide-in-from-bottom-4 fill-mode-both data-[viewport=visible]:running data-[viewport=invisible]:paused'
								style={{ animationDelay: `${index / 2 + 0.65}s` }}>
								<Avatar className='duration-200 animate-in fade-in-0'>
									<AvatarImage src={generateAvatar({ name: 'A' })} />
								</Avatar>
								<ChatBubble variant='success'>{faq.answer}</ChatBubble>
							</Div>
						</Fragment>
					))}
				</ScrollShadow>
				<Div className='flex min-h-12 items-center gap-x-3 overflow-hidden border-t px-4 py-2 text-sm sm:flex-col sm:items-stretch'>
					<Typewriter
						playState={containerInViewPort ? 'running' : 'paused'}
						className='max-h-10 flex-1 overflow-y-auto text-foreground !scrollbar-none'
						text={`I have some question, can you help me?`}
					/>
					<Div className='inline-flex items-center gap-x-3 bg-background sm:self-end'>
						<Icon name='SmilePlus' />
						<Icon name='Paperclip' />
						<Icon name='Send' />
					</Div>
				</Div>
			</Div>
		</Div>
	)
}

export default FAQsSection
