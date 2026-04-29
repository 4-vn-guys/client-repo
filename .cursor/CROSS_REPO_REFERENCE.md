# Cross-Repo Reference (Frontend + Backend)

## Repositories
- Frontend root: `/Users/levidang/Documents/Personal-project/client-repo`
- Backend root: `/Users/levidang/Documents/Personal-project/book-my-court`

Use these exact absolute paths when debugging or implementing cross-cutting features.

## Backend Quick Map (Elysia)
- Controllers: `/Users/levidang/Documents/Personal-project/book-my-court/src/controllers`
- Services: `/Users/levidang/Documents/Personal-project/book-my-court/src/application/services`
- DTO/validation schemas: `/Users/levidang/Documents/Personal-project/book-my-court/src/presentation/dtos`
- Domain models: `/Users/levidang/Documents/Personal-project/book-my-court/src/domain/models`
- Error types/utils: `/Users/levidang/Documents/Personal-project/book-my-court/src/utils`

## Frontend Quick Map (Next.js + FSD)
- API clients:
  - `/Users/levidang/Documents/Personal-project/client-repo/src/entities/booking/api`
  - `/Users/levidang/Documents/Personal-project/client-repo/src/entities/venue/api`
  - `/Users/levidang/Documents/Personal-project/client-repo/src/shared/lib/axios.ts`
- Booking UI/features:
  - `/Users/levidang/Documents/Personal-project/client-repo/src/features/booking-calendar`
  - `/Users/levidang/Documents/Personal-project/client-repo/src/features/owner/booking-form`
  - `/Users/levidang/Documents/Personal-project/client-repo/src/entities/booking/model`

## Cross-Repo Debug Flow
For bug fixes and feature work, follow this order:

1. Reproduce in frontend and capture request/response payload.
2. Trace frontend API call in `src/entities/*/api`.
3. Locate backend route in `src/controllers`.
4. Confirm DTO validation in `src/presentation/dtos`.
5. Trace business logic in `src/application/services`.
6. Update both sides (types/contracts/UI + controller/service/tests).
7. Run tests in both repos before PR.

## Contract-First Rule
- If backend DTO changes, update frontend API DTO/types in the same task.
- If frontend sends new fields, add backend validation and tests in the same task.
- Keep naming consistent across layers (`bookingTitle`, `userName`, `statusPayment`, etc.).

## Common Commands

Frontend:
- `cd "/Users/levidang/Documents/Personal-project/client-repo"`
- `bun test` or project test script
- `bun run lint`
- `bun run typecheck`

Backend:
- `cd "/Users/levidang/Documents/Personal-project/book-my-court"`
- `bunx vitest run`
- `bun run typecheck`
- `bun run lint`

## Agent Usage Snippet
Use this in a new chat when requesting cross-repo work:

`Use /Users/levidang/Documents/Personal-project/client-repo/.cursor/CROSS_REPO_REFERENCE.md for path mapping. The task may require updates in both frontend and backend repositories. Keep API contract and tests synchronized.`
