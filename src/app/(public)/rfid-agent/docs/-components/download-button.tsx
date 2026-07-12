import { buttonVariants } from '@/components/ui'
import { cn } from '@common/utils/cn'

export const DownloadButton: React.FC<React.ComponentProps<'a'>> = ({ children, ...props }) => {
	return (
		<a {...props} className={cn(buttonVariants({ className: 'relative' }))}>
			{children}
		</a>
	)
}
