/**
 * Status configurations for orders
 */

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface StatusConfig {
  label: string;
  class: string;
}

export const ORDER_STATUS: Record<OrderStatus, StatusConfig> = {
  pending: {
    label: 'Chờ xác nhận',
    class: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  },
  processing: {
    label: 'Đang xử lý',
    class: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  shipped: {
    label: 'Đang giao',
    class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  delivered: {
    label: 'Đã giao',
    class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  cancelled: {
    label: 'Đã hủy',
    class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
} as const;

/**
 * Status configurations for users
 */

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

export const USER_STATUS: Record<UserStatus, StatusConfig> = {
  ACTIVE: {
    label: 'Hoạt động',
    class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  INACTIVE: {
    label: 'Không hoạt động',
    class: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  },
  BANNED: {
    label: 'Bị khóa',
    class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
} as const;

/**
 * Helper function to get order status configuration
 * Handles both uppercase (backend) and lowercase (mock) status formats
 */
export const getOrderStatus = (status: string | OrderStatus): StatusConfig => {
  // Normalize status to lowercase for lookup
  const normalizedStatus = status.toLowerCase() as OrderStatus;
  
  // Map backend statuses to frontend statuses
  const statusMap: Record<string, OrderStatus> = {
    'pending': 'pending',
    'confirmed': 'processing',
    'shipping': 'shipped',
    'delivered': 'delivered',
    'cancelled': 'cancelled',
  };
  
  const mappedStatus = statusMap[normalizedStatus] || normalizedStatus;
  
  // Fallback to pending if status not found
  return ORDER_STATUS[mappedStatus] || ORDER_STATUS.pending;
};

/**
 * Helper function to get user status configuration
 */
export const getUserStatus = (status: UserStatus): StatusConfig => {
  return USER_STATUS[status];
};
