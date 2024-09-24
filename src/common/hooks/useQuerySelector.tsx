import { useEffect, useState } from 'react'

export default function useQuerySelector<T extends HTMLElement>(selector: string) {
	const [element, setElement] = useState<T | null>(null)

	useEffect(() => {
		setElement(document.querySelector<T | null>(selector))
	}, [selector]) // Hook sẽ chạy lại nếu selector thay đổi

	return element
}
