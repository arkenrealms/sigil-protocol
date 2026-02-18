# arken/packages/sigil-protocol/util

Shared schema helpers for Sigil protocol routers.

## Notes
- `getQueryInput` accepts both `take` and `limit` pagination keys.
- Prefer `take` for Prisma-style callers; keep `limit` for compatibility.
