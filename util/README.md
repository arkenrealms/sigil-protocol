# arken/packages/sigil-protocol/util

Shared schema helpers for Sigil protocol routers.

## Notes
- `getQueryInput` accepts both `take` and `limit` pagination keys.
- Prefer `take` for Prisma-style callers; keep `limit` for compatibility.
- When only `limit` is provided, parsing now mirrors it into `take` for downstream Prisma-style consumers.
- Pagination fields (`skip`/`take`/`limit`) are validated as non-negative integers to prevent invalid downstream query envelopes.
- `createPrismaWhereSchema` logical operators (`AND`/`OR`/`NOT`) accept either a single where object or an array.
- Field-level `not` filters accept both scalar shorthand values and nested operator objects (Prisma-compatible), e.g. `{ name: { not: { contains: 'foo' } } }`.
