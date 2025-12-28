/**
 * Types cho Chatbot Tư Vấn Sản Phẩm
 */

/**
 * Request để gửi câu hỏi tới chatbot
 */
export interface ChatbotAssistantUserRequest {
  /**
   * Câu hỏi/yêu cầu từ khách hàng
   */
  message: string;

  /**
   * ID danh mục (tùy chọn)
   */
  categoryId?: number;

  /**
   * Giá min (tùy chọn)
   */
  minPrice?: number;

  /**
   * Giá max (tùy chọn)
   */
  maxPrice?: number;

  /**
   * Sắp xếp theo: RELEVANCE, PRICE_ASC, PRICE_DESC, NEWEST, BEST_SELLING
   */
  sortBy?: string;
}

/**
 * Sản phẩm được gợi ý
 */
export interface RecommendedProductDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  categoryName: string;
  matchScore?: number;
  reason?: string;
  productUrl?: string;
}

/**
 * Response từ chatbot
 */
export interface ChatbotAssistantUserResponse {
  /**
   * Phản hồi lời tư vấn từ AI
   */
  aiResponse: string;

  /**
   * Danh sách sản phẩm được gợi ý (max 5)
   */
  recommendedProducts: RecommendedProductDTO[];

  /**
   * Intent phát hiện: FEATURED, BEST_SELLING, NEW_ARRIVALS, SEARCH, CATEGORY, COMPARE
   */
  detectedIntent: string;

  /**
   * Điểm độ phù hợp (0-1)
   */
  relevanceScore: number;

  /**
   * Thời gian xử lý (ms)
   */
  processingTimeMs: number;
}

/**
 * Message trong chat history
 */
export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  response?: ChatbotAssistantUserResponse;
}
