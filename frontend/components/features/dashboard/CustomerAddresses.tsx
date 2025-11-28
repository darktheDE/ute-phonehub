/**
 * CustomerAddresses component - Address management for customers
 */

'use client';

import { Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CustomerAddresses() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Địa chỉ của bạn</h3>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm địa chỉ
        </Button>
      </div>

      <div className="grid gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-foreground">Nguyễn Văn A</span>
                <span className="px-2 py-0.5 rounded text-xs bg-primary text-primary-foreground">Mặc định</span>
              </div>
              <p className="text-muted-foreground text-sm">0912345678</p>
              <p className="text-muted-foreground text-sm mt-1">
                01 Võ Văn Ngân, Phường Linh Chiểu, Thành phố Thủ Đức, TP. Hồ Chí Minh
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-secondary rounded-lg text-blue-600">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-secondary rounded-lg text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
