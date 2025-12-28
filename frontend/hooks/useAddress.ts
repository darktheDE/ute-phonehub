import { useEffect, useState, useCallback } from 'react';
import { Province, Ward } from '@/types/address';
import {
  listProvinces,
  getProvinceByCode,
  listWards,
  getWardByCode,
} from '@/services/address.service';

interface UseAddressReturn {
  provinces: Province[];
  wards: Ward[];
  loadingProvinces: boolean;
  loadingWards: boolean;
  selectedProvince: Province | null;
  selectedWard: Ward | null;
  selectProvince: (code: number) => Promise<void>;
  selectWard: (code: number) => Promise<void>;
  fetchProvinceByCode: (code: number) => Promise<void>;
  fetchWardByCode: (provinceCode: number, wardCode: number) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook để quản lý lựa chọn địa chỉ Việt Nam
 * Tải danh sách tỉnh/xã khi component mount
 */
export const useAddress = (): UseAddressReturn => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  // Tải danh sách tỉnh khi component mount
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const data = await listProvinces();
        setProvinces(data);
      } finally {
        setLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, []);

  // Tải danh sách phường khi component mount
  useEffect(() => {
    const loadWards = async () => {
      setLoadingWards(true);
      try {
        const data = await listWards();
        setWards(data);
      } finally {
        setLoadingWards(false);
      }
    };
    loadWards();
  }, []);

  // Chọn tỉnh
  const selectProvince = useCallback(async (code: number) => {
    const province = await getProvinceByCode(code);
    setSelectedProvince(province);
  }, []);

  // Chọn phường/xã
  const selectWard = useCallback(async (code: number) => {
    const ward = await getWardByCode(code);
    setSelectedWard(ward);
  }, []);

  // Reset tất cả lựa chọn
  const reset = useCallback(() => {
    setSelectedProvince(null);
    setSelectedWard(null);
  }, []);

  // Fetch province by code (dùng cho default value)
  const fetchProvinceByCode = useCallback(async (code: number) => {
    try {
      const province = await getProvinceByCode(code);
      setSelectedProvince(province);
    } catch (error) {
      console.error('❌ Lỗi fetch province:', error);
    }
  }, []);

  // Fetch ward by code (dùng cho default value)
  const fetchWardByCode = useCallback(async (provinceCode: number, wardCode: number) => {
    try {
      // Đầu tiên load wards của province đó
      setLoadingWards(true);
      const data = await listWards();
      // Filter wards theo province code nếu API hỗ trợ
      const filteredWards = data; // API trả tất cả, có thể cần filter
      setWards(filteredWards);
      
      // Sau đó select ward
      const ward = await getWardByCode(wardCode);
      setSelectedWard(ward);
    } catch (error) {
      console.error('❌ Lỗi fetch ward:', error);
    } finally {
      setLoadingWards(false);
    }
  }, []);

  return {
    provinces,
    wards,
    loadingProvinces,
    loadingWards,
    selectedProvince,
    selectedWard,
    selectProvince,
    selectWard,
    fetchProvinceByCode,
    fetchWardByCode,
    reset,
  };
};
