# arken/packages/sigil-protocol/test ANALYSIS

- Added focused regression tests for `getQueryInput`.
- Validates Prisma-style `take` preservation and legacy `limit` compatibility.
- Uses repo-defined `npm test` script (dist + jest) to satisfy source-change test gate.
