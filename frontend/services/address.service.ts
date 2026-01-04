import { Province, Ward, ApiVersion } from '@/types/address';
import fetchAPI from '@/lib/api';

const LOCATION_BASE_URL = '/locations';

/**
 * Lấy danh sách tất cả tỉnh/thành phố
 */
export const listProvinces = async (): Promise<Province[]> => {
  try {
    const response = await fetchAPI<Province[]>(`${LOCATION_BASE_URL}/provinces`);
    return response.data || [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tỉnh:', error);
    return [];
  }
};

/**
 * Lấy chi tiết tỉnh/thành phố theo mã
 */
export const getProvinceByCode = async (code: number): Promise<Province | null> => {
  try {
    const response = await fetchAPI<Province>(`${LOCATION_BASE_URL}/provinces/${code}`);
    return response.data || null;
  } catch (error) {
    console.error('Lỗi khi lấy tỉnh:', error);
    return null;
  }
};

/**
 * Lấy danh sách tất cả phường/xã
 */
export const listWards = async (): Promise<Ward[]> => {
  try {
    const response = await fetchAPI<Ward[]>(`${LOCATION_BASE_URL}/wards`);
    return response.data || [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách phường/xã:', error);
    return [];
  }
};

/**
 * Lấy chi tiết phường/xã theo mã
 */
export const getWardByCode = async (code: number): Promise<Ward | null> => {
  try {
    const response = await fetchAPI<Ward>(`${LOCATION_BASE_URL}/wards/${code}`);
    return response.data || null;
  } catch (error) {
    console.error('Lỗi khi lấy phường/xã:', error);
    return null;
  }
};

/**
 * Lấy danh sách toàn bộ cấp hành chính
 */
export const listAllDivisions = async (depth?: number): Promise<Province[]> => {
  try {
    const url = depth 
      ? `${LOCATION_BASE_URL}/divisions?depth=${depth}`
      : `${LOCATION_BASE_URL}/divisions`;
    const response = await fetchAPI<Province[]>(url);
    return response.data || [];
  } catch (error) {
    console.error('Lỗi khi lấy danh sách cấp hành chính:', error);
    return [];
  }
};

