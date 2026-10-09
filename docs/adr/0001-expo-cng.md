# 0001. Expo với Continuous Native Generation

**Trạng thái:** Chấp nhận

**Bối cảnh:** Các app React Native CLI cũ commit `ios/` và `android/`, mỗi lần nâng React Native phải sửa tay Podfile và Gradle, nên bị tụt nhiều phiên bản.

**Quyết định:** Dùng Expo, không commit `ios/` và `android/`. Mọi tuỳ chỉnh native nằm trong `app.config.ts` và config plugin. Build bằng EAS hoặc `expo run`.

**Hệ quả:** Nâng SDK chủ yếu là `expo install --fix` + `prebuild`. Có sẵn EAS Build/Update. Thư viện native phải có config plugin hoặc tự viết plugin; không sửa tay thư mục native.
