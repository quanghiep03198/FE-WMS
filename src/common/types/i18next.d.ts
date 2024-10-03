import 'i18next'
import { Resources } from '../../i18n'

export declare module 'i18next' {
	interface CustomTypeOptions {
		defaultNs: ['ns_common']
		resources: Resources
	}
	// Helper type to extract keys from a namespace
}
