import { PageDescription, PageHeader, PageTitle } from '@/app/(features)/_components/_shared/-page-header'
import { CommonActions } from '@/common/constants/enums'
import { Button, Div, Icon } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../_contexts/-page-context'

const StorageListHeading: React.FC = () => {
	const { dispatch } = usePageContext()
	const { t } = useTranslation()

	return (
		<Div className='flex justify-between'>
			<PageHeader>
				<PageTitle> {t('ns_warehouse:headings.storage_list_title')}</PageTitle>
				<PageDescription>{t('ns_warehouse:headings.storage_list_description')}</PageDescription>
			</PageHeader>
			<Button
				onClick={() =>
					dispatch({
						type: CommonActions.CREATE,
						payload: { dialogTitle: t('ns_warehouse:form.add_warehouse_title') }
					})
				}>
				<Icon name='CirclePlus' role='presentation' /> {t('ns_common:actions.add')}
			</Button>
		</Div>
	)
}

export default StorageListHeading
