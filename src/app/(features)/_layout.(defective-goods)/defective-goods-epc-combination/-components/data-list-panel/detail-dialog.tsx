import { CommonActions } from '@/common/constants/enums'
import { Dialog, DialogContent, Div } from '@/components/ui'
import { Buffer } from 'buffer'
import React, { useState } from 'react'
import { gunzipSync } from 'zlib'
import { usePageContext } from '../../../../../../features/defective-goods/contexts/page-context'

const DetailDialog: React.FC = () => {
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
			<DialogContent className='max-w-3xl overflow-hidden'>
				<Div className='prose mx-auto max-h-[60vh] w-full max-w-full overflow-y-auto p-2 *:text-foreground prose-p:text-sm prose-strong:text-[inherit] prose-li:p-0 [&_*:not(button)]:pointer-events-none [&_table]:table-fixed [&_table_*:has(img)]:border-0 [&_table_*:has(img)]:p-1'>
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
