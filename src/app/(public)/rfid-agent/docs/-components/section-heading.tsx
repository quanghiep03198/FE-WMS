import { Typography, TypographyProps } from '@/components/ui'
import { useInViewport } from 'ahooks'
import React, { useEffect, useRef } from 'react'
import { DocumentHashNavigation } from '../-constants/document-hash-navigation'
import { usePageContext } from '../-contexts/page-context'

const SectionHeading: React.FC<TypographyProps & { id: DocumentHashNavigation }> = ({ children, id, ...props }) => {
	const ref = useRef<typeof Typography.prototype>(null)
	const { event$ } = usePageContext()

	const [inViewport] = useInViewport(ref, {
		root: () => document.querySelector('#content'),
		threshold: 1, // Ensure the entire element is in the viewport
		rootMargin: '-10% 0px -10% 0px'
	})

	useEffect(() => {
		if (inViewport) event$.emit(id)
	}, [inViewport])

	return (
		<Typography variant='h2' id={id} ref={ref} {...props}>
			{children}
		</Typography>
	)
}

export default SectionHeading
