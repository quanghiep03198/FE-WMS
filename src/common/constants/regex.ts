const Regex = {
	PHONE: /^\d{10}$/,
	EMAIL: /(\w+)@(gmail\.com|fpt\.edu\.vn)$/,
	TIME: /^(?:[01]?\d|2[0-3]):[0-5]\d:[0-5]\d$/,
	PASSWORD: /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/,
	VIETNAM_FACTORY_CODE: /^(va|vb)/i,
	CAMBODIA_FACTORY_CODE: /^ca/i
} as const

export default Regex
