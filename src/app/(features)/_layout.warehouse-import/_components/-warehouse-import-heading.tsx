import { Button, Div, Icon, Typography } from '@/components/ui'
import { useTranslation } from 'react-i18next'

type Props = {}

const ProductionImportHeading = (props: Props) => {
	const { t } = useTranslation()

	return (
		<Div className='flex justify-between'>
			<Div className='space-y-1'>
				<Typography variant='h6'>Production Import List</Typography>
				<Typography variant='small' color='muted'>
					Manage list of warehouse production import
				</Typography>
			</Div>
			<Button size='sm'>
				<Icon name='Plus' role='img' />
				{t('ns_common:actions.add')}
			</Button>
		</Div>
	)
}

export default ProductionImportHeading
