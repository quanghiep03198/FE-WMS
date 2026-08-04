import { cn } from '@common/utils/cn'
import {
	buttonVariants,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon,
	Tooltip
} from '@components/ui'
import useMediaQuery from '@hooks/use-media-query'
import { useTranslation } from 'react-i18next'
import { useDownloadReport } from '../../hooks/finished-goods-inbound/use-download-report'

const DownloadExcelDropdown: React.FC = () => {
	const { t } = useTranslation()
	const isLargeScreen = useMediaQuery('(min-width: 1024px)')
	const handleDownloadReport = useDownloadReport()

	return (
		<DropdownMenu>
			<Tooltip message={t('ns_common:actions.download_excel')} contentProps={{ hidden: isLargeScreen }}>
				<DropdownMenuTrigger
					className={cn(
						buttonVariants({
							size: isLargeScreen ? 'default' : 'icon',
							variant: isLargeScreen ? 'default' : 'outline'
						})
					)}>
					<Icon name='Download' />
					{isLargeScreen && t('ns_common:actions.download_excel')}
				</DropdownMenuTrigger>
			</Tooltip>
			<DropdownMenuContent align='end' className='min-w-60'>
				<DropdownMenuGroup>
					<DropdownMenuLabel className='inline-flex items-center gap-x-2'>
						<Icon name='FileChartColumn' size={18} /> {t('ns_erp:titles.report_type')}
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem className='gap-x-2' onClick={() => handleDownloadReport('daily-productivity')}>
						{t('ns_erp:fields.daily_productivity')}
					</DropdownMenuItem>
					<DropdownMenuItem className='gap-x-2' onClick={() => handleDownloadReport('assembly-productivity')}>
						{t('ns_erp:fields.shaping_dept_productivity')}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default DownloadExcelDropdown
