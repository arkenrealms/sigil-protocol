# arken/packages/sigil-protocol/test

Jest tests for protocol schema helpers.

## Scope
- Query envelope parsing (`getQueryInput`)
- Pagination compatibility (`take` + `limit` aliasing in both directions)
- Conflict normalization (`take` wins when `take` and `limit` disagree)
- Pagination validation (reject negative and non-integer `skip`/`take`/`limit`)
- Logical filter compatibility (`NOT` object shorthand)
- Field-filter nested `not` operator compatibility (`name: { not: { contains: ... } }`)
- String-filter `mode` validation (`default`/`insensitive` accepted; unsupported modes rejected)
- String-only operator scoping (reject `contains`/`mode` on non-string fields)
- Optional string field compatibility (`z.string().optional()` supports `contains`/`mode`)
- Date shorthand filter compatibility (`where: { createdAt: new Date(...) }` keeps `{ equals: Date }` semantics)
- `orderBy` compatibility (single object and Prisma-style array envelopes)
- `orderBy` direction normalization (`ASC`/`DESC` and padded values normalize to lowercase)
- `orderBy` non-empty clause validation (reject empty objects and empty arrays)
- `orderBy` field-key validation (reject blank/whitespace sort keys)
- Exported `Query` logical clause compatibility (`AND`/`OR`/`NOT` accept object and non-empty array envelopes)
- Logical no-op protection (reject empty `AND`/`OR` arrays)
- `where` no-op protection (reject empty `where: {}` envelopes)
- Field-operator validation in top-level `Query.where` (reject empty operator objects and unknown operator keys)
- Projection-key validation (`include`/`select` reject blank/whitespace-padded field names)
- Projection no-op guard (`include`/`select` reject empty objects)
- Reserved-key validation (`orderBy`/`include`/`select` reject `__proto__`/`prototype`/`constructor`)
- Cursor envelope validation (reject empty/blank/whitespace-padded/reserved-key cursors; accept safe non-empty cursor fields)
