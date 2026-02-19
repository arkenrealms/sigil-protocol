// arken/packages/sigil-protocol/test/queryInput.test.ts
import { getQueryInput, z } from '../util/schema';

describe('getQueryInput', () => {
  const model = z.object({
    name: z.string(),
    level: z.number(),
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
});
