// #region Vietnamese dictionary
import vi_ns_auth from './vi/ns_auth.i18n'
import vi_ns_common from './vi/ns_common.i18n'
import vi_ns_company from './vi/ns_company.i18n'
import vi_ns_dashboard from './vi/ns_dashboard.i18n'
import vi_ns_erp from './vi/ns_erp.i18n'
import vi_ns_import_order from './vi/ns_import_order.i18n'
import vi_ns_inoutbound from './vi/ns_inoutbound.i18n'
import vi_ns_preference from './vi/ns_preference.i18n'
import vi_ns_validation from './vi/ns_validation.i18n'
import vi_ns_warehouse from './vi/ns_warehouse.i18n'

// #endregion

// #region English dictionary
import en_ns_auth from './en/ns_auth.i18n'
import en_ns_common from './en/ns_common.i18n'
import en_ns_company from './en/ns_company.i18n'
import en_ns_dashboard from './en/ns_dashboard.i18n'
import en_ns_erp from './en/ns_erp.i18n'
import en_ns_inoutbound from './en/ns_inoutbound.i18n'
import en_ns_preference from './en/ns_preference.i18n'
import en_ns_validation from './en/ns_validation.i18n'
import en_ns_warehouse from './en/ns_warehouse.i18n'
// #endregion

// #region Chinese dictionary
import cn_ns_auth from './cn/ns_auth.i18n'
import cn_ns_common from './cn/ns_common.i18n'
import cn_ns_company from './cn/ns_company.i18n'
import cn_ns_dashboard from './cn/ns_dashboard.i18n'
import cn_ns_erp from './cn/ns_erp.i18n'
import cn_ns_inoutbound from './cn/ns_inoutbound.i18n'
import cn_ns_preference from './cn/ns_preference.i18n'
import cn_ns_validation from './cn/ns_validation.i18n'
import cn_ns_warehouse from './cn/ns_warehouse.i18n'
// #endregion

export const resources = {
	vi: {
		ns_auth: vi_ns_auth,
		ns_common: vi_ns_common,
		ns_company: vi_ns_company,
		ns_dashboard: vi_ns_dashboard,
		ns_warehouse: vi_ns_warehouse,
		ns_inoutbound: vi_ns_inoutbound,
		ns_preference: vi_ns_preference,
		ns_erp: vi_ns_erp,
		ns_validation: vi_ns_validation,
		ns_import_order: vi_ns_import_order
	},
	en: {
		ns_auth: en_ns_auth,
		ns_common: en_ns_common,
		ns_company: en_ns_company,
		ns_dashboard: en_ns_dashboard,
		ns_warehouse: en_ns_warehouse,
		ns_inoutbound: en_ns_inoutbound,
		ns_preference: en_ns_preference,
		ns_erp: en_ns_erp,
		ns_validation: en_ns_validation
	},
	cn: {
		ns_auth: cn_ns_auth,
		ns_common: cn_ns_common,
		ns_company: cn_ns_company,
		ns_dashboard: cn_ns_dashboard,
		ns_warehouse: cn_ns_warehouse,
		ns_inoutbound: cn_ns_inoutbound,
		ns_preference: cn_ns_preference,
		ns_erp: cn_ns_erp,
		ns_validation: cn_ns_validation
	}
}

export type Resources = typeof resources.en
