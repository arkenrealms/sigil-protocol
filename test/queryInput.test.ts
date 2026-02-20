// arken/packages/sigil-protocol/test/queryInput.test.ts
import { Query, getQueryInput, z } from '../util/schema';

describe('getQueryInput', () => {
  const model = z.object({
    name: z.string(),
    level: z.number(),
    createdAt: z.date(),
  });

  it('keeps Prisma-style take pagination when provided', () => {
    const schema = getQueryInput(model);
    const parsed = schema.parse({
      take: 25,
      where: { name: 'ranger' },
    });

    expect(parsed).toBeDefined();
    expect(parsed?.take).toBe(25);
    expect(parsed?.where?.name?.equals).toBe('ranger');
  });

  it('preserves legacy limit pagination for backward compatibility', () => {
    const schema = getQueryInput(model);
    const parsed = schema.parse({ limit: 50 });

    expect(parsed).toBeDefined();
    expect(parsed?.limit).toBe(50);
    expect(parsed?.take).toBe(50);
  });

  it('mirrors take-only pagination into limit for compatibility callers', () => {
    const schema = getQueryInput(model);
    const parsed = schema.parse({ take: 12 });

    expect(parsed).toBeDefined();
    expect(parsed?.take).toBe(12);
    expect(parsed?.limit).toBe(12);
  });

  it('normalizes conflicting take/limit values to take as canonical', () => {
    const schema = getQueryInput(model);
    const parsed = schema.parse({ take: 7, limit: 3 });

    expect(parsed).toBeDefined();
    expect(parsed?.take).toBe(7);
    expect(parsed?.limit).toBe(7);
  });

  it('supports Prisma-style single-object NOT filters', () => {
    const schema = getQueryInput(model);
    const parsed = schema.parse({
      where: {
        NOT: { name: 'mage' },
      },
    });

    expect(parsed?.where?.NOT).toBeDefined();
    expect(Array.isArray(parsed?.where?.NOT)).toBe(false);
    expect((parsed?.where?.NOT as any)?.name?.equals).toBe('mage');
  });

  it('supports nested not operator objects inside field filters', () => {
    const schema = getQueryInput(model);
    const parsed = schema.parse({
      where: {
        name: {
          not: { contains: 'mage' },
        },
      },
    });

    expect(parsed?.where?.name?.not).toBeDefined();
    expect((parsed?.where?.name?.not as any)?.contains).toBe('mage');
  });

  it('accepts Prisma-compatible string filter mode values', () => {
    const schema = getQueryInput(model);
    const parsed = schema.parse({
      where: {
        name: {
          contains: 'mage',
          mode: 'insensitive',
        },
      },
    });

    expect(parsed?.where?.name?.mode).toBe('insensitive');
  });

  it('supports string operators for optional string fields', () => {
    const schema = getQueryInput(
      z.object({
        nickname: z.string().optional(),
      }),
    );

    const parsed = schema.parse({
      where: {
        nickname: {
          contains: 'arch',
          mode: 'insensitive',
        },
      },
    });

    expect(parsed?.where?.nickname?.contains).toBe('arch');
    expect(parsed?.where?.nickname?.mode).toBe('insensitive');
  });

  it('rejects string-only operators on non-string fields', () => {
    const schema = getQueryInput(model);

    expect(() =>
      schema.parse({
        where: {
          level: {
            contains: '2',
          },
        },
      }),
    ).toThrow();

    expect(() =>
      schema.parse({
        where: {
          createdAt: {
            mode: 'insensitive',
          },
        },
      }),
    ).toThrow();
  });

  it('preserves Date shorthand filters as equals clauses', () => {
    const schema = getQueryInput(model);
    const now = new Date('2026-02-18T20:00:00.000Z');
    const parsed = schema.parse({
      where: {
        createdAt: now,
      },
    });

    expect(parsed?.where?.createdAt?.equals).toEqual(now);
  });

  it('rejects unsupported string filter mode values', () => {
    const schema = getQueryInput(model);

    expect(() =>
      schema.parse({
        where: {
          name: {
            contains: 'mage',
            mode: 'wild',
          },
        },
      }),
    ).toThrow();
  });

  it('supports Prisma-style orderBy arrays', () => {
    const schema = getQueryInput(model);
    const parsed = schema.parse({
      orderBy: [{ level: 'desc' }, { name: 'asc' }],
    });

    expect(Array.isArray(parsed?.orderBy)).toBe(true);
    expect(parsed?.orderBy).toEqual([{ level: 'desc' }, { name: 'asc' }]);
  });

  it('normalizes uppercase and padded orderBy directions', () => {
    const schema = getQueryInput(model);
    const parsed = schema.parse({
      orderBy: [{ level: ' DESC ' }, { name: 'ASC' }],
    });

    expect(parsed?.orderBy).toEqual([{ level: 'desc' }, { name: 'asc' }]);
  });

  it('rejects invalid orderBy direction values', () => {
    const schema = getQueryInput(model);

    expect(() =>
      schema.parse({
        orderBy: [{ level: 'descending' as any }],
      }),
    ).toThrow();
  });

  it('rejects empty orderBy objects', () => {
    const schema = getQueryInput(model);

    expect(() =>
      schema.parse({
        orderBy: [{}],
      }),
    ).toThrow();

    expect(() =>
      schema.parse({
        orderBy: {},
      }),
    ).toThrow();
  });

  it('rejects empty orderBy arrays', () => {
    const schema = getQueryInput(model);

    expect(() =>
      schema.parse({
        orderBy: [],
      }),
    ).toThrow();

    expect(() =>
      Query.parse({
        where: { name: { equals: 'archer' } },
        orderBy: [],
      }),
    ).toThrow();
  });

  it('rejects blank or padded orderBy field keys', () => {
    const schema = getQueryInput(model);

    expect(() =>
      schema.parse({
        orderBy: [{ '': 'asc' }],
      }),
    ).toThrow();

    expect(() =>
      schema.parse({
        orderBy: [{ ' name ': 'asc' }],
      }),
    ).toThrow();

    expect(() =>
      Query.parse({
        where: { name: { equals: 'archer' } },
        orderBy: { ' ': 'desc' },
      }),
    ).toThrow();
  });

  it('Query accepts single-object logical clauses for Prisma compatibility', () => {
    const parsed = Query.parse({
      where: {
        NOT: {
          name: { equals: 'mage' },
        },
      },
    });

    expect(Array.isArray(parsed.where?.NOT)).toBe(false);
    expect((parsed.where?.NOT as any)?.name?.equals).toBe('mage');
  });

  it('Query accepts array logical clauses and preserves mixed nesting', () => {
    const parsed = Query.parse({
      where: {
        OR: [
          { status: { equals: 'Active' } },
          {
            AND: {
              name: { contains: 'arch' },
            },
          },
        ],
      },
    });

    expect(Array.isArray(parsed.where?.OR)).toBe(true);
    expect((parsed.where?.OR as any)?.[0]?.status?.equals).toBe('Active');
    expect(Array.isArray((parsed.where?.OR as any)?.[1]?.AND)).toBe(false);
  });

  it('rejects empty logical arrays to avoid no-op Prisma filters', () => {
    const schema = getQueryInput(model);

    expect(() =>
      schema.parse({
        where: {
          OR: [],
        },
      }),
    ).toThrow();

    expect(() =>
      Query.parse({
        where: {
          AND: [],
        },
      }),
    ).toThrow();
  });

  it('rejects empty where envelopes to avoid no-op filters', () => {
    const schema = getQueryInput(model);

    expect(() =>
      schema.parse({
        where: {},
      }),
    ).toThrow();

    expect(() =>
      Query.parse({
        where: {},
      }),
    ).toThrow();
  });

  it('rejects negative pagination values', () => {
    const schema = getQueryInput(model);

    expect(() => schema.parse({ skip: -1 })).toThrow();
    expect(() => schema.parse({ take: -5 })).toThrow();
    expect(() => schema.parse({ limit: -10 })).toThrow();
  });

  it('rejects non-integer pagination values', () => {
    const schema = getQueryInput(model);

    expect(() => schema.parse({ skip: 1.2 })).toThrow();
    expect(() => schema.parse({ take: 2.5 })).toThrow();
    expect(() => schema.parse({ limit: 3.8 })).toThrow();
  });

  it('rejects blank or padded include/select field keys', () => {
    const schema = getQueryInput(model);

    expect(() =>
      schema.parse({
        include: { ' ': true },
      }),
    ).toThrow();

    expect(() =>
      schema.parse({
        include: { ' owner ': true },
      }),
    ).toThrow();

    expect(() =>
      schema.parse({
        select: { '': false },
      }),
    ).toThrow();

    expect(() =>
      schema.parse({
        select: { ' name ': true },
      }),
    ).toThrow();

    expect(() =>
      Query.parse({
        include: { '\t': true },
      }),
    ).toThrow();
  });

  it('rejects empty include/select envelopes', () => {
    const schema = getQueryInput(model);

    expect(() =>
      schema.parse({
        include: {},
      }),
    ).toThrow();

    expect(() =>
      schema.parse({
        select: {},
      }),
    ).toThrow();

    expect(() =>
      Query.parse({
        include: {},
      }),
    ).toThrow();
  });

  it('accepts include/select with non-empty field keys', () => {
    const schema = getQueryInput(model);
    const parsed = schema.parse({
      include: { owner: true },
      select: { name: true },
    });

    expect(parsed?.include).toEqual({ owner: true });
    expect(parsed?.select).toEqual({ name: true });
  });

  it('rejects reserved prototype-pollution field keys', () => {
    const schema = getQueryInput(model);

    expect(() =>
      schema.parse({
        orderBy: [{ __proto__: 'asc' } as any],
      }),
    ).toThrow();

    expect(() =>
      schema.parse({
        include: { constructor: true },
      }),
    ).toThrow();

    expect(() =>
      Query.parse({
        select: { prototype: true },
      }),
    ).toThrow();
  });

  it('rejects empty cursor envelopes', () => {
    const schema = getQueryInput(model);

    expect(() =>
      schema.parse({
        cursor: {},
      }),
    ).toThrow();

    expect(() =>
      Query.parse({
        cursor: {},
      }),
    ).toThrow();
  });

  it('rejects blank, padded, or reserved cursor field keys', () => {
    const schema = getQueryInput(model);

    expect(() =>
      schema.parse({
        cursor: { ' ': 'abc' },
      }),
    ).toThrow();

    expect(() =>
      schema.parse({
        cursor: { ' id ': 'abc' },
      }),
    ).toThrow();

    expect(() =>
      schema.parse({
        cursor: { __proto__: 'abc' } as any,
      }),
    ).toThrow();
  });

  it('accepts cursor with non-empty safe field keys', () => {
    const schema = getQueryInput(model);
    const parsed = schema.parse({
      cursor: { id: '507f1f77bcf86cd799439011' },
    });

    expect(parsed?.cursor).toEqual({ id: '507f1f77bcf86cd799439011' });
  });
});
