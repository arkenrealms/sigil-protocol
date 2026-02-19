# arken/packages/sigil-protocol/test ANALYSIS

- Added focused regression tests for `getQueryInput`.
- Validates Prisma-style `take` preservation, legacy `limit` compatibility, and `limit`→`take` normalization.
- Validates pagination fields reject invalid values (negative and non-integer numbers).
- Validates Prisma-style single-object `NOT` clauses are accepted and normalized.
- Uses repo-defined `npm test` script (dist + jest) to satisfy source-change test gate.
