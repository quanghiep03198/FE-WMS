import { Div, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

const InoutBoundSizeRun: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='overflow-auto scrollbar'>
			<Table className='rounded-[var(--radius)] border scrollbar'>
				<TableCaption>Size run</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className='w-20'>{t('ns_erp:fields.sno_size')}</TableHead>
						<TableHead className='w-40'>{t('ns_erp:fields.sno_type')}</TableHead>
						<TableHead className='w-40'>{t('ns_erp:fields.sno_total')}</TableHead>
						<TableHead className='w-16'>38</TableHead>
						<TableHead className='w-16'>39</TableHead>
						<TableHead className='w-16'>40</TableHead>
						<TableHead className='w-16'>41</TableHead>
						<TableHead className='w-16'>42</TableHead>
						<TableHead className='w-16'>43</TableHead>
						<TableHead className='w-16'>44</TableHead>
						<TableHead className='w-16'>45</TableHead>
						<TableHead className='w-16'>46</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>M</TableCell>
						<TableCell>雙</TableCell>
						<TableCell>96</TableCell>
						<TableCell className='text-right'>0</TableCell>
						<TableCell className='text-right'>0</TableCell>
						<TableCell className='text-right'>0</TableCell>
						<TableCell className='text-right'>0</TableCell>
						<TableCell className='text-right'>0</TableCell>
						<TableCell className='text-right'>0</TableCell>
						<TableCell className='text-right'>0</TableCell>
						<TableCell className='text-right'>0</TableCell>
						<TableCell className='text-right'>0</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Div>
	)
}

export default InoutBoundSizeRun
