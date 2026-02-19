# arken/packages/sigil-protocol/util

Shared schema helpers for Sigil protocol routers.

## Notes
- `getQueryInput` accepts both `take` and `limit` pagination keys.
- Prefer `take` for Prisma-style callers; keep `limit` for compatibility.
- When only `limit` is provided, parsing now mirrors it into `take` for downstream Prisma-style consumers.
- When only `take` is provided, parsing mirrors it into `limit` to preserve legacy callers that still read `limit`.
- If both `take` and `limit` are provided but differ, `take` is treated as canonical and `limit` is normalized to match.
- Pagination fields (`skip`/`take`/`limit`) are validated as non-negative integers to prevent invalid downstream query envelopes.
- `createPrismaWhereSchema` logical operators (`AND`/`OR`/`NOT`) accept either a single where object or an array.
- Field-level `not` filters accept both scalar shorthand values and nested operator objects (Prisma-compatible), e.g. `{ name: { not: { contains: 'foo' } } }`.
- String-filter `mode` is constrained to Prisma-compatible values (`default` | `insensitive`) to reject unsupported options early.
