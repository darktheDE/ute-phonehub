/**
 * Tỉnh/Thành phố
 */
export interface Province {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  phone_code?: number;
}

/**
 * Phường/Xã
 */
export interface Ward {
  code: number;
  name: string;
  codename: string;
  division_type: string;
  district_code: number;
}

export interface AddressOpenAPIResponse<T> {
  code?: number;
  name?: string;
  codename?: string;
  division_type?: string;
  district_code?: number;
}

export interface ApiVersion {
  version: string;
  date: string;
}

/**
 * Dữ liệu form địa chỉ được chọn
 */
export interface AddressFormData {
  provinceCode: number;
  provinceName: string;
  wardCode: number;
  wardName: string;
  streetAddress?: string;
}
