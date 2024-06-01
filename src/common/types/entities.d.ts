export interface IUser {
	id: number;
	email: string;
	password: string;
	display_name: string;
	has_accessibility: boolean;
}

export interface ICompany {
	id: number;
	company_code: string;
	company_name: string;
}

export interface IDepartment {
	id: number;
	department_code: string;
	department_name: string;
}
