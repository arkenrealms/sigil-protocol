# arken/packages/sigil-protocol/test

Jest tests for protocol schema helpers.

## Scope
- Query envelope parsing (`getQueryInput`)
- Pagination compatibility (`take` + `limit` aliasing)
- Pagination validation (reject negative and non-integer `skip`/`take`/`limit`)
- Logical filter compatibility (`NOT` object shorthand)
- Field-filter nested `not` operator compatibility (`name: { not: { contains: ... } }`)
