import { Typography, TypographyProps } from '@/components/ui'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useInViewport } from 'ahooks'
import React, { useEffect, useRef } from 'react'

const SectionHeading: React.FC<TypographyProps> = ({ children, id, ...props }) => {
	const ref = useRef<typeof Typography.prototype>(null)
	const { hash } = useLocation()
	const navigate = useNavigate()
	const [inViewport] = useInViewport(ref, {
		root: () => document.querySelector('#content'),
		threshold: 1, // Ensure the entire element is in the viewport
		rootMargin: '-5% 0px 40% 0px'
	})

	useEffect(() => {
		if (inViewport && id !== hash) navigate({ hash: id })
	}, [inViewport])

	return (
		<Typography variant='h2' id={id} ref={ref} {...props}>
			{children}
		</Typography>
	)
}

export default SectionHeading
