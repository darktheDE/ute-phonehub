'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'BANNED';
  joinDate: string;
}

export function useUsers(params?: {
  page?: number;
  size?: number;
  role?: string;
  status?: string;
  search?: string;
}) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await adminAPI.getAllUsers(params);
        
        if (response.success && response.data) {
          // Transform backend user response to UserData format
          const userList = response.data.content || response.data || [];
          const transformedUsers: UserData[] = userList.map((user: any) => ({
            id: user.id,
            name: user.fullName || user.name,
            email: user.email,
            role: user.role || 'CUSTOMER',
            status: user.status || 'ACTIVE',
            joinDate: user.createdAt 
              ? new Date(user.createdAt).toLocaleDateString('vi-VN')
              : new Date().toLocaleDateString('vi-VN'),
          }));
          
          setUsers(transformedUsers);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [params?.page, params?.size, params?.role, params?.status, params?.search]);

  return { users, loading, error, refetch: () => fetchUsers() };
}

