import { PresetBreakPoints } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import {
	Div,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Typography
} from '@/components/ui'
import { TenancyService } from '@/services/tenancy.service'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../_contexts/-page-context'

const TenancySelect: React.FC = () => {
	const isSmallScreen = useMediaQuery(PresetBreakPoints.SMALL)
	const { user } = useAuth()
	const { t } = useTranslation()
	const { scanningStatus, connection, setConnection } = usePageContext(
		'scanningStatus',
		'connection',
		'reset',
		'setScanningStatus',
		'setConnection',
		'handleToggleScanning',
		'reset'
	)

	const { data: tenants } = useQuery({
		queryKey: ['TENANCY', user.company_code],
		queryFn: TenancyService.getTenantsByFactory,
		select: (response) => response.metadata,
		refetchOnMount: 'always'
	})

	return (
		<Select
			value={connection}
			disabled={typeof scanningStatus !== 'undefined'}
			onValueChange={(value) => setConnection(value)}>
			<HoverCard openDelay={50} closeDelay={50}>
				<HoverCardTrigger asChild className='w-full basis-1/5 sm:basis-full md:basis-1/3 lg:basis-1/3'>
					<SelectTrigger>
						<Div className='flex flex-1 items-center gap-x-3'>
							<Icon name='Server' size={18} stroke='hsl(var(--primary))' />
							<SelectValue placeholder={'Select database'} />
						</Div>
					</SelectTrigger>
				</HoverCardTrigger>
				<HoverCardContent side={isSmallScreen ? 'top' : 'right'} align='start' sideOffset={8}>
					<Typography variant='small'>{t('ns_inoutbound:description.select_database')}</Typography>
				</HoverCardContent>
			</HoverCard>
			<SelectContent>
				<SelectGroup>
					{Array.isArray(tenants) &&
						tenants.map((item) => (
							<SelectItem key={item.id} value={item.id}>
								{t('ns_common:others.server', { alias: item.alias, defaultValue: item.alias })}
							</SelectItem>
						))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}

export default TenancySelect
