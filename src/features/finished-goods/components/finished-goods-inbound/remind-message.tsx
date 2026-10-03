import { Div, Icon } from '@components/ui'
import { Typewriter } from '@components/ui/@custom/type-writter'
import React from 'react'
import { useTranslation } from 'react-i18next'

const RemindMessage: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='inline-flex items-center self-center'>
			<Icon
				className='animate-in zoom-in-0 slide-in-from-bottom-2 xxl:block mr-2 hidden duration-500'
				name='BotMessageSquare'
				size={24}
			/>
			&quot;
			<Typewriter
				className='text-sm italic'
				delay={200}
				text={t('ns_inoutbound:description.inoutbound_form_note')}
			/>
			&quot;
		</Div>
	)
}

export default RemindMessage
