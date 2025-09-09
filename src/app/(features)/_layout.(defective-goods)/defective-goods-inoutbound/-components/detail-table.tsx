import { NestedCell, NestedRow } from '@/app/(features)/-components/-shared/horizontal-nested-table'
import { Div, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Typography } from '@/components/ui'
import axiosInstance from '@/configs/axios.config'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useReaderPlaygroundStore } from '../../-contexts/rfid-reader-playground.context'

type DetailTableItem = {
	factory_shoes_style: string
	color_sn: string
	sizes: Array<{ size_code: string; qty: number }>
}

const DetailTable: React.FC = () => {
	const { t } = useTranslation()

	const { scannedEpcs } = useReaderPlaygroundStore('scannedEpcs')
	const [data, setData] = useState<DetailTableItem[]>([])

	useEffect(() => {
		axiosInstance
			.post<string[], ResponseBody<DetailTableItem[]>>('/defective-goods/retrieve-size-qty', scannedEpcs)
			.then((res) => setData(res.metadata))
	}, [scannedEpcs])

	return (
		<Div className='grid grid-rows-[auto_var(--row-height)] divide-y divide-border'>
			<Div className='h-[calc(var(--outlet-wrapper-height)-var(--header-height)-var(--row-height))] flex-1 basis-full overflow-scroll scrollbar-track-accent/50'>
				<Table
					className='table-fixed [&_th]:bg-table-head [&_th]:text-table-head-foreground'
					style={
						{
							'--col-width': '160px'
						} as React.CSSProperties
					}>
					<TableHeader className='h-[calc(var(--row-height)+1px)] border-b'>
						<TableRow>
							<TableHead align='left' className='sticky left-[var(--col-width)] w-[var(--col-width)]'>
								{t('ns_erp:fields.shoestyle_codefactory')}
							</TableHead>
							<TableHead align='left' className='sticky left-[calc(2*var(--col-width))] w-[var(--col-width)]'>
								{t('ns_erp:fields.color_sn')}
							</TableHead>
							<TableHead>Size</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{!Array.isArray(data) || data.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={4}
									align='center'
									className='h-[calc(var(--outlet-wrapper-height)-var(--header-height)-2*var(--row-height)-var(--scrollbar-thickness))]'>
									No data
								</TableCell>
							</TableRow>
						) : (
							data.map((item) => (
								<TableRow key={item.factory_shoes_style + item.color_sn}>
									<TableCell align='left'>{item.factory_shoes_style}</TableCell>
									<TableCell align='left'>{item.color_sn}</TableCell>
									<TableCell className='p-0'>
										<Div className='flex flex-grow border-collapse flex-nowrap divide-x'>
											{item.sizes.map((size) => (
												<NestedRow key={size.size_code}>
													<NestedCell>{size.size_code}</NestedCell>
													<NestedCell>{size.qty}</NestedCell>
												</NestedRow>
											))}
										</Div>
									</TableCell>
									<TableCell></TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</Div>
			<Div className='bg-table-header flex h-[var(--row-height)] basis-[var(--row-height)] items-center justify-between p-4 text-table-head-foreground'>
				<Typography variant='small'>The table above show the information of scanned EPC</Typography>
				<Typography className='font-medium text-foreground'>Total - 0 prs</Typography>
			</Div>
		</Div>
	)
}

export default DetailTable
