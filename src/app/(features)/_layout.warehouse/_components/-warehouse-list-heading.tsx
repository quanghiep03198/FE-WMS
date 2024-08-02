import { CommonActions } from '@/common/constants/enums'
import { Button, Div, Icon, Typography } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../_contexts/-page-context'

const WarehouseListHeading: React.FC = () => {
	const { dispatch } = usePageContext()
	const { t } = useTranslation()

	return (
		<Div className='flex justify-between'>
			<Div className='space-y-1'>
				<Typography variant='h6' className='font-bold'>
					{t('ns_warehouse:headings.warehouse_list_title')}
				</Typography>
				<Typography variant='small' color='muted'>
					{t('ns_warehouse:headings.warehouse_list_description')}
				</Typography>
			</Div>

			<Button
				size='sm'
				onClick={() =>
					dispatch({
						type: CommonActions.CREATE,
						payload: { dialogTitle: t('ns_warehouse:form.add_warehouse_title') }
					})
				}>
				<Icon name='CirclePlus' role='img' /> {t('ns_common:actions.add')}
			</Button>
		</Div>
	)
}

export default WarehouseListHeading
