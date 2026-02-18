# arken/packages/sigil-protocol/util ANALYSIS

- `getQueryInput` previously dropped Prisma-style `take` because only `limit` existed.
- Added explicit `take` support while retaining `limit` to avoid breaking existing callers.
- Added test coverage to lock pagination behavior and shorthand `where` conversion.
