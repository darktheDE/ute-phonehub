'use client';

import Link from 'next/link';
import { Facebook, Mail, MapPin, Phone, Smartphone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-6 h-6" />
              <span className="text-lg font-bold">UTE Phone Hub</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Hệ thống bán lẻ điện thoại di động uy tín hàng đầu Việt Nam
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold mb-4">Về chúng tôi</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Giới thiệu công ty
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Tin tức
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  01 Đ. Võ Văn Ngân, Linh Chiểu, Thủ Đức, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>1800.1234 (Miễn phí)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@utephonehub.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} UTE Phone Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
