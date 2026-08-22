import { UserRole } from '@common/constants/enums'
import RoleBaseAccessControl from '@components/guards/role-base-access-control'
import { buttonVariants, Div, Label, Typography } from '@components/ui'
import { StockFlow } from '@features/finished-goods/constants/enums'
import { useTranslation } from 'react-i18next'
import StockTransactionHistorySheet from '../../stock-transaction-history'

const StockTransactionHistory: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div as='section' className='flex w-full flex-col gap-y-3'>
			<Typography className='inline-flex items-center gap-x-2 text-lg font-semibold sm:text-base md:text-base'>
				{t('ns_inoutbound:titles.current_stock_transaction')}
			</Typography>
			<Div className='grid min-h-24 grid-cols-[3fr_1fr] items-center rounded-md border p-4'>
				<Div className='leading-none text-pretty'>
					<Typography variant='small' as='h5' className='mb-1 font-medium'>
						{t('ns_inoutbound:titles.inoutbound_history_lookup')}
					</Typography>
					<Typography variant='small' color='muted'>
						{t('ns_inoutbound:description.current_stock_transaction')}
					</Typography>
				</Div>
				<Div className='place-self-center justify-self-end'>
					<RoleBaseAccessControl authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FG_WAREHOUSE_STAFF]}>
						<Label
							role='button'
							className={buttonVariants({ variant: 'outline', size: 'sm' })}
							htmlFor='stock-transaction-sheet-trigger'>
							{t('ns_common:actions.open')}
						</Label>
						<StockTransactionHistorySheet stockFlow={StockFlow.INBOUND} />
					</RoleBaseAccessControl>
				</Div>
			</Div>
		</Div>
	)
}

export default StockTransactionHistory
