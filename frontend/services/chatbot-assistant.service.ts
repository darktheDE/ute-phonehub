import fetchAPI from '@/lib/api';
import {
  ChatbotAssistantUserRequest,
  ChatbotAssistantUserResponse,
} from '@/types/chatbot-assistant.d';

/**
 * Service gọi API chatbot tư vấn sản phẩm
 */
export const chatbotAssistantService = {
  /**
   * Gửi câu hỏi tư vấn sản phẩm
   */
  async chat(
    request: ChatbotAssistantUserRequest
  ): Promise<ChatbotAssistantUserResponse> {
    try {
      const response = await fetchAPI<ChatbotAssistantUserResponse>(
        '/chatbot-assistant/chat',
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi gọi chatbot API:', error);
      throw error;
    }
  },

  /**
   * Xóa cache (admin only)
   */
  async clearCache(): Promise<string> {
    try {
      const response = await fetchAPI<string>(
        '/chatbot-assistant/clear-cache',
        {
          method: 'POST',
        }
      );
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi xóa cache:', error);
      throw error;
    }
  },
};
