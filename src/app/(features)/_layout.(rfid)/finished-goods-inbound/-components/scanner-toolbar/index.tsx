import { Div } from '@/components/ui'
import React from 'react'
import ScannerActions from './action-buttons'
import TenacyBox from './tenancy-box'

const ScannerToolbar: React.FC = () => {
	return (
		<Div className='flex items-center justify-between sm:flex-col sm:items-stretch sm:justify-stretch sm:gap-y-2'>
			<TenacyBox />
			<ScannerActions />
		</Div>
	)
}

export default ScannerToolbar
