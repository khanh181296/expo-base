# Expo Base

Base React Native dùng Expo, tổ chức theo feature, sẵn sàng làm production.

|              |                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------- |
| Runtime      | Expo SDK 57 · React Native 0.86 (New Architecture) · React 19.2 · React Compiler                |
| Điều hướng   | Expo Router (typed routes, `Stack.Protected` cho auth)                                          |
| Style        | NativeWind 4 + Tailwind 3, token màu light/dark qua CSS variables                               |
| State        | Zustand 5 (client state) · TanStack Query 5 (server state)                                      |
| API          | Axios: interceptor gắn token, refresh token single-flight, lỗi chuẩn hoá `ApiError`             |
| Form         | react-hook-form + zod 4                                                                         |
| Storage      | `expo-secure-store` cho token · MMKV 4 cho cache và cài đặt                                     |
| i18n         | i18next, có type an toàn, tự nhận ngôn ngữ máy (en, vi)                                         |
| Theo dõi lỗi | Sentry (chỉ bật ở staging/production khi có DSN)                                                |
| Tooling      | pnpm 10 · TypeScript strict · ESLint 9 flat + Prettier · Jest + RNTL · husky + commitlint · EAS |

## Bắt đầu

Yêu cầu: Node 22, pnpm 10, **Xcode 26.4+** (iOS), Android Studio với SDK 36 (Android).

```bash
corepack enable pnpm
pnpm install
pnpm ios        # hoặc: pnpm android
```

Cần development build (không chạy trên Expo Go vì có native module như MMKV).
Khi đã cài app lên máy, chỉ cần `pnpm start`.

Xem nhanh giao diện không cần build native: `pnpm start` rồi bấm `w` để mở bản web.

**App mới từ base này:** `pnpm rename --name "Tên App" --bundle-id com.cty.app`, rồi làm theo
[Trước khi dùng cho dự án thật](#trước-khi-dùng-cho-dự-án-thật). Tổng quan nhanh: [docs/BASE-STATUS.md](docs/BASE-STATUS.md).

Xem nhanh giao diện không cần build native: `pnpm start` rồi bấm `w` để mở bản web.

Mặc định `.env.development` bật `USE_MOCK_API=true`, nên app chạy được ngay không cần backend.
Đăng nhập bằng email bất kỳ và mật khẩu từ 8 ký tự trở lên.
Access token mock hết hạn sau 60 giây, dùng để thử luồng refresh token.
Đăng ký bằng `taken@example.com` để thử lỗi email đã tồn tại.

## Màn hình và tính năng có sẵn

| Route / tính năng                                             | Mô tả                                                                                              |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `/sign-in`, `/sign-up`, `/forgot-password`                    | Auth, nút đổi ngôn ngữ EN \| VI (`AuthScreen`)                                                     |
| `/`                                                           | Home                                                                                               |
| `/notes`                                                      | **Feature mẫu**: cuộn vô hạn, kéo tải lại, tạo/sửa, xoá optimistic. Copy khuôn này cho feature mới |
| `/settings`                                                   | Sáng/tối, ngôn ngữ, bật thông báo, đăng xuất, version                                              |
| App gate                                                      | `GET /app/config` → bắt buộc cập nhật (`minVersion`) hoặc bảo trì                                  |
| OTA                                                           | Kiểm tra EAS Update khi mở app và khi quay lại app, hỏi khởi động lại                              |
| Push                                                          | Xin quyền, gửi token lên `POST /devices`, bấm thông báo có `data.url` thì mở route đó              |
| Analytics                                                     | `analytics.track({ name: ... })` có type; cắm provider bằng `setAnalyticsProvider`                 |
| Đăng ký bằng `taken@example.com` để thử lỗi email đã tồn tại. |

## Màn hình có sẵn

| Route                      | Mô tả                                                     |
| -------------------------- | --------------------------------------------------------- |
| `/sign-in`                 | Đăng nhập, link tới đăng ký và quên mật khẩu              |
| `/sign-up`                 | Đăng ký, kiểm tra mật khẩu nhập lại                       |
| `/forgot-password`         | Gửi link đặt lại mật khẩu, màn "Kiểm tra email"           |
| `/` (tab Home)             | Lời chào theo tên người dùng                              |
| `/settings` (tab Settings) | Giao diện sáng/tối/hệ thống, ngôn ngữ, đăng xuất, version |

Các màn chưa đăng nhập có nút đổi ngôn ngữ **EN \| VI** ở góc trên (`AuthScreen`).
Chưa đăng nhập thì không vào được các tab; đã đăng nhập thì không quay lại màn auth (`Stack.Protected`).

## Môi trường

Chọn môi trường bằng `APP_ENV` (`development` | `staging` | `production`). `env.js` sẽ:

1. Đọc `.env.<APP_ENV>` và kiểm tra bằng zod. Biến sai thì build fail ngay.
2. Đưa phần biến client vào `extra.env`. App đọc qua `import { Env } from '@/lib/env'`.
3. Thêm hậu tố cho bundle ID, tên app và scheme (`.dev`, `.staging`), nên cài được cả 3 bản trên cùng một máy.

Thêm biến mới: khai báo trong schema ở `env.js`, rồi thêm vào các file `.env.*` và `.env.example`.
Không đưa secret vào biến client, vì chúng nằm trong bundle JS.

```bash
pnpm start:staging
pnpm build:staging      # eas build --profile staging
```

## Cấu trúc

```
src/
  app/                 Route của Expo Router, chỉ để ghép màn hình
    _layout.tsx        Khởi tạo, providers, auth guard
    (app)/             Các tab, chỉ vào được khi đã đăng nhập
    sign-in.tsx, sign-up.tsx, forgot-password.tsx
  features/<name>/     Code theo nghiệp vụ: api, hooks, store, schemas, components
    index.ts           Public API: bên ngoài chỉ import từ đây
  components/
    ui/                Button, Text, Input, FormInput, Select, Switch, Checkbox, DatePicker,
                       OtpInput, Sheet, Skeleton, EmptyState, ErrorState, ...
    feedback/          toast, dialog.confirm, loading, banner mất mạng
  lib/                 Hạ tầng không phụ thuộc feature
    api/               client, errors, query-client, mock-adapter
    storage/           kv (MMKV), secureStorage, keys
    theme/             palette, dark mode, navigation theme
    i18n/
    monitoring.ts      Sentry: init, user, captureError
  providers/
  translations/        en.json, vi.json
```

### Quy ước

- **Phụ thuộc một chiều:** `app → features → components / lib`. `lib` không import `features`.
  Ví dụ auth gắn vào API client qua `setAuthHandlers`. ESLint chặn import sâu vào trong feature.
- **Server state dùng React Query, client state dùng Zustand.** Không copy dữ liệu từ API sang store.
- **Lỗi API luôn là `ApiError`** (`kind`, `status`, `serverMessage`).
  Hiển thị cho người dùng bằng `getErrorMessage(error, t)`.
- **Token chỉ nằm trong SecureStore.** MMKV không mã hoá, chỉ dùng cho dữ liệu không nhạy cảm.
- **Màu:** sửa đồng thời `src/global.css` và `src/lib/theme/palette.ts`. Test sẽ báo lỗi nếu 2 file lệch nhau.
- Import qua alias `@/…`. Lỗi validate trong schema zod là i18n key.
- **Web:** file `*.web.ts(x)` thay bản native khi chạy web (ví dụ `secure.web.ts`, `date-picker.web.tsx`).
- **Mock:** endpoint mới thì thêm vào `src/lib/api/mock-adapter.ts` cùng contract với API thật.
- **E2E:** phần tử cần test có `testID`; luồng Maestro nằm trong `.maestro/`.
- **Web:** file `*.web.ts` thay thế bản native khi chạy web (ví dụ `secure.web.ts`).

### Thêm feature mới

```
src/features/orders/
  api.ts          gọi `api` từ '@/lib/api'
  hooks.ts        useQuery / useMutation + query keys
  components/
  index.ts        export những gì bên ngoài được dùng
```

Sau đó thêm route trong `src/app/`.

### Gọi feedback toàn cục

```ts
import { dialog, loading, toast } from '@/components/feedback'

toast.success('Đã lưu')
if (await dialog.confirm({ title: 'Xoá?', destructive: true })) remove()
await loading.wrap(upload())
```

## Theo dõi lỗi (Sentry)

- Bật khi `SENTRY_DSN` có giá trị **và** không phải bản development (dev không bao giờ gửi lỗi).
- Tự ghi crash, lỗi màn hình (ErrorBoundary), hiệu năng điều hướng, gắn `environment` và `release` theo version.
- Chỉ gửi `user.id`, không gửi email (`sendDefaultPii: false`).
- Gửi lỗi tay: `captureError(error, { context })` từ `@/lib/monitoring`.
- Source map được upload khi build EAS nếu có `SENTRY_AUTH_TOKEN` (đặt bằng `eas env:create`, không ghi vào file `.env`).

## Firebase (tuỳ chọn)

Base cài sẵn `@react-native-firebase/app` và `analytics`, **chỉ bật khi có file cấu hình**; không có thì build như bình thường.

1. Tạo app iOS và Android trong [Firebase console](https://console.firebase.google.com/) với đúng bundle ID của từng môi trường (`.dev`, `.staging`).
2. Tải `google-services.json` và `GoogleService-Info.plist`, đặt vào `firebase/<env>/` (đã git-ignore).
3. Khai báo đường dẫn trong `.env.<env>`:
   ```
   GOOGLE_SERVICES_JSON=./firebase/staging/google-services.json
   GOOGLE_SERVICE_INFO_PLIST=./firebase/staging/GoogleService-Info.plist
   ```
   Trên EAS dùng **file environment variable** cùng tên (`eas env:create --type file`).
4. Có đủ 2 file thì `FIREBASE_ENABLED=true`, config plugin được bật, iOS dùng `useFrameworks: dynamic` (yêu cầu của RN Firebase), và `analytics.track` gửi sang Firebase Analytics (trừ bản development).

Android push qua FCM cũng cần `google-services.json`. Crashlytics không cài vì đã dùng Sentry.

## Scripts

| Lệnh                                                    | Mô tả                                                        |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| `pnpm check`                                            | typecheck, lint, format và test (giống CI)                   |
| `pnpm typecheck` / `lint` / `format` / `test`           | Chạy riêng từng bước                                         |
| `pnpm test:coverage`                                    | Test kèm ngưỡng coverage (CI dùng lệnh này)                  |
| `pnpm e2e`                                              | Maestro E2E (cần development build trên simulator)           |
| `pnpm rename`                                           | Đổi tên app, slug, scheme, bundle ID                         |
| `pnpm doctor`                                           | expo-doctor                                                  |
| `pnpm prebuild`                                         | Sinh lại `ios/` và `android/` (không commit hai thư mục này) |
| `pnpm build:dev` / `build:staging` / `build:production` | EAS Build                                                    |

Quy trình đóng góp: [CONTRIBUTING.md](CONTRIBUTING.md). Lý do các lựa chọn kỹ thuật: [docs/adr](docs/adr).
Renovate tự mở PR nâng thư viện mỗi thứ Hai (trừ package do Expo quản lý).

Commit theo Conventional Commits (`feat: …`, `fix: …`), được commitlint kiểm tra.

## Trước khi dùng cho dự án thật

- [ ] `pnpm rename --name "Tên App" --bundle-id com.cty.app`
- [ ] Chạy `eas init` và điền `EAS_PROJECT_ID`, `EXPO_ACCOUNT_OWNER` (bắt buộc cho OTA và push)
- [ ] Backend cung cấp `GET /app/config` và `POST/DELETE /devices` (hoặc bỏ app gate, push)
- [ ] Đổi `appId` trong `.maestro/*.yaml`; bật Renovate cho repo
- [ ] Đổi icon và splash trong `assets/`
- [ ] Sửa `features/auth/api.ts` cho khớp API thật, rồi tắt `USE_MOCK_API`
- [ ] Đổi token màu trong `global.css` và `palette.ts`
- [ ] (Tuỳ chọn) Thêm file Firebase cho từng môi trường, xem mục Firebase
- [ ] Điền `SENTRY_DSN` cho staging và production, `SENTRY_ORG` và `SENTRY_PROJECT`, rồi tạo EAS secret `SENTRY_AUTH_TOKEN` để upload source map
