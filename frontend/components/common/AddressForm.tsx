'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAddress } from '@/hooks/useAddress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, MapPin, X } from 'lucide-react';

interface AddressFormProps {
  onAddressChange?: (address: {
    provinceCode: number;
    provinceName: string;
    wardCode: number;
    wardName: string;
    streetAddress?: string;
  }) => void;
  showStreetAddress?: boolean;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  defaultValue?: {
    provinceCode?: number;
    wardCode?: number;
    streetAddress?: string;
  };
}

/**
 * Component form địa chỉ
 * Hiển thị dropdown chọn tỉnh/thành phố và phường/xã
 * Khi người dùng thay đổi lựa chọn, gọi callback onAddressChange
 */
export const AddressForm: React.FC<AddressFormProps> = ({
  onAddressChange,
  showStreetAddress = true,
  className,
  disabled = false,
  required = true,
  error,
  defaultValue,
}) => {
  const {
    provinces,
    wards,
    loadingProvinces,
    loadingWards,
    selectedProvince,
    selectedWard,
    selectProvince,
    selectWard,
    reset,
    fetchProvinceByCode,
    fetchWardByCode,
  } = useAddress();

  const [streetAddress, setStreetAddress] = useState(defaultValue?.streetAddress || '');
  const [isInitialized, setIsInitialized] = useState(false);

  // Khởi tạo giá trị mặc định
  useEffect(() => {
    const initializeDefaultValues = async () => {
      if (defaultValue && !isInitialized) {
        if (defaultValue.provinceCode) {
          await fetchProvinceByCode(defaultValue.provinceCode);
        }
        if (defaultValue.wardCode && defaultValue.provinceCode) {
          await fetchWardByCode(defaultValue.provinceCode, defaultValue.wardCode);
        }
        setIsInitialized(true);
      }
    };

    initializeDefaultValues();
  }, [defaultValue, isInitialized, fetchProvinceByCode, fetchWardByCode]);

  // Thông báo component cha khi địa chỉ thay đổi
  useEffect(() => {
    if (onAddressChange && selectedProvince && selectedWard) {
      onAddressChange({
        provinceCode: selectedProvince.code,
        provinceName: selectedProvince.name,
        wardCode: selectedWard.code,
        wardName: selectedWard.name,
        streetAddress: streetAddress.trim() || undefined,
      });
    }
  }, [selectedProvince, selectedWard, streetAddress, onAddressChange]);

  const handleProvinceChange = useCallback((code: string) => {
    selectProvince(Number(code));
    // Reset street address when province changes
    setStreetAddress('');
  }, [selectProvince]);

  const handleWardChange = useCallback((code: string) => {
    selectWard(Number(code));
  }, [selectWard]);

  const handleReset = useCallback(() => {
    reset();
    setStreetAddress('');
  }, [reset]);

  const handleStreetAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setStreetAddress(e.target.value);
  }, []);

  // Tính trạng thái validation
  const isValid = selectedProvince && selectedWard;
  const isProvinceSelected = !!selectedProvince;
  const isWardDisabled = disabled || !selectedProvince || loadingWards;

  // Hiển thị skeleton khi loading
  if (loadingProvinces && provinces.length === 0) {
    return (
      <div className={cn('space-y-4 w-full', className)}>
        <div className="space-y-2">
          <div className="h-5 w-32 animate-pulse rounded-md bg-slate-200" />
          <div className="h-10 w-full animate-pulse rounded-md bg-slate-200" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-32 animate-pulse rounded-md bg-slate-200" />
          <div className="h-10 w-full animate-pulse rounded-md bg-slate-200" />
        </div>
        {showStreetAddress && (
          <div className="space-y-2">
            <div className="h-5 w-32 animate-pulse rounded-md bg-slate-200" />
            <div className="h-10 w-full animate-pulse rounded-md bg-slate-200" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4 w-full', className)}>
      {/* Tỉnh/Thành phố */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="province-select" className="text-sm font-medium flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            Tỉnh/Thành phố
            {required && <span className="text-red-500">*</span>}
          </Label>
          {isProvinceSelected && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              Đã chọn
            </div>
          )}
        </div>
        <Select
          value={selectedProvince?.code.toString() || ''}
          onValueChange={handleProvinceChange}
          disabled={disabled || loadingProvinces}
        >
          <SelectTrigger
            id="province-select"
            className={cn(
              'w-full transition-all',
              disabled && 'opacity-50 cursor-not-allowed',
              error && 'border-red-500 focus:ring-red-500',
              isProvinceSelected && 'border-green-500'
            )}
          >
            <SelectValue
              placeholder={
                loadingProvinces
                  ? 'Đang tải dữ liệu...'
                  : 'Chọn tỉnh/thành phố'
              }
            />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {provinces.length === 0 ? (
              <div className="py-6 text-center text-gray-500">
                Không có dữ liệu
              </div>
            ) : (
              provinces.map((province) => (
                <SelectItem 
                  key={province.code} 
                  value={province.code.toString()}
                  className="hover:bg-gray-50"
                >
                  {province.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Phường/Xã */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="ward-select" className="text-sm font-medium">
            Phường/Xã
            {required && <span className="text-red-500">*</span>}
          </Label>
          {selectedWard && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              Đã chọn
            </div>
          )}
        </div>
        <Select
          value={selectedWard?.code.toString() || ''}
          onValueChange={handleWardChange}
          disabled={isWardDisabled}
        >
          <SelectTrigger
            id="ward-select"
            className={cn(
              'w-full transition-all',
              (!selectedProvince || disabled) && 'opacity-50 cursor-not-allowed',
              error && 'border-red-500 focus:ring-red-500',
              selectedWard && 'border-green-500'
            )}
          >
            <SelectValue
              placeholder={
                !selectedProvince
                  ? 'Vui lòng chọn tỉnh/thành phố trước'
                  : loadingWards
                    ? 'Đang tải dữ liệu...'
                    : wards.length === 0
                      ? 'Không có phường/xã'
                      : 'Chọn phường/xã'
              }
            />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {wards.length === 0 ? (
              <div className="py-6 text-center text-gray-500">
                {selectedProvince ? 'Không có dữ liệu phường/xã' : 'Chọn tỉnh/thành phố trước'}
              </div>
            ) : (
              wards.map((ward) => (
                <SelectItem 
                  key={ward.code} 
                  value={ward.code.toString()}
                  className="hover:bg-gray-50"
                >
                  {ward.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Số nhà, tên đường (tùy chọn) */}
      {showStreetAddress && (
        <div className="space-y-2">
          <Label htmlFor="street-address" className="text-sm font-medium">
            Số nhà, tên đường
            <span className="text-gray-500 text-xs ml-1">(Tùy chọn)</span>
          </Label>
          <Input
            id="street-address"
            placeholder="Ví dụ: 123 Đường ABC, Tòa nhà XYZ"
            value={streetAddress}
            onChange={handleStreetAddressChange}
            disabled={disabled}
            className={cn(
              'transition-all',
              disabled && 'opacity-50 cursor-not-allowed',
              streetAddress && 'border-blue-500'
            )}
          />
          {streetAddress && (
            <p className="text-xs text-gray-500">
              {streetAddress.length}/200 ký tự
            </p>
          )}
        </div>
      )}

      {/* Hiển thị lỗi */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Hiển thị địa chỉ đã chọn */}
      {selectedProvince && selectedWard && (
        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <p className="text-blue-900 font-medium text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Địa chỉ đã chọn
            </p>
            {isValid && (
              <div className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                <CheckCircle2 className="h-3 w-3" />
                Hợp lệ
              </div>
            )}
          </div>
          <div className="text-blue-800 text-sm bg-white p-2 rounded border border-blue-100">
            <p className="font-medium">
              {streetAddress && (
                <>
                  <span className="text-gray-900">{streetAddress}</span>
                  <span className="text-gray-500 mx-2">•</span>
                </>
              )}
              <span className="text-blue-700">{selectedWard.name}</span>
              <span className="text-gray-500 mx-2">•</span>
              <span className="text-blue-900 font-semibold">{selectedProvince.name}</span>
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <span className="font-medium">Mã tỉnh:</span>
                <code className="bg-gray-100 px-1.5 py-0.5 rounded">{selectedProvince.code}</code>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Mã phường:</span>
                <code className="bg-gray-100 px-1.5 py-0.5 rounded">{selectedWard.code}</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nút xóa lựa chọn */}
      {(selectedProvince || streetAddress) && (
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleReset}
            disabled={disabled}
            variant="outline"
            size="sm"
            className={cn(
              'flex-1 transition-all',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <X className="h-4 w-4 mr-2" />
            Xóa tất cả
          </Button>
          {streetAddress && (
            <Button
              type="button"
              onClick={() => setStreetAddress('')}
              disabled={disabled}
              variant="ghost"
              size="sm"
              className="transition-all"
            >
              Xóa địa chỉ đường
            </Button>
          )}
        </div>
      )}
    </div>
  );
};