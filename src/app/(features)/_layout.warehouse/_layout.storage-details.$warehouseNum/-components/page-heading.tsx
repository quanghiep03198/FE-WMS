import { PageAction, PageDescription, PageHeader, PageTitle } from '@/app/(features)/-components/shared/page'
import { CommonActions } from '@/common/constants/enums'
import { Button, Icon } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../-contexts/page-context'

const PageHeading: React.FC = () => {
	const { dispatch } = usePageContext()
	const { t } = useTranslation()

	return (
		<PageHeader>
			<PageTitle> {t('ns_warehouse:headings.storage_list_title')}</PageTitle>
			<PageDescription>{t('ns_warehouse:headings.storage_list_description')}</PageDescription>
			<PageAction>
				<Button
					onClick={() =>
						dispatch({
							type: CommonActions.CREATE,
							payload: { dialogTitle: t('ns_warehouse:form.add_warehouse_title') }
						})
					}>
					<Icon name='CirclePlus' /> {t('ns_common:actions.add')}
				</Button>
			</PageAction>
		</PageHeader>
	)
}

export default PageHeading
