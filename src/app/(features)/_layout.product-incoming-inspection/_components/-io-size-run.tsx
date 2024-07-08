import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

type Props = {}

const InoutBoundSizeRun = (props: Props) => {
	const { t } = useTranslation()

	return (
		<Table className='table-fixed rounded-[var(--radius)] border'>
			<TableCaption>Size run</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>{t('ns_inoutbound:fields.sno_size')}</TableHead>
					<TableHead>{t('ns_inoutbound:fields.sno_type')}</TableHead>
					<TableHead>{t('ns_inoutbound:fields.sno_total')}</TableHead>
					<TableHead>38</TableHead>
					<TableHead>39</TableHead>
					<TableHead>40</TableHead>
					<TableHead>41</TableHead>
					<TableHead>42</TableHead>
					<TableHead>43</TableHead>
					<TableHead>44</TableHead>
					<TableHead>45</TableHead>
					<TableHead>46</TableHead>
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
	)
}

export default InoutBoundSizeRun
