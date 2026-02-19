# arken/packages/sigil-protocol/util ANALYSIS

- `getQueryInput` previously dropped Prisma-style `take` because only `limit` existed.
- Added explicit `take` support while retaining `limit` to avoid breaking existing callers.
- Added normalization so `limit`-only inputs are mirrored into `take`, preventing downstream pagination drift.
- Added non-negative integer validation for `skip`/`take`/`limit` to fail fast on invalid pagination payloads before resolver/database execution.
- `createPrismaWhereSchema` now accepts single-object logical filters (`NOT`/`AND`/`OR`) in addition to arrays, matching common Prisma-style payloads.
- Field-level `not` now supports nested operator objects (not only scalar values), which aligns with Prisma filter semantics and avoids rejecting valid caller payloads.
- Added test coverage to lock pagination behavior and shorthand `where` conversion, including invalid pagination rejection.
