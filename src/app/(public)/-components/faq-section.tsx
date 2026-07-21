import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Avatar,
	AvatarImage,
	Div,
	Icon,
	Separator,
	Typography
} from '@/components/ui'
import ChatBubble from '@/components/ui/@custom/chat-bubble'
import ScrollShadow from '@/components/ui/@custom/scroll-shadow'
import { Typewriter } from '@/components/ui/@custom/type-writter'
import generateAvatar from '@common/utils/generate-avatar'
import { useInViewport } from 'ahooks'
import { format } from 'date-fns'
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
			className='mx-auto flex w-full max-w-7xl grow flex-col-reverse items-center gap-14 px-3 py-10 duration-700 animate-in fade-in-0 slide-in-from-bottom-4 lg:flex-row-reverse xl:flex-row-reverse xl:gap-20 xl:px-0 xxl:max-w-8xl'
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
			<Div className='flex w-full max-w-xl grow basis-1/3 transform-gpu flex-col items-stretch rounded-lg border bg-background antialiased drop-shadow-[4px_4px_16px_var(--accent)] *:antialiased'>
				<Div className='flex items-center gap-x-2 border-b bg-accent/50 px-3 py-1'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						fill='var(--muted-foreground)'
						className='bi bi-wechat'
						viewBox='0 0 16 16'>
						<path d='M11.176 14.429c-2.665 0-4.826-1.8-4.826-4.018 0-2.22 2.159-4.02 4.824-4.02S16 8.191 16 10.411c0 1.21-.65 2.301-1.666 3.036a.32.32 0 0 0-.12.366l.218.81a.6.6 0 0 1 .029.117.166.166 0 0 1-.162.162.2.2 0 0 1-.092-.03l-1.057-.61a.5.5 0 0 0-.256-.074.5.5 0 0 0-.142.021 5.7 5.7 0 0 1-1.576.22M9.064 9.542a.647.647 0 1 0 .557-1 .645.645 0 0 0-.646.647.6.6 0 0 0 .09.353Zm3.232.001a.646.646 0 1 0 .546-1 .645.645 0 0 0-.644.644.63.63 0 0 0 .098.356' />
						<path d='M0 6.826c0 1.455.781 2.765 2.001 3.656a.385.385 0 0 1 .143.439l-.161.6-.1.373a.5.5 0 0 0-.032.14.19.19 0 0 0 .193.193q.06 0 .111-.029l1.268-.733a.6.6 0 0 1 .308-.088q.088 0 .171.025a6.8 6.8 0 0 0 1.625.26 4.5 4.5 0 0 1-.177-1.251c0-2.936 2.785-5.02 5.824-5.02l.15.002C10.587 3.429 8.392 2 5.796 2 2.596 2 0 4.16 0 6.826m4.632-1.555a.77.77 0 1 1-1.54 0 .77.77 0 0 1 1.54 0m3.875 0a.77.77 0 1 1-1.54 0 .77.77 0 0 1 1.54 0' />
					</svg>
					<Typography variant='small' className='py-2 text-center'>
						Thread in <strong className='font-medium'>#FAQs</strong>
					</Typography>
					<Icon name='Ellipsis' className='ml-auto stroke-muted-foreground' />
				</Div>
				<ScrollShadow
					ref={chatBoxRef}
					className='flex h-80 max-h-80 flex-1 flex-col gap-y-4 overflow-y-auto p-4 scrollbar-none *:select-none'>
					{faqs.map((faq, index) => (
						<Fragment key={index}>
							<Div
								data-viewport={chatInViewPort ? 'visible' : 'invisible'}
								className='inline-grid auto-cols-auto place-content-end items-end gap-x-2 text-sm duration-500 animate-in fade-in-0 slide-in-from-bottom-4 fill-mode-both data-[viewport=visible]:running data-[viewport=invisible]:paused'
								style={{ animationDelay: `${index / 2 + 0.35}s` }}>
								<Avatar className='col-start-2 row-start-1 duration-200 animate-in fade-in-0'>
									<AvatarImage src={generateAvatar({ name: 'you' })} />
								</Avatar>
								<ChatBubble variant='success' className='col-start-1 row-start-1'>
									{faq.question}
								</ChatBubble>
								<Typography
									variant='small'
									as='time'
									color='muted'
									className='col-start-1 row-start-2 inline-flex items-center justify-end gap-x-2 text-xs'>
									{format(new Date(), 'p')} <Icon name='CheckCheck' />
								</Typography>
							</Div>
							<Div
								className='inline-grid auto-cols-auto place-content-end items-end gap-x-1 place-self-start text-sm duration-500 animate-in fade-in-0 slide-in-from-bottom-4'
								style={{
									animationDelay: `${index / 2 + 0.65}s`,
									animationFillMode: 'both',
									animationPlayState: chatInViewPort ? 'running' : 'paused'
								}}>
								<Avatar className='col-start-1 row-start-1 duration-200 animate-in fade-in-0'>
									<AvatarImage src={generateAvatar({ name: 'admin' })} />
								</Avatar>
								<ChatBubble variant='secondary' className='col-start-2 row-start-1'>
									{faq.answer}
								</ChatBubble>
								<Typography variant='small' as='time' color='muted' className='col-start-2 row-start-2 text-xs'>
									{format(new Date(), 'p')}
								</Typography>
							</Div>
						</Fragment>
					))}
				</ScrollShadow>
				<Div className='h-40 select-none p-3'>
					<Div className='flex h-full w-full flex-1 flex-col items-stretch gap-x-3 rounded-md border bg-accent/20 p-3 text-sm backdrop-blur-sm delay-200 duration-700 animate-in fade-in-0 zoom-in-75 slide-in-from-bottom-4 [&_svg[data-slot=icon-button]:hover]:stroke-foreground [&_svg[data-slot=icon-button]]:stroke-muted-foreground [&_svg[data-slot=icon-button]]:duration-200'>
						<Typewriter
							playState={containerInViewPort ? 'running' : 'paused'}
							className='block h-full flex-1 basis-full text-foreground'
							text='I have some question, can you help me?'
						/>
						<Div className='mt-auto flex items-center gap-x-3'>
							<Div
								role='button'
								className='inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-secondary text-muted-foreground duration-200 hover:bg-secondary/80 hover:text-foreground'>
								<Icon name='Plus' size={20} />
							</Div>
							<Icon data-slot='icon-button' name='SmilePlus' size={18} />
							<Icon data-slot='icon-button' name='AtSign' size={18} />
							<Icon data-slot='icon-button' name='Paperclip' size={18} />
							<Separator orientation='vertical' className='h-4' />
							<Icon data-slot='icon-button' name='Camera' size={18} />
							<Icon data-slot='icon-button' name='Mic' size={18} />
							<Div
								role='button'
								className='ml-auto inline-flex h-8 items-center gap-x-2 rounded-md bg-success p-2 text-success-foreground duration-200 hover:bg-success/80'>
								<Icon name='Send' size={18} />
								<Separator orientation='vertical' className='h-4' />
								<Icon name='ChevronDown' size={18} />
							</Div>
						</Div>
					</Div>
				</Div>
			</Div>
		</Div>
	)
}

export default FAQsSection
