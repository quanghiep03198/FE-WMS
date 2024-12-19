export default function env<T = string>(key: keyof InternalImportMetaEnv, defaultValue?: any) {
	return (import.meta.env[key] ?? defaultValue) as T
}
