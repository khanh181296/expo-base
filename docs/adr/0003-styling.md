# 0003. NativeWind 4 + Tailwind 3

**Trạng thái:** Chấp nhận

**Bối cảnh:** Cần style nhanh, nhất quán, có dark mode, chạy cả web để xem trước.

**Quyết định:** NativeWind 4 với Tailwind 3 (NativeWind 4 chưa hỗ trợ Tailwind 4). Màu là token ngữ nghĩa (`bg-background`, `text-muted-foreground`) khai báo bằng CSS variables trong `src/global.css`, bản sao JS trong `palette.ts` có test giữ đồng bộ. Dark mode dùng `darkMode: 'class'`.

**Hệ quả:** Đổi theme chỉ sửa token. Component bên thứ ba cần `cssInterop` (xem `lib/theme/interop.ts`). Khi NativeWind 5 ổn định cần ADR mới để nâng Tailwind 4.
