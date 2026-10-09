# Expo Base: đã có gì, cần gì

## Đã có

- Expo SDK 57, RN 0.86, React 19.2, pnpm, TypeScript strict
- Auth: đăng nhập, đăng ký, quên mật khẩu, refresh token, SecureStore, `Stack.Protected`
- API: axios + `ApiError`, React Query, mock API cho dev (`USE_MOCK_API`)
- Feature mẫu Notes: danh sách cuộn vô hạn, kéo tải lại, tạo/sửa/xoá
- UI: Button, Text, Input, FormInput, Select, Switch, Checkbox, Sheet, Skeleton, EmptyState, ErrorState
- Toast, dialog, loading, banner mất mạng
- Theme sáng/tối, i18n vi/en (nút EN | VI ở màn đăng nhập)
- Sentry, OTA (EAS Update), bắt buộc cập nhật/bảo trì, push notification
- 3 môi trường dev/staging/prod, `pnpm rename`, CI, 35 test

## Cần làm khi dùng thật

- [ ] `pnpm rename --name "Tên App" --bundle-id com.cty.app`
- [ ] `eas init` → điền `EAS_PROJECT_ID` (cần cho OTA và push)
- [ ] Điền `SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`; EAS secret `SENTRY_AUTH_TOKEN`
- [ ] Nối API thật, tắt `USE_MOCK_API`; backend cần `/app/config` và `/devices`
- [ ] Đổi icon, splash, màu
- [ ] Nâng Xcode 26.4+ và chạy thử native iOS/Android (chưa từng chạy native)

## Chưa có (làm tiếp)

- Sinh API client từ OpenAPI (orval), MSW
- E2E Maestro, Renovate, CONTRIBUTING và PR template
- Font riêng, DatePicker, OTP input

## Link

| Mục đích                     | Link                                               |
| ---------------------------- | -------------------------------------------------- |
| Repo                         | https://github.com/khanh181296/expo-base           |
| Sentry: tạo tài khoản        | https://sentry.io/signup/                          |
| Sentry cho Expo              | https://docs.expo.dev/guides/using-sentry/         |
| Sentry React Native          | https://docs.sentry.io/platforms/react-native/     |
| EAS env và secret            | https://docs.expo.dev/eas/environment-variables/   |
| EAS Update (OTA)             | https://docs.expo.dev/eas-update/introduction/     |
| Push notification            | https://docs.expo.dev/push-notifications/overview/ |
| Expo SDK và yêu cầu Xcode    | https://docs.expo.dev/versions/latest/             |
| Expo Router protected routes | https://docs.expo.dev/router/advanced/protected/   |
| NativeWind                   | https://www.nativewind.dev/                        |
