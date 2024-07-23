import { useInViewport, useMemoizedFn } from 'ahooks'
import { MutableRefObject, createContext, useContext, useRef, useState } from 'react'
import CTASection from '../_components/-cta-section'
import FAQsSection from '../_components/-faq-section'
import FeaturesSection from '../_components/-features-section'
import SupportSection from '../_components/-support-section'

type TNavigationLink = {
	title: string
	href: 'cta' | 'company' | 'outstanding-features' | 'support' | 'faqs'
	Component: React.FC
}

type TPageContext = {
	activeMenu: string
	handleMenuClick: (index: number) => void
	menuRef: MutableRefObject<HTMLDivElement[]>
	parentScrollRef: MutableRefObject<HTMLDivElement>
	contentScrollRef: MutableRefObject<HTMLDivElement>
}

export const navigationConfig: TNavigationLink[] = [
	{
		title: 'Intro',
		href: 'cta',
		Component: CTASection
	},
	{
		title: 'Features',
		href: 'outstanding-features',
		Component: FeaturesSection
	},
	{
		title: 'Support',
		href: 'support',
		Component: SupportSection
	},
	{
		title: 'FAQs',
		href: 'faqs',
		Component: FAQsSection
	}
]

const PageContext = createContext<TPageContext>(null)

export const PageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const menuRef = useRef<HTMLDivElement[]>([])
	const contentScrollRef = useRef<HTMLDivElement>(null)
	const parentScrollRef = useRef<HTMLDivElement>(null)

	const [activeMenu, setActiveMenu] = useState(navigationConfig[0]?.href)

	const callback = useMemoizedFn((entry) => {
		if (entry.isIntersecting) {
			const active = entry.target.getAttribute('id') || ''
			setActiveMenu(active)
		}
	})

	const handleMenuClick = useMemoizedFn((index) => {
		const contentEl = contentScrollRef.current
		const top = menuRef.current[index]?.offsetTop
		contentEl?.scrollTo({
			top,
			behavior: 'smooth'
		})
	})

	useInViewport(menuRef.current, {
		callback,
		root: () => parentScrollRef.current,
		rootMargin: '-50% 0px -50% 0px'
	})

	return (
		<PageContext.Provider
			value={{
				handleMenuClick,
				activeMenu,
				menuRef,
				parentScrollRef,
				contentScrollRef
			}}>
			{children}
		</PageContext.Provider>
	)
}

export const usePageContext = () => useContext(PageContext)
