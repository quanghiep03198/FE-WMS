import React from 'react'

const MicrosoftIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ width = 16, height = 16, ...props }) => {
	return (
		<svg
			viewBox='0 0 256 256'
			xmlns='http://www.w3.org/2000/svg'
			width={width}
			height={height}
			{...props}
			preserveAspectRatio='xMidYMid'>
			<path fill='#F1511B' d='M121.666 121.666H0V0h121.666z' />
			<path fill='#80CC28' d='M256 121.666H134.335V0H256z' />
			<path fill='#00ADEF' d='M121.663 256.002H0V134.336h121.663z' />
			<path fill='#FBBC09' d='M256 256.002H134.335V134.336H256z' />
		</svg>
	)
}

export default MicrosoftIcon
