import {
	Div,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
	Typography
} from '@/components/ui'
import { useTranslation } from 'react-i18next'

const DetailTable: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Table className='h-full table-fixed [&_th]:h-[52px] [&_th]:bg-table-head [&_th]:text-table-head-foreground'>
			<TableHeader className=''>
				<TableRow>
					<TableHead className='w-[25%]'>{t('ns_erp:fields.shoestyle_codefactory')}</TableHead>
					<TableHead className='w-[25%]'>{t('ns_erp:fields.color_sn')}</TableHead>
					<TableHead className=''>Size</TableHead>
					<TableHead className='w-[10%]'>-</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell colSpan={4} align='center'>
						No data
					</TableCell>
				</TableRow>
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={4} className='h-[52px]'>
						<Div className='flex items-center justify-between'>
							<Typography className='font-normal' color='muted' variant='small'>
								The table above show the information of scanned EPC
							</Typography>
							<Typography>0 prs</Typography>
						</Div>
					</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	)
}

export default DetailTable
