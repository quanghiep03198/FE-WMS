import { Div, Icon, Typography } from '@/components/ui'

const PageHeader: React.FC = () => {
	return (
		<Div className='relative place-content-end place-items-center space-y-2 py-2 text-center'>
			<Icon name='PackageSearch' size={48} strokeWidth={1} />

			<Typography variant='h3' className='z-10 bg-background font-medium'>
				Tra cứu tiến độ nhập/xuất
			</Typography>
			<Typography color='muted'>Kiểm tra thông tin chi tiết tiến độ nhập/xuất hàng theo đơn hàng</Typography>
		</Div>
	)
}

export default PageHeader
