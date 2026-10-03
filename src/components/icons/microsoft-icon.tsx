import React from 'react'

export const MicrosoftIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ width = 16, height = 16, ...props }) => {
	return (
		<svg
			height={height}
			viewBox='0 0 256 256'
			width={width}
			xmlns='http://www.w3.org/2000/svg'
			{...props}
			preserveAspectRatio='xMidYMid'>
			<path d='M121.666 121.666H0V0h121.666z' fill='#F1511B' />
			<path d='M256 121.666H134.335V0H256z' fill='#80CC28' />
			<path d='M121.663 256.002H0V134.336h121.663z' fill='#00ADEF' />
			<path d='M256 256.002H134.335V134.336H256z' fill='#FBBC09' />
		</svg>
	)
}

// export default MicrosoftIcon
