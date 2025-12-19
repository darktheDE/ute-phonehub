'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
} | null) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ FIX: Memoize params để tránh infinite loop
  const stableParams = useMemo(() => params, [
    params?.page,
    params?.size,
    params?.role,
    params?.status,
    params?.search,
  ]);

  const fetchUsers = useCallback(async () => {
    // Skip API call if params is null (disabled)
    if (stableParams === null) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await adminAPI.getAllUsers(stableParams);
      
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
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [stableParams]); // ✅ FIX: Dependency là stableParams thay vì params

  useEffect(() => {
    // Only fetch if params is not null (enabled)
    if (stableParams !== null) {
      fetchUsers();
    }
  }, [stableParams, fetchUsers]); // ✅ FIX: Dependency là stableParams và fetchUsers

  return { users, loading, error, refetch: fetchUsers };
}
