export const createFormData = (values: Record<string, any>): FormData => {
	const formData = new FormData()
	Object.entries(values).forEach(([key, value]) => {
		formData.append(key, value)
	})
	return formData
}
