import { useEffect } from 'react'

export default function useEffectOnce(callback: React.EffectCallback) {
	useEffect(callback, [])
}
