export interface IProductSpecification {
	brand_name: string
	product_variants: Array<{
		factory_shoes_style: string
		cust_shoes_style: string
		specs: Array<{
			color_sn: string
			sizes: Array<{ size: string }>
		}>
	}>
}
