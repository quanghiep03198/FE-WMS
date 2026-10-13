export interface IProductSpecification {
	brand_name: string
	factory_shoes_style: string
	cust_shoes_style: string
	product_variants: Array<{
		color_sn: string
		sizes: Array<string>
	}>
}
