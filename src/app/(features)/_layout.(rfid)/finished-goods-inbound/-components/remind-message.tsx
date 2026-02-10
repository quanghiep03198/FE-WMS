import { Div, Icon } from '@/components/ui'
import { Typewriter } from '@/components/ui/@custom/type-writter'
import React from 'react'
import { useTranslation } from 'react-i18next'

const RemindMessage: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='inline-flex items-center self-center'>
			<Icon
				name='BotMessageSquare'
				size={24}
				className='mr-2 hidden duration-500 animate-in zoom-in-0 slide-in-from-bottom-2 xxl:block'
			/>
			&quot;
			<Typewriter
				className='text-sm italic'
				text={t('ns_inoutbound:description.inoutbound_form_note')}
				delay={200}
			/>
			&quot;
		</Div>
	)
}

export default RemindMessage
