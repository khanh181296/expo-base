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

Mặc định `.env.development` bật `USE_MOCK_API=true`, nên app chạy được ngay không cần backend.
Đăng nhập bằng email bất kỳ và mật khẩu từ 8 ký tự trở lên.
Access token mock hết hạn sau 60 giây, dùng để thử luồng refresh token.
Đăng ký bằng `taken@example.com` để thử lỗi email đã tồn tại.

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
    ui/                Design system: Button, Text, Input, FormInput, Screen, Sheet...
    feedback/          toast, dialog.confirm, loading overlay (gọi được từ mọi nơi)
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

## Scripts

| Lệnh                                                    | Mô tả                                                        |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| `pnpm check`                                            | typecheck, lint, format và test (giống CI)                   |
| `pnpm typecheck` / `lint` / `format` / `test`           | Chạy riêng từng bước                                         |
| `pnpm doctor`                                           | expo-doctor                                                  |
| `pnpm prebuild`                                         | Sinh lại `ios/` và `android/` (không commit hai thư mục này) |
| `pnpm build:dev` / `build:staging` / `build:production` | EAS Build                                                    |

Commit theo Conventional Commits (`feat: …`, `fix: …`), được commitlint kiểm tra.

## Trước khi dùng cho dự án thật

- [ ] Đổi `BASE` trong `env.js` (tên app, slug, scheme, bundle ID)
- [ ] Chạy `eas init` và điền `EAS_PROJECT_ID`, `EXPO_ACCOUNT_OWNER`
- [ ] Đổi icon và splash trong `assets/`
- [ ] Sửa `features/auth/api.ts` cho khớp API thật, rồi tắt `USE_MOCK_API`
- [ ] Đổi token màu trong `global.css` và `palette.ts`
- [ ] Điền `SENTRY_DSN` cho staging và production, `SENTRY_ORG` và `SENTRY_PROJECT`, rồi tạo EAS secret `SENTRY_AUTH_TOKEN` để upload source map
