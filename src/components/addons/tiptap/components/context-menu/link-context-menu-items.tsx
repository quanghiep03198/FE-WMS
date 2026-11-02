import { ContextMenuItem, ContextMenuSeparator } from '@components/ui/context-menu'
import { Icon } from '@components/ui/icon'
import useCopyToClipboard from '@hooks/use-copy-to-clipboard'
import type { Editor } from '@tiptap/react'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { url } from 'zod'

const LinkContextMenuItems: React.FC<{ editor: Editor }> = ({ editor }) => {
	const [copyToClipboard, { isCoppied }] = useCopyToClipboard()
	const { t } = useTranslation()

	const link = useMemo(() => {
		return (window.getSelection()?.anchorNode?.parentNode as HTMLAnchorElement | null)?.getAttribute('href')
	}, [window.getSelection])
	const handleCopyLinkToClipboard = () => {
		if (link) {
			copyToClipboard(link)
			if (isCoppied) toast.info(t('ns_common.notification.coppied_to_clipboard'))
		}
	}

	return (
		<Fragment>
			<ContextMenuSeparator />
			<ContextMenuItem
				className='gap-x-2'
				onClick={() => {
					if (link && url().safeParse(link).success) window.open(link, '_blank')
				}}>
				<Icon name='SquareArrowUpRight' />
				Mở liên kết trong tab mới
			</ContextMenuItem>
			<ContextMenuItem className='gap-x-2' onClick={handleCopyLinkToClipboard}>
				<Icon name='Copy' />
				Sao chép URL liên kết
			</ContextMenuItem>
			<ContextMenuItem className='gap-x-2' onClick={() => editor.commands.unsetLink()}>
				<Icon name='Unlink' />
				Xóa liên kết
			</ContextMenuItem>
		</Fragment>
	)
}

export default LinkContextMenuItems
