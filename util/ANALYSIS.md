# arken/packages/sigil-protocol/util ANALYSIS

- `getQueryInput` previously dropped Prisma-style `take` because only `limit` existed.
- Added explicit `take` support while retaining `limit` to avoid breaking existing callers.
- Added normalization so `limit`-only inputs are mirrored into `take`, preventing downstream pagination drift.
- Added reciprocal normalization so `take`-only inputs are mirrored into `limit`, preserving backward-compatibility for callers still keyed on `limit`.
- Added conflict normalization for mixed `take`/`limit` envelopes: `take` is canonical and `limit` is rewritten to match.
- Added non-negative integer validation for `skip`/`take`/`limit` to fail fast on invalid pagination payloads before resolver/database execution.
- `createPrismaWhereSchema` now accepts single-object logical filters (`NOT`/`AND`/`OR`) in addition to non-empty arrays, matching common Prisma-style payloads while rejecting no-op empty arrays.
- Field-level `not` now supports nested operator objects (not only scalar values), which aligns with Prisma filter semantics and avoids rejecting valid caller payloads.
- Tightened string-filter `mode` to Prisma-compatible enum values (`default`/`insensitive`) instead of unrestricted strings, preventing silent acceptance of unsupported modes.
- Scoped string-only operators (`contains` / `startsWith` / `endsWith` / `mode`) to string fields only; this prevents invalid filter payloads from being accepted for numeric/date fields and shifts failures to schema-parse time.
- Fixed optional/nullable/default/effects wrapper handling when inferring field type so optional string fields still expose valid string operators (previously `z.string().optional()` was misclassified and rejected `contains`/`mode`).
- Added `orderBy` compatibility for both single-object and Prisma-style array envelopes, reducing query-shape rejection for multi-sort callers.
- Added `orderBy` direction normalization (trim + lowercase) so uppercase/padded directions like `" DESC "` are accepted and normalized while unsupported directions still fail validation.
- Hardened `orderBy` clause validation to reject empty sort objects (`{}`), preventing ambiguous/no-op sort payloads from silently passing schema checks.
- Extended `orderBy` validation to reject empty array envelopes (`[]`) for both `Query` and `getQueryInput`, so multi-sort callers must send at least one clause instead of an ambiguous no-op.
- Added test coverage to lock pagination behavior and shorthand `where` conversion, including invalid pagination rejection and `orderBy` array support.
- Fixed shorthand filter coercion for non-plain object scalars (e.g. `Date`): only plain objects are treated as operator envelopes, so `where: { createdAt: new Date(...) }` now correctly normalizes to `{ createdAt: { equals: ... } }` instead of being stripped.
- Hardened exported `Query` logical clause compatibility: `AND`/`OR`/`NOT` now accept either a single nested where object or an array, matching `createPrismaWhereSchema` and Prisma-style payloads.
