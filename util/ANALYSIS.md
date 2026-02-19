# arken/packages/sigil-protocol/util ANALYSIS

- `getQueryInput` previously dropped Prisma-style `take` because only `limit` existed.
- Added explicit `take` support while retaining `limit` to avoid breaking existing callers.
- Added normalization so `limit`-only inputs are mirrored into `take`, preventing downstream pagination drift.
- `createPrismaWhereSchema` now accepts single-object logical filters (`NOT`/`AND`/`OR`) in addition to arrays, matching common Prisma-style payloads.
- Added test coverage to lock pagination behavior and shorthand `where` conversion.
