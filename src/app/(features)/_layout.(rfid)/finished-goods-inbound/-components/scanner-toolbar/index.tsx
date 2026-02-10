import { Div } from '@/components/ui'
import React from 'react'
import ScannerActions from './action-buttons'
import TenacyBox from './tenancy-box'

const ScannerToolbar: React.FC = () => {
	return (
		<Div className='flex h-[var(--toolbar-height)] items-start justify-between bg-background group-has-[#toggle-fullscreen[data-state=checked]]:relative group-has-[#toggle-fullscreen[data-state=checked]]:top-auto sm:flex-col sm:items-stretch sm:justify-stretch sm:gap-y-2 xl:bg-transparent'>
			<TenacyBox />
			<ScannerActions />
		</Div>
	)
}

export default ScannerToolbar
