export default function env<T = string>(key: keyof InternalImportMetaEnv, defaultValue?: unknown) {
	return (import.meta.env[key] ?? defaultValue) as T
}
