import { CommonActions } from '@/common/constants/enums'
import { Dialog, DialogContent, Div } from '@/components/ui'
import React, { useState } from 'react'
import { gunzipSync } from 'zlib'
import { usePageContext } from '../-contexts/page-context'

const DefectiveDetailDialog: React.FC = () => {
	const { event$ } = usePageContext()
	const [open, setOpen] = useState<boolean>(false)
	const [template, setTemplate] = useState<string>(null)

	event$.useSubscription((e) => {
		if (e.action === CommonActions.READ && !!e.payload) {
			setOpen(true)
			const extractedData = gunzipSync(Buffer.from(e.payload as string, 'base64')).toString()
			setTemplate(extractedData)
		}
	})

	return (
		<Dialog open={open} onOpenChange={setOpen} defaultOpen={false}>
			<DialogContent className='prose max-h-[85vh] max-w-3xl overflow-scroll *:text-foreground prose-p:text-sm prose-strong:text-[inherit] prose-li:p-0 [&_*:not(button)]:pointer-events-none [&_table]:table-fixed [&_table_*:has(img)]:border-0 [&_table_*:has(img)]:p-1'>
				<Div
					dangerouslySetInnerHTML={{
						__html: template
					}}
				/>
			</DialogContent>
		</Dialog>
	)
}

export default DefectiveDetailDialog
