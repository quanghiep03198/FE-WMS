import { CommonActions } from '@common/constants/enums'
import { sanitizeDescription } from '@common/utils/sanitize-description'
import { Div } from '@components/customs/div'
import { Dialog, DialogContent } from '@components/ui/dialog'
import React, { useState } from 'react'
import { usePageContext } from '../../../contexts/page-context'

const DetailDialog: React.FC = () => {
	const { event$ } = usePageContext()
	const [open, setOpen] = useState<boolean>(false)
	const [template, setTemplate] = useState<string>('')

	event$.useSubscription((e) => {
		if (e.action === CommonActions.READ && !!e.payload) {
			setOpen(true)
			setTemplate(sanitizeDescription(e.payload as string))
		}
	})

	return (
		<Dialog defaultOpen={false} open={open} onOpenChange={setOpen}>
			<DialogContent className='tiptap max-w-3xl overflow-hidden'>
				<Div className=' prose *:text-foreground prose-p:text-sm prose-strong:text-inherit prose-li:p-0 mx-auto max-h-[60vh] w-full max-w-full overflow-y-auto p-2 [&_*:not(button)]:pointer-events-none [&_table]:table-fixed [&_table_*:has(img)]:border-0 [&_table_*:has(img)]:p-1'>
					<Div
						className='w-full'
						dangerouslySetInnerHTML={{
							__html: template
						}}
					/>
				</Div>
			</DialogContent>
		</Dialog>
	)
}

export default DetailDialog
