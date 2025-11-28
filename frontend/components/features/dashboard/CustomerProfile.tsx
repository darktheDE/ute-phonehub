/**
 * CustomerProfile component - Profile view for customer users
 */

'use client';

import { Edit, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomerProfileProps {
  user: any;
}

export function CustomerProfile({ user }: CustomerProfileProps) {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Thông tin cá nhân</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold">
              {user.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{user.fullName}</p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Tên đăng nhập</label>
                <p className="text-foreground">{user.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Số điện thoại</label>
                <p className="text-foreground">{user.phoneNumber || 'Chưa cập nhật'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Vai trò</label>
                <p className="text-foreground">{user.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Trạng thái</label>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  {user.status === 'ACTIVE' ? 'Hoạt động' : user.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button>
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
