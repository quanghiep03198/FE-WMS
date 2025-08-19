import { Button, Div, Icon } from '@/components/ui'
import { useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

const ActionsGroup: React.FC = () => {
	const { t } = useTranslation()
	const location = useLocation()

	return (
		<Div as='nav' className='flex items-center justify-between border-b p-2'>
			{location.hash && (
				<ul className='flex items-center gap-x-1'>
					<li>
						<Button variant='ghost' size='icon'>
							<Icon name='PencilLine' />
						</Button>
					</li>
					<li>
						<Button variant='ghost' size='icon'>
							<Icon name='Trash2' />
						</Button>
					</li>
				</ul>
			)}
			<ul className='ml-auto flex items-center gap-x-2'>
				<li>
					<Button size='sm' variant='secondary'>
						<Icon name='Sparkles' />
						Create template
					</Button>
				</li>
				<li>
					<Button size='sm'>
						<Icon name='CircleFadingPlus' />
						{t('ns_common:actions.add')}
					</Button>
				</li>
			</ul>
		</Div>
	)
}

export default ActionsGroup
