import { useLocation } from '@tanstack/react-router'
import React, { useEffect } from 'react'
import { flushSync } from 'react-dom'

/**
 * @tutorial
 * To apply navigation transition, wrap this component and add the first child "viewTranstionName" CSS property equals to "wrapper".
 * 
 * @example
      <ViewTransition>
         <div style={{viewTransitionName: 'wrapper'}}>
            // ... Your content
         </div>
      </ViewTransition>
 */

const ViewTransition: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { pathname } = useLocation()

	useEffect(() => {
		document.startViewTransition(() => flushSync(null))
	}, [pathname])

	return children
}

export default ViewTransition
