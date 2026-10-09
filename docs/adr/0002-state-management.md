# 0002. React Query cho server state, Zustand cho client state

**Trạng thái:** Chấp nhận

**Bối cảnh:** Dữ liệu từ API cần cache, refetch, phân trang, optimistic update; trạng thái phía app (phiên đăng nhập, cài đặt) thì đơn giản và cần đọc đồng bộ.

**Quyết định:** TanStack Query cho mọi dữ liệu từ API (hooks trong `features/<name>/hooks.ts`). Zustand cho state phía client, persist bằng MMKV khi cần. Không copy dữ liệu API vào store.

**Hệ quả:** Một nguồn sự thật cho mỗi loại dữ liệu; không cần Redux và boilerplate. Người mới cần nắm query key và invalidation.
