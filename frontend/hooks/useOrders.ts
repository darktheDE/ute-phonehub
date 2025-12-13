'use client';

import { useState, useEffect } from 'react';
import { orderAPI } from '@/lib/api';
import type { Order, OrderResponse, RecentOrderResponse } from '@/types';

export function useOrders(isAdmin: boolean = false) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (isAdmin) {
          // Admin: Use real API - GET /api/v1/admin/dashboard/recent-orders exists
          const response = await orderAPI.getRecentOrders(20);
          if (response.success && response.data) {
            // Transform RecentOrderResponse to Order format
            const transformedOrders: Order[] = response.data.map((item) => ({
              id: item.orderId,
              orderCode: item.orderCode,
              customer: item.customerName,
              total: item.totalAmount,
              totalAmount: item.totalAmount,
              status: item.status,
              date: new Date(item.createdAt).toLocaleDateString('vi-VN'),
              createdAt: item.createdAt,
              updatedAt: item.createdAt,
              email: '',
              recipientName: item.customerName,
              phoneNumber: '',
              shippingAddress: '',
              paymentMethod: '',
              items: 1,
            }));
            setOrders(transformedOrders);
          }
        } else {
          // Customer: Endpoint GET /api/v1/orders (list) doesn't exist
          // Component will use mock data instead, so return empty here
          setOrders([]);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAdmin]);

  const refetch = () => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (isAdmin) {
          // Admin: Use real API
          const response = await orderAPI.getRecentOrders(20);
          if (response.success && response.data) {
            const transformedOrders: Order[] = response.data.map((item) => ({
              id: item.orderId,
              orderCode: item.orderCode,
              customer: item.customerName,
              total: item.totalAmount,
              totalAmount: item.totalAmount,
              status: item.status,
              date: new Date(item.createdAt).toLocaleDateString('vi-VN'),
              createdAt: item.createdAt,
              updatedAt: item.createdAt,
              email: '',
              recipientName: item.customerName,
              phoneNumber: '',
              shippingAddress: '',
              paymentMethod: '',
              items: 1,
            }));
            setOrders(transformedOrders);
          }
        } else {
          // Customer: Endpoint doesn't exist, return empty
          setOrders([]);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  };

  return { orders, loading, error, refetch };
}

