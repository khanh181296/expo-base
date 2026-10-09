# Đóng góp

## Quy trình

1. Tạo nhánh từ `main`: `feat/<ten-ngan>`, `fix/<ten-ngan>`, `chore/<ten-ngan>`.
2. Code theo quy ước trong [README](README.md#quy-ước) và [AGENTS.md](AGENTS.md).
3. Commit theo [Conventional Commits](https://www.conventionalcommits.org): `feat(notes): add search`. commitlint sẽ kiểm tra.
4. `pnpm check` phải pass trước khi mở PR (pre-commit đã chạy lint và format cho file đã sửa).
5. Mở PR, điền template, cần ít nhất 1 người review.

## Thêm thư viện

- Thư viện Expo hoặc có native code: `pnpm expo install <tên>` để lấy đúng version cho SDK.
- Thư viện JS thuần: `pnpm add <tên>`.
- Có native code thì phải build lại development build (`pnpm ios` / `pnpm android` hoặc `pnpm build:dev`).
- Ghi lý do chọn thư viện lớn vào `docs/adr/`.

## Nâng Expo SDK

Làm mỗi lần một SDK, trên nhánh riêng:

```bash
pnpm expo install expo@^<sdk> --fix
pnpm doctor
pnpm prebuild
pnpm check
```

Đọc changelog: https://expo.dev/changelog. Renovate không tự nâng các package do Expo quản lý.

## Test

- Logic (hooks, store, utils, api): Jest, đặt `*.test.ts` cạnh file.
- Component: React Native Testing Library (`await render(...)`, `userEvent`).
- Luồng chính: Maestro trong `.maestro/` (`pnpm e2e`), dùng `testID` thay vì chữ hiển thị.
- Coverage có ngưỡng tối thiểu trong `jest.config.js`; chỉ được nâng, không hạ.
