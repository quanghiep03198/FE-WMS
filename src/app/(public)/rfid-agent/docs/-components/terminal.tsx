import { cn } from '@/common/utils/cn'
import type { IconProps } from '@/components/ui'
import { Icon, Tooltip, Typography } from '@/components/ui'
import useCopyToClipboard from '@/hooks/use-copy-to-clipboard'
import React from 'react'
import { useTranslation } from 'react-i18next'

type TerminalProps = {
	command: string
	tabTitle?: string
	tabIcon?: IconProps['name']
} & React.ComponentProps<'div'>

const Terminal: React.FC<TerminalProps> = ({
	command,
	tabIcon = 'Terminal',
	tabTitle = 'CMD',
	children,
	className,
	...props
}) => {
	const [copy, { isCoppied }] = useCopyToClipboard()
	const { t } = useTranslation()

	return (
		<div
			className={cn('divide-y divide-border rounded-md bg-accent/50 text-accent-foreground', className)}
			{...props}>
			<div className='flex items-center justify-between p-3'>
				<Typography variant='small' className='inline-flex items-center gap-x-2 font-medium'>
					<Icon name={tabIcon} /> {tabTitle}
				</Typography>
				<Tooltip message={t('ns_common:editor.copy')} triggerProps={{ asChild: true }}>
					<button onClick={() => copy(command.trim().replaceAll('\t', ''), { message: 'Copied' })}>
						<Icon name={isCoppied ? 'CopyCheck' : 'Copy'} />
					</button>
				</Tooltip>
			</div>
			<div className='p-3 font-jetbrains text-sm leading-relaxed'>{children}</div>
		</div>
	)
}

export default Terminal
