/**
 * PromotionFormModal - Create/Edit promotion form modal (Admin)
 */
"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  PromotionResponse,
  CreatePromotionRequest,
  PromotionTarget,
} from "@/types";
import { cn } from "@/lib/utils";

interface PromotionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePromotionRequest) => Promise<boolean>;
  promotion?: PromotionResponse | null; // For edit mode
}

export function PromotionFormModal({
  isOpen,
  onClose,
  onSubmit,
  promotion,
}: PromotionFormModalProps) {
  const isEditMode = !!promotion;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreatePromotionRequest>({
    title: "",
    description: "",
    effectiveDate: "",
    expirationDate: "",
    percentDiscount: 0,
    minValueToBeApplied: null,
    status: "ACTIVE",
    templateId: "",
    targets: [],
  });

  // Initialize form with promotion data in edit mode
  useEffect(() => {
    if (promotion) {
      setFormData({
        title: promotion.title,
        description: promotion.description,
        effectiveDate: promotion.effectiveDate.split("T")[0],
        expirationDate: promotion.expirationDate.split("T")[0],
        percentDiscount: promotion.percentDiscount,
        minValueToBeApplied: promotion.minValueToBeApplied,
        status: promotion.status === "EXPIRED" ? "INACTIVE" : promotion.status,
        templateId: promotion.templateId,
        targets: promotion.targets.map((t) => ({
          type: t.type,
          applicableObjectId: t.applicableObjectId,
        })),
      });
    } else {
      // Reset form for create mode
      setFormData({
        title: "",
        description: "",
        effectiveDate: "",
        expirationDate: "",
        percentDiscount: 0,
        minValueToBeApplied: null,
        status: "ACTIVE",
        templateId: "",
        targets: [],
      });
    }
  }, [promotion]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "percentDiscount"
          ? value === ""
            ? 0
            : Number(value)
          : name === "minValueToBeApplied"
          ? value === ""
            ? null
            : Number(value)
          : value,
    }));
  };

  const addTarget = () => {
    setFormData((prev) => ({
      ...prev,
      targets: [...prev.targets, { type: "CATEGORY", applicableObjectId: "" }],
    }));
  };

  const removeTarget = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      targets: prev.targets.filter((_, i) => i !== index),
    }));
  };

  const updateTarget = (
    index: number,
    field: "type" | "applicableObjectId",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      targets: prev.targets.map((target, i) =>
        i === index ? { ...target, [field]: value } : target
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError("Vui lòng nhập tiêu đề khuyến mãi");
      return;
    }
    if (!formData.templateId) {
      setError("Vui lòng chọn template");
      return;
    }
    if (formData.percentDiscount <= 0 || formData.percentDiscount > 100) {
      setError("Phần trăm giảm giá phải từ 1-100%");
      return;
    }
    if (!formData.effectiveDate || !formData.expirationDate) {
      setError("Vui lòng chọn ngày hiệu lực và hết hạn");
      return;
    }

    // Validate expiration date is in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expirationDate = new Date(formData.expirationDate);
    if (expirationDate < today) {
      setError("Ngày hết hạn phải là ngày trong tương lai");
      return;
    }

    // Validate effective date is before expiration date
    const effectiveDate = new Date(formData.effectiveDate);
    if (effectiveDate >= expirationDate) {
      setError("Ngày hiệu lực phải trước ngày hết hạn");
      return;
    }

    // Convert dates to LocalDateTime format (ISO 8601)
    // Convert applicableObjectId to number (backend expects Long)
    const payload = {
      ...formData,
      effectiveDate: `${formData.effectiveDate}T00:00:00`,
      expirationDate: `${formData.expirationDate}T23:59:59`,
      minValueToBeApplied: formData.minValueToBeApplied || null,
      targets: formData.targets.map((target) => ({
        type: target.type,
        applicableObjectId: Number(target.applicableObjectId),
      })),
    };

    setLoading(true);
    const success = await onSubmit(payload);
    setLoading(false);

    if (success) {
      onClose();
    } else {
      setError("Không thể lưu khuyến mãi. Vui lòng thử lại.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? "Chỉnh sửa khuyến mãi" : "Tạo khuyến mãi mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-700 rounded text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tiêu đề khuyến mãi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ví dụ: Giảm giá 20% cho tất cả sản phẩm"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Mô tả chi tiết về chương trình khuyến mãi"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Ngày hiệu lực <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Ngày hết hạn <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Discount & Min Value */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phần trăm giảm giá (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="percentDiscount"
                  value={formData.percentDiscount}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Giá trị đơn hàng tối thiểu (đ)
                </label>
                <input
                  type="number"
                  name="minValueToBeApplied"
                  value={formData.minValueToBeApplied || ""}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Không giới hạn"
                />
              </div>
            </div>

            {/* Template ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Template ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="templateId"
                value={formData.templateId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ví dụ: TPL001"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="ACTIVE">ACTIVE - Đang hoạt động</option>
                <option value="INACTIVE">INACTIVE - Chưa kích hoạt</option>
              </select>
            </div>

            {/* Targets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Đối tượng áp dụng
                </label>
                <Button
                  type="button"
                  onClick={addTarget}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Thêm đối tượng
                </Button>
              </div>

              {formData.targets.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Chưa có đối tượng áp dụng. Nhấn "Thêm đối tượng" để thêm.
                </p>
              ) : (
                <div className="space-y-2">
                  {formData.targets.map((target, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg"
                    >
                      <select
                        value={target.type}
                        onChange={(e) =>
                          updateTarget(index, "type", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="CATEGORY">CATEGORY - Danh mục</option>
                        <option value="BRAND">BRAND - Thương hiệu</option>
                        <option value="PRODUCT">PRODUCT - Sản phẩm</option>
                      </select>
                      <input
                        type="text"
                        value={target.applicableObjectId}
                        onChange={(e) =>
                          updateTarget(
                            index,
                            "applicableObjectId",
                            e.target.value
                          )
                        }
                        placeholder="ID của đối tượng"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeTarget(index)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" onClick={onClose} variant="outline">
            Hủy
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Đang lưu..." : isEditMode ? "Cập nhật" : "Tạo mới"}
          </Button>
        </div>
      </div>
    </div>
  );
}
