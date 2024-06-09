// #region Vietnamese dictionary
import vi_ns_auth from './vi/ns_auth.i18n'
import vi_ns_common from './vi/ns_common.i18n'
import vi_ns_company from './vi/ns_company.i18n'
import vi_ns_dashboard from './vi/ns_dashboard.i18n'
import vi_ns_warehouse from './vi/ns_warehouse.i18n'
// #endregion

// #region English dictionary
import en_ns_auth from './en/ns_auth.i18n'
import en_ns_common from './en/ns_common.i18n'
import en_ns_company from './en/ns_company.i18n'
import en_ns_dashboard from './en/ns_dashboard.i18n'
import en_ns_warehouse from './en/ns_warehouse.i18n'
// #endregion

// #region Chinese dictionary
import cn_ns_auth from './cn/ns_auth.i18n'
import cn_ns_common from './cn/ns_common.i18n'
import cn_ns_company from './cn/ns_company.i18n'
import cn_ns_dashboard from './cn/ns_dashboard.i18n'
import cn_ns_warehouse from './cn/ns_warehouse.i18n'
// #endregion

export const resources = {
	vi: {
		ns_auth: vi_ns_auth,
		ns_common: vi_ns_common,
		ns_company: vi_ns_company,
		ns_dashboard: vi_ns_dashboard,
		ns_warehouse: vi_ns_warehouse
	},
	en: {
		ns_auth: en_ns_auth,
		ns_common: en_ns_common,
		ns_company: en_ns_company,
		ns_dashboard: en_ns_dashboard,
		ns_warehouse: en_ns_warehouse
	},
	cn: {
		ns_auth: cn_ns_auth,
		ns_common: cn_ns_common,
		ns_company: cn_ns_company,
		ns_dashboard: cn_ns_dashboard,
		ns_warehouse: cn_ns_warehouse
	}
}

export type Resources = typeof resources.en
