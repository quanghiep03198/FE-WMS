import { cn } from '@/common/utils/cn'
import { Div, Typography, buttonVariants } from '@/components/ui'
import { navigationConfig } from '@/configs/navigation.config'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

const Navbar: React.FC = () => {
	const { t } = useTranslation('ns_common')

	return (
		<Div
			as='nav'
			className='z-20 flex gap-x-1 gap-y-2 overflow-auto bg-background/90 py-6 scrollbar-none xl:absolute xl:top-40 xl:w-80 xl:flex-col'>
			{navigationConfig
				.filter((item) => item.type === 'preference')
				.map((item) => (
					<Link
						key={item.id}
						to={item.path}
						activeProps={{ className: 'text-primary hover:text-primary bg-primary/10' }}
						className={cn(
							'flex text-base font-normal xl:w-full',
							buttonVariants({ variant: 'ghost', className: 'justify-start gap-x-3' })
						)}>
						<Typography>{t(item.title, { defaultValue: item.title })}</Typography>
					</Link>
				))}
		</Div>
	)
}

export default Navbar
