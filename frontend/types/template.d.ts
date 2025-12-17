/**
 * PromotionTemplate related types
 */

export interface PromotionTemplateResponse {
  id: string;
  code: string;
  type: "DISCOUNT" | "FREESHIP" | "VOUCHER";
  createdAt: string;
}

export interface CreateTemplateRequest {
  code: string;
  type: "DISCOUNT" | "FREESHIP" | "VOUCHER";
}
