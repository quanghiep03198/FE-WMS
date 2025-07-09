import { CommonActions } from '@/common/constants/enums'
import { Button, Div, Icon } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../-contexts/page-context'
import { PageDescription, PageHeader, PageTitle } from '../../-components/-shared/page-header'

const WarehouseListHeading: React.FC = () => {
	const { dispatch } = usePageContext()
	const { t } = useTranslation()

	return (
		<Div className='flex justify-between'>
			<PageHeader>
				<PageTitle>{t('ns_warehouse:headings.warehouse_list_title')}</PageTitle>
				<PageDescription>{t('ns_warehouse:headings.warehouse_list_description')}</PageDescription>
			</PageHeader>
			<Button
				onClick={() =>
					dispatch({
						type: CommonActions.CREATE,
						payload: { dialogTitle: t('ns_warehouse:form.add_warehouse_title') }
					})
				}>
				<Icon name='CirclePlus' /> {t('ns_common:actions.add')}
			</Button>
		</Div>
	)
}

export default WarehouseListHeading
