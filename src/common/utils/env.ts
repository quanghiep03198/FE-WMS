export default function env(key: keyof InternalImportMetaEnv, defaultValue?: any) {
	return import.meta.env[key] ?? defaultValue
}
