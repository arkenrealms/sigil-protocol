# arken/packages/sigil-protocol/util

Shared schema helpers for Sigil protocol routers.

## Notes
- `getQueryInput` accepts both `take` and `limit` pagination keys.
- Prefer `take` for Prisma-style callers; keep `limit` for compatibility.
- When only `limit` is provided, parsing now mirrors it into `take` for downstream Prisma-style consumers.
- `createPrismaWhereSchema` logical operators (`AND`/`OR`/`NOT`) accept either a single where object or an array.
