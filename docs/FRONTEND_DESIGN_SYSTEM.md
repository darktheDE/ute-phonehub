# FRONTEND DESIGN SYSTEM – UTE Phone Hub

Phong cách: Minimal & Clean (Apple-like), ưu tiên hiệu năng, accessibility, mobile-first. Hệ màu vàng hiện đại hóa (giữ nhận diện, tránh copy thegioididong), tránh pattern sinh bởi AI (generic gradients, lặp bố cục).

## 1. Design Philosophy
- User-centered, rõ ràng, tập trung sản phẩm.
- Performance-first: ưu tiên Server Components, tối ưu ảnh, hạn chế JS client.
- Accessibility: WCAG 2.1 AA, contrast đạt chuẩn, focus rõ ràng.
- Consistency: token hóa màu, spacing, typography; tái sử dụng component.
- Mobile-first, responsive trên mọi thiết bị.

## 2. Color System (Modernized Yellow)
- Primary: Yellow brand (base #ffd400) với biến thể nhạt/đậm (50–900); dùng semantic: primary, primary-hover, primary-foreground, primary-muted.
- Neutral: Thang xám cân bằng cho nền, border, text; tránh xám quá nhạt gây low-contrast.
- Accent phụ: blue/orange nhẹ cho trạng thái, link, info; dùng tiết chế.
- Semantic state: success (xanh lá), warning (amber), error (đỏ), info (xanh dịu); luôn kiểm tra contrast ≥ 4.5:1.
- Background layers: surface/base/elevated; border/input/ring đồng bộ.
- Dark mode: đảo foreground/background, giữ primary nhất quán, giảm độ chói bằng giảm saturation/brightness.
- Badge/Status: nhãn giảm giá, mới, hết hàng phải rõ ràng, dễ scan.

## 3. Typography
- Font: Geist Sans (chính), Geist Mono cho số/ký hiệu cần monospaced.
- Type scale: Heading H1–H6, Body, Caption, Label; body tối thiểu 16px; line-height 1.5–1.75.
- Weight: Regular, Medium, Semibold, Bold; dùng nhất quán theo cấp bậc.
- Responsive type: tăng nhẹ ở breakpoint lớn, không vỡ bố cục mobile.
- Vietnamese support: kiểm tra dấu, tránh font-weight quá mảnh với nền sáng/vàng.

## 4. Spacing & Layout
- Grid 4px/8px; margin/padding theo bậc (4, 8, 12, 16, 20, 24, 32).
- Container: mobile full-bleed có gutter; desktop max width ~1200–1280px.
- Breakpoints: sm, md, lg, xl, 2xl (theo Tailwind mặc định).
- White space ưu tiên đọc nhanh; tránh nhồi nhét banner/quảng cáo.
- Card/list layout: khoảng cách đều, nội dung canh lề, icon-text thẳng hàng.

## 5. Component Patterns
- Server Component mặc định; Client chỉ khi cần interactivity/state/hook.
- Shadcn/UI + CVA cho variants (button, input, badge, card); dùng `cn()` để merge class.
- Props rõ ràng, tránh `any`; tách logic sang hooks; component nhỏ, tái sử dụng.
- Composition > inheritance: slot/children, asChild khi cần.
- Loading/empty/error state là bắt buộc cho mọi component dữ liệu.

## 6. UI Components Library (hướng dẫn dùng, không kèm code)
- Button: variants (primary, secondary, outline, ghost, link, destructive); sizes (sm, md, lg, icon); trạng thái hover/focus/disabled/aria-invalid.
- Inputs/Form: text, password toggle, select, checkbox, radio, textarea; label + helper + error; focus ring rõ, hitbox ≥ 44px.
- Navigation: Header (search, cart, auth actions), Footer (links, support), Sidebar/Drawer (admin/mobile), Breadcrumb khi cần ngữ cảnh.
- Cards: ProductCard (ảnh, giá, rating, badge giảm giá), FeatureCard, StatsCard.
- Tables/Lists: sortable/scrollable, zebra nếu cần, sticky header cho dashboard.
- Feedback: Badge/Tag/Chip, Alert/Toast, EmptyState, Skeleton, Spinner.
- Overlay: Modal/Dialog/Drawer với trap focus, escape để đóng.

## 7. Transitions & Animations
- Nguyên tắc: nhẹ, ngắn (150–250ms), easing mềm (ease-out/standard), tránh lạm dụng.
- Hover/focus: nâng nhẹ shadow/scale ≤1.02; focus ring rõ ràng.
- Page/section: fade/slide tinh tế; ưu tiên CSS transform/opacity (GPU friendly).
- Loading: skeleton cho danh sách/thẻ; spinner chỉ khi chờ ngắn.

## 8. Error Handling & States
- Validation: hiển thị lỗi sát trường, ngắn gọn; icon hỗ trợ nhận biết.
- API errors: thông báo thân thiện, tránh lộ kỹ thuật; cho phép retry khi hợp lý.
- Empty states: giải thích ngắn + CTA hành động (ví dụ: “Thêm sản phẩm vào giỏ”).
- Loading states: skeleton cho nội dung lặp, spinner cho hành động ngắn.
- Error boundaries: fallback thân thiện, nút reload/back home.

## 9. Responsive & Mobile
- Mobile-first; kiểm tra touch target ≥ 44x44px.
- Header: search gọn, nút menu/giỏ hàng dễ chạm; tránh hover-only trên mobile.
- Bố cục: card grid 1–2 cột mobile, 3–4 cột desktop; bảng lớn cho dashboard cần scroll ngang hợp lý.
- Typography/spacing co giãn; tránh text tràn, tránh scrollbar ngang.
- Hình ảnh: dùng kích thước phù hợp breakpoint, lazy load, tối ưu định dạng.

## 10. Accessibility (A11y)
- Semantics: dùng heading levels đúng thứ tự, list cho danh sách, button/link đúng mục đích.
- Keyboard: tab order hợp lý, focus ring luôn hiển thị, trap focus trong modal/drawer.
- ARIA: label cho input, aria-invalid/error message, role thích hợp cho dialog/alert.
- Contrast: kiểm tra màu chữ/nền đạt chuẩn; trạng thái disabled vẫn đọc được.
- Alt text cho ảnh sản phẩm; skip-to-content link ở đầu trang.

## 11. Performance Guidelines
- Ưu tiên Server Components; Client Components chỉ khi cần tương tác.
- Code splitting: dynamic import cho phần admin nặng/ít dùng.
- Ảnh: sử dụng thành phần Image tối ưu, đặt kích thước rõ ràng, lazy load.
- Giảm JS: tránh animation nặng, tránh inline function không cần thiết, memo hóa khi hợp lý.
- Cache/API: tận dụng SSR/ISR khi có; debounce search; tránh gọi lặp.

## 12. Folder & Naming
- App Router: route groups `(main)`, `(auth)`, `(admin)`; page/layout rõ ràng.
- Components: `components/ui` (atomic), `components/common` (header/footer), `components/features/*` (business).
- Hooks: `hooks/` cho logic; Stores: `store/` với Zustand.
- Types: `types/*.d.ts`, export qua `types/index.ts`.
- Constants/routes/status: `lib/constants`.
- Utils: `lib/utils` (format, validate); không viết logic trong component.

## 13. Code Patterns & Best Practices
- Không dùng `any`; type đầy đủ cho props/hook return.
- Tách logic form/validation vào hook hoặc helper; component giữ lean.
- Loading/empty/error luôn được xử lý cho mọi fetch/list.
- Sử dụng `cn()` để hợp nhất class; tránh class trùng lặp, giữ thứ tự hợp lý.
- Forms: kiểm soát state, thông báo lỗi gần trường, submit có trạng thái chờ.

## 14. Anti-Patterns (Tránh AI-look & lỗi UX)
- Tránh gradient lòe loẹt, màu random, hoặc palette y hệt thegioididong cũ.
- Tránh bố cục lặp lại y chang mẫu AI; đa dạng khoảng trắng và nhịp điệu layout.
- Tránh over-animation, shadow quá mạnh, radius cực đoan.
- Tránh placeholder lorem/emoji lạm dụng; nội dung phải có ý nghĩa.
- Tránh text quá nhỏ, contrast thấp, icon không nhãn.
- Tránh hardcode giá trị lặp; dùng token và constants.

## 15. Design Tokens
- Màu: định nghĩa biến CSS cho primary/neutral/semantic, cả light/dark.
- Radius: sm/md/lg/xl gắn với token radius; đồng bộ button, card, input.
- Spacing: scale 4/8; sử dụng consistent cho padding/margin/gap.
- Shadow: mức nhẹ/medium/elevated; dùng nhất quán cho card/overlay.
- Transition: thời lượng và easing chuẩn cho hover/focus/enter/exit.

## 16. Quality & Testing (không kèm mã)
- Accessibility check: focus, aria-label, contrast.
- Responsive check: mobile/tablet/desktop cho page chính, header, product grid, forms.
- Performance: kiểm tra bundle, tránh console error/warn, tránh layout shift.
- UX sanity: validation, empty/load/error states, hành trình checkout/auth.

## 17. Integration Notes
- Bám sát `CONVENTIONS.md`, `STRUCTURE.md`, `TECHSTACK.md`, `CLAUDE.md`.
- Dùng palette mới thay thế màu thegioididong cũ trong `globals.css` khi refactor.
- Giữ Shadcn config, dùng CVA cho variants mới nếu cần thêm component.

## 18. Guardrails cho Team
- Luôn có: state loading, empty, error cho mọi fetch.
- Không merge nếu còn placeholder không ý nghĩa hoặc thiếu contrast.
- Ưu tiên Server Components; kiểm tra “use client” có thực sự cần.
- Mọi component mới: xác định variant, spacing, type, trạng thái focus/disabled.

Tài liệu này là chuẩn chung cho toàn bộ FE. Cập nhật khi có thay đổi brand, thành phần hoặc yêu cầu mới. Không cần chèn code example; mô tả bằng lời đủ để agent áp dụng.

