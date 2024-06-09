export default function env(key: keyof GlobalImportMetaEnv, defaultValue?: any) {
	return import.meta.env[key] ?? defaultValue
}
